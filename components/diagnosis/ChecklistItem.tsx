'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useDiagnosisStore } from '@/lib/stores/diagnosisStore';
import { PartsSelector } from './PartsSelector';

interface ChecklistItemProps {
  item: {
    id: string;
    item: string;
    description?: string | null;
  };
  availableParts: Array<{
    id: string;
    name: string;
    partNumber?: string | null;
    price: number;
  }>;
}

export function ChecklistItem({ item, availableParts }: ChecklistItemProps) {
  const { checkResults, updateCheckResult } = useDiagnosisStore();
  const [showNote, setShowNote] = useState(false);

  const checkResult = checkResults.find(r => r.itemId === item.id) || {
    itemId: item.id,
    checked: false,
    hasProblem: false,
    note: '',
  };

  const handleCheck = (checked: boolean) => {
    updateCheckResult(item.id, { checked });
  };

  const handleProblemToggle = (hasProblem: boolean) => {
    updateCheckResult(item.id, { hasProblem });
  };

  const handleNoteChange = (note: string) => {
    updateCheckResult(item.id, { note });
  };

  return (
    <Card className={`mb-3 ${checkResult.hasProblem ? 'border-orange-500 bg-orange-50' : ''}`}>
      <CardContent className="pt-6">
        {/* 체크박스 및 항목명 */}
        <div className="flex items-start gap-3 mb-3">
          <Checkbox
            id={`check-${item.id}`}
            checked={checkResult.checked}
            onCheckedChange={handleCheck}
            className="mt-1 h-6 w-6 min-w-[24px]"
          />
          <div className="flex-1">
            <Label
              htmlFor={`check-${item.id}`}
              className="text-base font-medium cursor-pointer"
            >
              {item.item}
            </Label>
            {item.description && (
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            )}
          </div>
        </div>

        {/* 문제 발견 토글 */}
        {checkResult.checked && (
          <div className="ml-9 space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`problem-${item.id}`}
                checked={checkResult.hasProblem}
                onCheckedChange={handleProblemToggle}
                className="h-5 w-5"
              />
              <Label
                htmlFor={`problem-${item.id}`}
                className="text-sm font-medium cursor-pointer flex items-center gap-1"
              >
                <AlertCircle size={16} className="text-orange-500" />
                문제 발견
              </Label>
            </div>

            {/* 부품 선택 */}
            {checkResult.hasProblem && (
              <PartsSelector
                checklistItemId={item.id}
                availableParts={availableParts}
              />
            )}

            {/* 메모 입력 */}
            <div>
              <button
                type="button"
                onClick={() => setShowNote(!showNote)}
                className="text-sm text-blue-600 hover:underline mb-2"
              >
                {showNote ? '메모 숨기기' : '메모 추가'}
              </button>
              {showNote && (
                <Textarea
                  value={checkResult.note || ''}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="특이사항을 입력하세요..."
                  className="min-h-[80px]"
                />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
