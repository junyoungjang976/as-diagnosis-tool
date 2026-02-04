'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type FilterStatus = 'all' | 'draft' | 'sent' | 'accepted' | 'rejected'

interface HistoryFiltersProps {
  selected: FilterStatus
  onChange: (status: FilterStatus) => void
}

const filters = [
  { value: 'all' as const, label: '전체' },
  { value: 'draft' as const, label: '진행중' },
  { value: 'sent' as const, label: '발송됨' },
  { value: 'accepted' as const, label: '승인됨' },
  { value: 'rejected' as const, label: '거절됨' },
]

export function HistoryFilters({ selected, onChange }: HistoryFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <Badge
          key={filter.value}
          variant={selected === filter.value ? 'default' : 'outline'}
          className={cn(
            'cursor-pointer whitespace-nowrap transition-colors',
            selected === filter.value && 'shadow-sm'
          )}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </Badge>
      ))}
    </div>
  )
}
