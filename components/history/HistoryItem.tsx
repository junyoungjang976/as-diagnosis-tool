'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Wrench, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HistoryItemProps {
  id: string
  date: string
  customerName: string
  equipmentName: string
  totalAmount: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  onClick: () => void
}

const statusConfig = {
  draft: { label: '진행중', variant: 'secondary' as const },
  sent: { label: '발송됨', variant: 'default' as const },
  accepted: { label: '승인됨', variant: 'default' as const },
  rejected: { label: '거절됨', variant: 'destructive' as const },
}

export function HistoryItem({
  date,
  customerName,
  equipmentName,
  totalAmount,
  status,
  onClick,
}: HistoryItemProps) {
  const { label, variant } = statusConfig[status]

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(date).toLocaleDateString('ko-KR')}</span>
          </div>
          <Badge variant={variant}>{label}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{customerName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wrench className="h-4 w-4" />
            <span>{equipmentName}</span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-lg">
              {totalAmount.toLocaleString('ko-KR')}원
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
