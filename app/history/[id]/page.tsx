import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HistoryDetailActions } from '@/components/history/HistoryDetailActions'
import { Calendar, User, MapPin, Mail, Phone, Wrench } from 'lucide-react'

interface HistoryDetailPageProps {
  params: Promise<{
    id: string
  }>
}

const statusConfig = {
  draft: { label: '진행중', variant: 'secondary' as const },
  sent: { label: '발송됨', variant: 'default' as const },
  accepted: { label: '승인됨', variant: 'default' as const },
  rejected: { label: '거절됨', variant: 'destructive' as const },
}

export default async function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const { id } = await params

  const diagnosis = await prisma.diagnosis.findUnique({
    where: { id },
    include: {
      equipment: {
        include: {
          category: true,
        },
      },
      estimate: true,
    },
  })

  if (!diagnosis) {
    notFound()
  }

  const estimate = diagnosis.estimate
  const status = estimate?.status as keyof typeof statusConfig || 'draft'
  const { label, variant } = statusConfig[status]

  let parts: Array<{ name: string; quantity: number; unitPrice: number; total: number }> = []
  if (estimate?.parts) {
    try {
      parts = JSON.parse(estimate.parts)
    } catch (error) {
      console.error('Failed to parse parts:', error)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <div className="container mx-auto max-w-4xl p-4 space-y-4">
        <div className="flex items-center justify-between pt-4">
          <div>
            <h1 className="text-2xl font-bold">진단 상세</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(diagnosis.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <Badge variant={variant}>{label}</Badge>
        </div>

        {/* 고객 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">고객 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{diagnosis.customerName || '미입력'}</span>
            </div>
            {diagnosis.customerContact && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{diagnosis.customerContact}</span>
              </div>
            )}
            {diagnosis.customerEmail && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{diagnosis.customerEmail}</span>
              </div>
            )}
            {diagnosis.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{diagnosis.location}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 장비 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">장비 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{diagnosis.equipment.name}</span>
              {diagnosis.equipment.model && (
                <span className="text-sm text-muted-foreground">
                  ({diagnosis.equipment.model})
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {diagnosis.equipment.category.name}
            </div>
          </CardContent>
        </Card>

        {/* 진단 메모 */}
        {diagnosis.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">진단 소견</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{diagnosis.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* 견적 정보 */}
        {estimate && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">부품 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {parts.map((part, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <div className="font-medium">{part.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {part.quantity}개 × {part.unitPrice.toLocaleString('ko-KR')}원
                        </div>
                      </div>
                      <div className="font-semibold">
                        {part.total.toLocaleString('ko-KR')}원
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">견적 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">부품비</span>
                  <span>{parts.reduce((sum, p) => sum + p.total, 0).toLocaleString('ko-KR')}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">공임</span>
                  <span>{estimate.laborCost.toLocaleString('ko-KR')}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">출장비</span>
                  <span>{estimate.travelCost.toLocaleString('ko-KR')}원</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold text-lg">
                  <span>총 견적금액</span>
                  <span>{estimate.totalAmount.toLocaleString('ko-KR')}원</span>
                </div>
                {estimate.validUntil && (
                  <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      유효기간: {new Date(estimate.validUntil).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                )}
                {estimate.notes && (
                  <div className="pt-2 text-sm">
                    <div className="text-muted-foreground mb-1">비고</div>
                    <p className="whitespace-pre-wrap">{estimate.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        <HistoryDetailActions
          diagnosisId={diagnosis.id}
          estimateId={estimate?.id}
          pdfUrl={estimate?.pdfUrl}
        />
      </div>
    </div>
  )
}
