'use client';

import { ChecklistItem } from './ChecklistItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDiagnosisStore } from '@/lib/stores/diagnosisStore';
import { CheckCircle2 } from 'lucide-react';

interface ChecklistSectionProps {
  checklistItems: Array<{
    id: string;
    item: string;
    description?: string | null;
    order: number;
  }>;
  availableParts: Array<{
    id: string;
    name: string;
    partNumber?: string | null;
    price: number;
  }>;
}

export function ChecklistSection({ checklistItems, availableParts }: ChecklistSectionProps) {
  const { getCheckedCount, getTotalCount, getProblemCount } = useDiagnosisStore();

  const checkedCount = getCheckedCount();
  const totalCount = getTotalCount() || checklistItems.length;
  const problemCount = getProblemCount();
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* 진행률 표시 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 size={20} />
              점검 체크리스트
            </CardTitle>
            <div className="text-sm font-medium">
              {checkedCount}/{totalCount}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">진행률</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            {problemCount > 0 && (
              <div className="text-sm text-orange-600 font-medium">
                문제 발견: {problemCount}건
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 체크리스트 항목들 */}
      <div className="space-y-3">
        {checklistItems
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              availableParts={availableParts}
            />
          ))}
      </div>
    </div>
  );
}
