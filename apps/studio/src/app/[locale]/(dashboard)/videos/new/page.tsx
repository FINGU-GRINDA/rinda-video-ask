'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Settings2 } from 'lucide-react'
import Link from 'next/link'
import { VideoRecorder } from '@/components/video/video-recorder'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function NewVideoPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [showTriggerSettings, setShowTriggerSettings] = useState(false)

  // Trigger settings
  const [triggers, setTriggers] = useState({
    pageUrl: '',
    timeOnPage: 0,
    scrollDepth: 0,
    exitIntent: false,
    returningVisitor: false,
  })

  const supabase = createClient()

  const handleRecordingComplete = (blob: Blob, recordingDuration: number) => {
    setRecordedBlob(blob)
    setDuration(recordingDuration)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('제목을 입력해주세요')
      return
    }

    if (!recordedBlob) {
      toast.error('영상을 녹화해주세요')
      return
    }

    setIsUploading(true)

    try {
      // Get current user's organization
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: membership } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

      if (!membership) throw new Error('No organization found')

      const orgId = (membership as { organization_id: string }).organization_id

      // Get or create default project
      let { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('organization_id', orgId)
        .single()

      if (!project) {
        const { data: newProject, error: projectError } = await supabase
          .from('projects')
          .insert({
            organization_id: orgId,
            name: 'Default Project',
          })
          .select('id')
          .single()

        if (projectError) throw projectError
        project = newProject
      }

      // Upload video to Supabase Storage
      const projectId = (project as { id: string }).id
      const fileName = `${projectId}/${Date.now()}.webm`
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, recordedBlob, {
          contentType: 'video/webm',
          cacheControl: '3600',
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName)

      // Build trigger rules
      const triggerRules = []

      if (triggers.pageUrl) {
        triggerRules.push({
          id: crypto.randomUUID(),
          type: 'page_url',
          operator: 'contains',
          value: triggers.pageUrl,
          priority: 1,
        })
      }

      if (triggers.timeOnPage > 0) {
        triggerRules.push({
          id: crypto.randomUUID(),
          type: 'time_on_page',
          operator: 'greater_than',
          value: triggers.timeOnPage,
          priority: 2,
        })
      }

      if (triggers.scrollDepth > 0) {
        triggerRules.push({
          id: crypto.randomUUID(),
          type: 'scroll_depth',
          operator: 'greater_than',
          value: triggers.scrollDepth,
          priority: 3,
        })
      }

      if (triggers.exitIntent) {
        triggerRules.push({
          id: crypto.randomUUID(),
          type: 'exit_intent',
          operator: 'equals',
          value: true,
          priority: 4,
        })
      }

      if (triggers.returningVisitor) {
        triggerRules.push({
          id: crypto.randomUUID(),
          type: 'returning_visitor',
          operator: 'equals',
          value: true,
          priority: 5,
        })
      }

      // Create video message record
      const { error: insertError } = await supabase
        .from('video_messages')
        .insert({
          project_id: projectId,
          title: title.trim(),
          description: description.trim() || null,
          video_url: publicUrl,
          duration,
          trigger_rules: triggerRules,
          is_active: true,
        })

      if (insertError) throw insertError

      toast.success('영상이 업로드되었습니다!')
      router.push('/videos')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('업로드 중 오류가 발생했습니다')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/videos"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">새 영상 녹화</h1>
            <p className="text-muted-foreground">방문자에게 보여줄 영상을 녹화하세요</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isUploading || !recordedBlob}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              업로드 중...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              저장
            </>
          )}
        </button>
      </div>

      {/* Video Title & Description */}
      <div className="bg-background rounded-xl border p-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            영상 제목 <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 가격 페이지 환영 인사"
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            설명 (선택)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="이 영상이 언제 재생되는지 메모를 남겨두세요"
            rows={2}
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
      </div>

      {/* Video Recorder */}
      <div className="bg-background rounded-xl border p-6">
        <VideoRecorder
          onRecordingComplete={handleRecordingComplete}
          maxDuration={180}
          showTeleprompter={true}
        />
      </div>

      {/* Trigger Settings */}
      <div className="bg-background rounded-xl border">
        <button
          onClick={() => setShowTriggerSettings(!showTriggerSettings)}
          className="w-full p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Settings2 className="w-5 h-5 text-primary-500" />
            <div className="text-left">
              <h3 className="font-medium">트리거 설정</h3>
              <p className="text-sm text-muted-foreground">언제 이 영상을 보여줄지 설정하세요</p>
            </div>
          </div>
          <div className={`transform transition-transform ${showTriggerSettings ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {showTriggerSettings && (
          <div className="px-6 pb-6 space-y-4 border-t pt-4">
            {/* Page URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                페이지 URL 패턴
              </label>
              <input
                type="text"
                value={triggers.pageUrl}
                onChange={(e) => setTriggers({ ...triggers, pageUrl: e.target.value })}
                placeholder="예: /pricing, /demo, /blog"
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                이 URL을 포함한 페이지에서만 영상이 재생됩니다
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Time on Page */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  페이지 체류 시간 (초)
                </label>
                <input
                  type="number"
                  value={triggers.timeOnPage}
                  onChange={(e) => setTriggers({ ...triggers, timeOnPage: Number(e.target.value) })}
                  min={0}
                  placeholder="0"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Scroll Depth */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  스크롤 깊이 (%)
                </label>
                <input
                  type="number"
                  value={triggers.scrollDepth}
                  onChange={(e) => setTriggers({ ...triggers, scrollDepth: Number(e.target.value) })}
                  min={0}
                  max={100}
                  placeholder="0"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Toggle options */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={triggers.exitIntent}
                  onChange={(e) => setTriggers({ ...triggers, exitIntent: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">이탈 의도 감지시</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={triggers.returningVisitor}
                  onChange={(e) => setTriggers({ ...triggers, returningVisitor: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">재방문자에게만</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
