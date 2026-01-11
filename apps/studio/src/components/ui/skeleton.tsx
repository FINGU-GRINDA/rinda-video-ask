import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      style={style}
    />
  )
}

export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-4 w-full', className)} />
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-10 rounded-full', className)} />
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-6 space-y-4', className)}>
      <div className="flex items-center gap-4">
        <SkeletonAvatar />
        <div className="space-y-2 flex-1">
          <SkeletonText className="w-1/3" />
          <SkeletonText className="w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonText />
        <SkeletonText className="w-4/5" />
      </div>
    </div>
  )
}

export function SkeletonTableRow({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center gap-4 py-4 border-b', className)}>
      <SkeletonAvatar className="h-8 w-8" />
      <SkeletonText className="flex-1" />
      <SkeletonText className="w-24" />
      <SkeletonText className="w-16" />
    </div>
  )
}

export function SkeletonChart({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <SkeletonText className="w-32 h-6" />
        <SkeletonText className="w-24 h-8" />
      </div>
      <div className="h-64 flex items-end gap-2">
        {[40, 65, 45, 80, 55, 70, 60, 75, 50, 85, 65, 70].map((height, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-sm"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function SkeletonStatCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-6', className)}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <SkeletonText className="w-24" />
      </div>
      <SkeletonText className="h-8 w-20 mb-2" />
      <SkeletonText className="w-16 h-3" />
    </div>
  )
}
