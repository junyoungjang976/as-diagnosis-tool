'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/history/SearchBar'
import { HistoryFilters, FilterStatus } from '@/components/history/HistoryFilters'
import { HistoryList } from '@/components/history/HistoryList'
import { Button } from '@/components/ui/button'
import { ClipboardCheck, Loader2 } from 'lucide-react'

interface HistoryEntry {
  id: string
  createdAt: string
  customerName: string
  equipmentName: string
  totalAmount: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
}

export default function HistoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<HistoryEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  useEffect(() => {
    fetchHistory()
  }, [filterStatus])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== 'all') {
        params.set('status', filterStatus)
      }

      const response = await fetch(`/api/history?${params}`)
      if (!response.ok) throw new Error('Failed to fetch history')

      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      item.customerName.toLowerCase().includes(query) ||
      item.equipmentName.toLowerCase().includes(query)
    )
  })

  const handleItemClick = (id: string) => {
    router.push(`/history/${id}`)
  }

  const handleStartDiagnosis = () => {
    router.push('/')
  }

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="container mx-auto max-w-4xl p-4 space-y-4">
        <div className="pt-4">
          <h1 className="text-2xl font-bold mb-2">진단 이력</h1>
          <p className="text-sm text-muted-foreground">
            과거 진단 및 견적 내역을 확인하세요
          </p>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <HistoryFilters selected={filterStatus} onChange={setFilterStatus} />

        {items.length === 0 && !loading ? (
          <div className="text-center py-16 space-y-4">
            <ClipboardCheck className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <div>
              <p className="text-lg font-medium mb-1">아직 진단 이력이 없습니다</p>
              <p className="text-sm text-muted-foreground">
                첫 진단을 시작해보세요
              </p>
            </div>
            <Button onClick={handleStartDiagnosis} size="lg">
              진단 시작하기
            </Button>
          </div>
        ) : (
          <HistoryList
            items={filteredItems}
            loading={loading && items.length > 0}
            onItemClick={handleItemClick}
          />
        )}
      </div>
    </div>
  )
}
