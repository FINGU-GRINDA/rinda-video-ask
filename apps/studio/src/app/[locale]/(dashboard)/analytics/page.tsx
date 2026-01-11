'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Eye,
  Users,
  Clock,
  TrendingUp,
  Video,
  Target,
  MousePointer,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'

type DateRange = '7days' | '30days' | '90days'

// Mock data
const viewsData = [
  { date: '1/1', views: 120, visitors: 98 },
  { date: '1/2', views: 145, visitors: 112 },
  { date: '1/3', views: 132, visitors: 105 },
  { date: '1/4', views: 178, visitors: 142 },
  { date: '1/5', views: 165, visitors: 128 },
  { date: '1/6', views: 189, visitors: 156 },
  { date: '1/7', views: 210, visitors: 178 },
]

const funnelData = [
  { name: 'Visitors', value: 1000, fill: '#3b82f6' },
  { name: 'Widget Opens', value: 450, fill: '#60a5fa' },
  { name: 'Video Watched', value: 320, fill: '#93c5fd' },
  { name: 'Responses', value: 180, fill: '#bfdbfe' },
  { name: 'Leads', value: 120, fill: '#dbeafe' },
]

const topVideos = [
  { name: '환영 인사 영상', views: 1234, completionRate: 78, responseRate: 45 },
  { name: '제품 소개 영상', views: 987, completionRate: 65, responseRate: 38 },
  { name: '가격 안내 영상', views: 654, completionRate: 82, responseRate: 52 },
  { name: '고객 후기 영상', views: 432, completionRate: 71, responseRate: 41 },
]

const leadsByStatus = [
  { name: '신규', value: 45, color: '#3b82f6' },
  { name: '연락함', value: 28, color: '#f59e0b' },
  { name: '검증됨', value: 18, color: '#22c55e' },
  { name: '전환됨', value: 12, color: '#8b5cf6' },
]

const triggerData = [
  { trigger: '시간 기반', impressions: 1200, opens: 340, responses: 89 },
  { trigger: '스크롤 감지', impressions: 890, opens: 245, responses: 67 },
  { trigger: '이탈 감지', impressions: 560, opens: 178, responses: 45 },
  { trigger: '페이지 기반', impressions: 340, opens: 112, responses: 34 },
]

interface StatCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  trend?: 'up' | 'down'
}

function StatCard({ title, value, change, icon, trend = 'up' }: StatCardProps) {
  const isPositive = change >= 0
  return (
    <div className="bg-card border rounded-xl p-6 card-hover">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
          {icon}
        </div>
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <div
          className={cn(
            'flex items-center gap-1 text-sm font-medium',
            isPositive ? 'text-success-600' : 'text-destructive'
          )}
        >
          {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const t = useTranslations('analytics')
  const [dateRange, setDateRange] = useState<DateRange>('7days')

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: '7days', label: t('dateRange.7days') },
    { value: '30days', label: t('dateRange.30days') },
    { value: '90days', label: t('dateRange.90days') },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  dateRange === option.value
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-card border rounded-lg hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            {t('export')}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-in">
        <StatCard
          title={t('metrics.totalViews')}
          value="12,847"
          change={12.5}
          icon={<Eye className="w-5 h-5" />}
        />
        <StatCard
          title={t('metrics.uniqueVisitors')}
          value="8,234"
          change={8.2}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title={t('metrics.completionRate')}
          value="73.2%"
          change={5.1}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          title={t('metrics.conversionRate')}
          value="4.8%"
          change={-2.3}
          icon={<Target className="w-5 h-5" />}
          trend="down"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Trend Chart */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">{t('charts.viewsTrend')}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-500" />
                <span className="text-muted-foreground">{t('metrics.totalViews')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-muted-foreground">{t('metrics.uniqueVisitors')}</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorViews)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-6">{t('charts.conversionFunnel')}</h3>
          <div className="space-y-4">
            {funnelData.map((item, index) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{item.value.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / funnelData[0].value) * 100}%`,
                      backgroundColor: item.fill,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Videos */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-6">{t('charts.topVideos')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b">
                  <th className="pb-3 font-medium">Video</th>
                  <th className="pb-3 font-medium text-right">{t('metrics.totalViews')}</th>
                  <th className="pb-3 font-medium text-right">{t('metrics.completionRate')}</th>
                  <th className="pb-3 font-medium text-right">{t('metrics.responseRate')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topVideos.map((video, index) => (
                  <tr key={index} className="text-sm">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                          <Video className="w-5 h-5 text-primary-500" />
                        </div>
                        <span className="font-medium text-foreground">{video.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right text-foreground">
                      {video.views.toLocaleString()}
                    </td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-50 text-success-600">
                        {video.completionRate}%
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
                        {video.responseRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leads by Status */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-6">{t('charts.leadsByStatus')}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {leadsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {leadsByStatus.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="text-sm font-medium text-foreground ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trigger Performance */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-6">{t('charts.triggerPerformance')}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={triggerData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis
                dataKey="trigger"
                type="category"
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="impressions" fill="#dbeafe" radius={[0, 4, 4, 0]} name="Impressions" />
              <Bar dataKey="opens" fill="#93c5fd" radius={[0, 4, 4, 0]} name="Opens" />
              <Bar dataKey="responses" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Responses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary-100" />
            <span className="text-sm text-muted-foreground">Impressions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary-300" />
            <span className="text-sm text-muted-foreground">Opens</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary-500" />
            <span className="text-sm text-muted-foreground">Responses</span>
          </div>
        </div>
      </div>
    </div>
  )
}
