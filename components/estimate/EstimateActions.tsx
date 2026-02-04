'use client';

import { Button } from '@/components/ui/button';
import { FileText, Save, Send } from 'lucide-react';
import { useEstimateStore } from '@/lib/stores/estimateStore';
import { calculateEstimate, validateEstimate } from '@/lib/estimate';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EstimateActionsProps {
  diagnosisId: string;
  estimateId?: string;
}

export function EstimateActions({ diagnosisId, estimateId }: EstimateActionsProps) {
  const router = useRouter();
  const { parts, selectedLabor, travelRate, includeVAT, notes } = useEstimateStore();
  const [saving, setSaving] = useState(false);

  const handlePreviewPDF = () => {
    // TODO: PDF 미리보기 구현
    console.log('PDF 미리보기');
  };

  const handleSave = async () => {
    // 유효성 검사
    const validation = validateEstimate(parts, selectedLabor, travelRate?.rate || 0);
    if (!validation.valid) {
      alert(validation.errors.join('\n'));
      return;
    }

    setSaving(true);

    try {
      const calculation = calculateEstimate(
        parts,
        selectedLabor,
        travelRate?.rate || 0,
        includeVAT
      );

      const payload = {
        diagnosisId,
        parts: parts.map((p) => ({
          partId: p.partId,
          name: p.name,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          total: p.quantity * p.unitPrice,
        })),
        laborCost: calculation.laborTotal,
        travelCost: calculation.travelCost,
        totalAmount: calculation.grandTotal,
        notes,
      };

      const method = estimateId ? 'PUT' : 'POST';
      const url = estimateId ? `/api/estimate/${estimateId}` : '/api/estimate';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('견적서 저장 실패');
      }

      const data = await response.json();
      alert('견적서가 저장되었습니다.');

      // 새로 생성한 경우 해당 견적서로 이동
      if (!estimateId && data.id) {
        router.push(`/estimate/${diagnosisId}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('견적서 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    // TODO: 견적서 발송 구현 (이메일 등)
    alert('견적서 발송 기능은 준비 중입니다.');
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 border-t bg-background p-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={handlePreviewPDF}
          className="w-full sm:w-auto"
        >
          <FileText className="mr-2 h-4 w-4" />
          PDF 미리보기
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? '저장 중...' : '견적서 저장'}
        </Button>
        <Button
          variant="default"
          onClick={handleSend}
          className="w-full sm:w-auto"
        >
          <Send className="mr-2 h-4 w-4" />
          발송하기
        </Button>
      </div>
    </div>
  );
}
