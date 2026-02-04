'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerInfoForm } from './CustomerInfoForm';
import { ChecklistSection } from './ChecklistSection';
import { DiagnosisSummary } from './DiagnosisSummary';
import { Button } from '@/components/ui/button';
import { useDiagnosisStore } from '@/lib/stores/diagnosisStore';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  model: string | null;
  category: {
    id: string;
    name: string;
  };
}

interface ChecklistItem {
  id: string;
  item: string;
  description: string | null;
  order: number;
}

interface Part {
  id: string;
  name: string;
  partNumber: string | null;
  price: number;
}

interface DiagnosisClientProps {
  equipment: Equipment;
  checklistItems: ChecklistItem[];
  availableParts: Part[];
}

export function DiagnosisClient({
  equipment,
  checklistItems,
  availableParts,
}: DiagnosisClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSave, setLastSave] = useState<Date | null>(null);

  const {
    setEquipmentId,
    customerInfo,
    checkResults,
    selectedParts,
    notes,
    getCheckedCount,
    getTotalCount,
    reset,
  } = useDiagnosisStore();

  // Initialize equipment ID on mount
  useEffect(() => {
    setEquipmentId(equipment.id);
  }, [equipment.id, setEquipmentId]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const checkedCount = getCheckedCount();
      if (checkedCount > 0) {
        setLastSave(new Date());
        // Store in localStorage via zustand persist middleware
        toast.success('자동 저장 완료', { duration: 2000 });
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [getCheckedCount]);

  const handleSubmit = async () => {
    // Validation
    const checkedCount = getCheckedCount();
    if (checkedCount === 0) {
      toast.error('최소 1개 이상의 항목을 점검해주세요');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const diagnosisData = {
        equipmentId: equipment.id,
        customerName: customerInfo.name || null,
        customerContact: customerInfo.contact || null,
        customerEmail: customerInfo.email || null,
        location: customerInfo.location || null,
        checkResults: checkResults.map((result) => ({
          itemId: result.itemId,
          checked: result.checked,
          hasProblem: result.hasProblem,
          note: result.note || null,
          // Include selected parts for this checklist item
          selectedParts: selectedParts
            .filter((p) => p.checklistItemId === result.itemId)
            .map((p) => ({
              partId: p.partId,
              name: p.name,
              partNumber: p.partNumber,
              quantity: p.quantity,
              unitPrice: p.unitPrice,
            })),
        })),
        notes: notes || null,
      };

      const response = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagnosisData),
      });

      if (!response.ok) {
        throw new Error('Failed to save diagnosis');
      }

      const savedDiagnosis = await response.json();

      toast.success('진단이 완료되었습니다');

      // Reset store
      reset();

      // Navigate to estimate page
      router.push(`/estimate/${savedDiagnosis.id}`);
    } catch (error) {
      console.error('Error saving diagnosis:', error);
      toast.error('진단 저장에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    if (getCheckedCount() > 0) {
      if (
        confirm(
          '작성 중인 내용이 있습니다. 정말 나가시겠습니까? (자동 저장된 내용은 유지됩니다)'
        )
      ) {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  };

  const checkedCount = getCheckedCount();
  const totalCount = getTotalCount() || checklistItems.length;
  const isComplete = checkedCount === totalCount && totalCount > 0;

  return (
    <div className="space-y-6 pb-24">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-4"
      >
        <ArrowLeft size={16} className="mr-2" />
        돌아가기
      </Button>

      {/* Customer Info Form */}
      <CustomerInfoForm />

      {/* Checklist Section */}
      <ChecklistSection
        checklistItems={checklistItems}
        availableParts={availableParts}
      />

      {/* Diagnosis Summary */}
      <DiagnosisSummary />

      {/* Auto-save indicator */}
      {lastSave && (
        <div className="text-xs text-muted-foreground text-center">
          마지막 자동 저장: {lastSave.toLocaleTimeString('ko-KR')}
        </div>
      )}

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-sm font-medium">
              진행률: {checkedCount}/{totalCount}
            </div>
            {isComplete && (
              <div className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 size={14} />
                모든 항목 점검 완료
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || checkedCount === 0}
            size="lg"
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} className="mr-2" />
                진단 완료
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
