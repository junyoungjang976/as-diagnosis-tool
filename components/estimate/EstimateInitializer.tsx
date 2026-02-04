'use client';

import { useEffect } from 'react';
import { useEstimateStore, EstimatePart } from '@/lib/stores/estimateStore';

interface EstimateInitializerProps {
  initialParts: EstimatePart[];
  existingEstimate?: {
    parts: string;
    notes: string | null;
  } | null;
}

export function EstimateInitializer({
  initialParts,
  existingEstimate,
}: EstimateInitializerProps) {
  const { setParts, setNotes, reset } = useEstimateStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 초기화
    reset();

    if (existingEstimate) {
      // 기존 견적서가 있으면 해당 데이터로 초기화
      try {
        const parts = JSON.parse(existingEstimate.parts);
        setParts(parts);
        if (existingEstimate.notes) {
          setNotes(existingEstimate.notes);
        }
      } catch (error) {
        console.error('Failed to parse existing estimate:', error);
        setParts(initialParts);
      }
    } else {
      // 새 견적서면 진단에서 선택된 부품으로 초기화
      setParts(initialParts);
    }

    // 컴포넌트 언마운트 시 클린업
    return () => {
      reset();
    };
  }, [initialParts, existingEstimate, setParts, setNotes, reset]);

  return null;
}
