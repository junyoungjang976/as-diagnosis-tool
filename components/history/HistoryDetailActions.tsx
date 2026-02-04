'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Mail, Link2, Edit, Trash2, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface HistoryDetailActionsProps {
  diagnosisId: string
  estimateId?: string
  pdfUrl?: string | null
}

export function HistoryDetailActions({ diagnosisId, estimateId, pdfUrl }: HistoryDetailActionsProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleResendEmail = async () => {
    // TODO: Implement email resend
    toast.success('견적서를 이메일로 재전송했습니다.')
  }

  const handleCopyLink = async () => {
    if (pdfUrl) {
      await navigator.clipboard.writeText(pdfUrl)
      toast.success('견적서 링크가 클립보드에 복사되었습니다.')
    }
  }

  const handleEdit = () => {
    router.push(`/estimate/${diagnosisId}`)
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/history/${diagnosisId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast.success('진단 이력이 삭제되었습니다.')

      router.push('/history')
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('진단 이력 삭제에 실패했습니다.')
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleViewPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 space-y-2">
        <div className="container mx-auto max-w-4xl space-y-2">
          {estimateId && (
            <div className="grid grid-cols-2 gap-2">
              {pdfUrl && (
                <Button variant="outline" onClick={handleViewPdf}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF 보기
                </Button>
              )}
              <Button variant="outline" onClick={handleResendEmail}>
                <Mail className="h-4 w-4 mr-2" />
                이메일 재전송
              </Button>
              {pdfUrl && (
                <Button variant="outline" onClick={handleCopyLink}>
                  <Link2 className="h-4 w-4 mr-2" />
                  링크 복사
                </Button>
              )}
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                견적 수정
              </Button>
            </div>
          )}
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>진단 이력 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 진단 이력과 견적서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
