'use client'

import { HistoryItem } from './HistoryItem'
import { Loader2 } from 'lucide-react'

interface HistoryEntry {
  id: string
  createdAt: string
  customerName: string
  equipmentName: string
  totalAmount: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
}

interface HistoryListProps {
  items: HistoryEntry[]
  loading?: boolean
  onItemClick: (id: string) => void
}

export function HistoryList({ items, loading, onItemClick }: HistoryListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">검색 결과가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <HistoryItem
          key={item.id}
          id={item.id}
          date={item.createdAt}
          customerName={item.customerName}
          equipmentName={item.equipmentName}
          totalAmount={item.totalAmount}
          status={item.status}
          onClick={() => onItemClick(item.id)}
        />
      ))}
    </div>
  )
}
