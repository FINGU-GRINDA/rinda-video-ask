'use client'

import { useState } from 'react'
import {
  BookOpen,
  Plus,
  Search,
  FileText,
  Globe,
  HelpCircle,
  Upload,
  Trash2,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface KnowledgeItem {
  id: string
  title: string
  content: string
  source_type: 'pdf' | 'url' | 'text' | 'faq'
  source_url: string | null
  is_active: boolean
  created_at: string
}

const sourceIcons = {
  pdf: FileText,
  url: Globe,
  text: FileText,
  faq: HelpCircle,
}

const sourceLabels = {
  pdf: 'PDF',
  url: '웹 URL',
  text: '직접 입력',
  faq: 'FAQ',
}

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [newItem, setNewItem] = useState({
    title: '',
    content: '',
    source_type: 'text' as 'pdf' | 'url' | 'text' | 'faq',
    source_url: '',
  })

  const filteredItems = items.filter(item => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !item.title.toLowerCase().includes(query) &&
        !item.content.toLowerCase().includes(query)
      ) {
        return false
      }
    }
    if (sourceFilter !== 'all' && item.source_type !== sourceFilter) {
      return false
    }
    return true
  })

  const handleAddItem = () => {
    const item: KnowledgeItem = {
      id: crypto.randomUUID(),
      ...newItem,
      source_url: newItem.source_url || null,
      is_active: true,
      created_at: new Date().toISOString(),
    }
    setItems([item, ...items])
    setNewItem({
      title: '',
      content: '',
      source_type: 'text',
      source_url: '',
    })
    setShowAddModal(false)
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">지식 베이스</h1>
          <p className="text-muted-foreground">AI가 답변할 때 참고할 정보를 관리하세요</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          지식 추가
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="지식 베이스 검색..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'text', 'url', 'pdf', 'faq'].map(type => (
            <button
              key={type}
              onClick={() => setSourceFilter(type)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                sourceFilter === type
                  ? 'bg-primary-100 text-primary-600'
                  : 'hover:bg-muted'
              )}
            >
              {type === 'all' ? '전체' : sourceLabels[type as keyof typeof sourceLabels]}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Items */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-4">
          {filteredItems.map(item => {
            const Icon = sourceIcons[item.source_type]

            return (
              <div
                key={item.id}
                className="bg-background rounded-xl border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      item.is_active ? 'bg-primary-100' : 'bg-gray-100'
                    )}>
                      <Icon className={cn(
                        'w-5 h-5',
                        item.is_active ? 'text-primary-600' : 'text-gray-400'
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <span className={cn(
                          'px-2 py-0.5 text-xs rounded-full',
                          item.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        )}>
                          {item.is_active ? '활성' : '비활성'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {item.content}
                      </p>
                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary-500 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {item.source_url}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-background rounded-xl border p-12 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">지식 베이스가 비어있습니다</h3>
          <p className="text-muted-foreground mb-6">
            AI가 고객 질문에 답변할 때 참고할 정보를 추가해주세요
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            첫 지식 추가하기
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">지식 추가</h2>

            <div className="space-y-4">
              {/* Source Type */}
              <div>
                <label className="block text-sm font-medium mb-2">소스 유형</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['text', 'url', 'pdf', 'faq'] as const).map(type => {
                    const Icon = sourceIcons[type]
                    return (
                      <button
                        key={type}
                        onClick={() => setNewItem({ ...newItem, source_type: type })}
                        className={cn(
                          'flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors',
                          newItem.source_type === type
                            ? 'border-primary-500 bg-primary-50'
                            : 'hover:bg-muted'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{sourceLabels[type]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">제목</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="예: 가격 정책, 환불 규정"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Source URL (for url and pdf types) */}
              {(newItem.source_type === 'url' || newItem.source_type === 'pdf') && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {newItem.source_type === 'url' ? '웹 URL' : 'PDF 파일'}
                  </label>
                  {newItem.source_type === 'url' ? (
                    <input
                      type="url"
                      value={newItem.source_url}
                      onChange={(e) => setNewItem({ ...newItem, source_url: e.target.value })}
                      placeholder="https://example.com/page"
                      className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        PDF 파일을 드래그하거나 클릭하여 업로드
                      </p>
                      <input type="file" accept=".pdf" className="hidden" />
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">내용</label>
                <textarea
                  value={newItem.content}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                  placeholder={
                    newItem.source_type === 'faq'
                      ? 'Q: 질문\nA: 답변'
                      : '이 지식의 핵심 내용을 입력하세요...'
                  }
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItem.title || !newItem.content}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
