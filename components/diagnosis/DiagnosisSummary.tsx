'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDiagnosisStore } from '@/lib/stores/diagnosisStore';
import { Package, AlertTriangle, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function DiagnosisSummary() {
  const { selectedParts, getPartsTotal, notes, setNotes, getProblemCount } = useDiagnosisStore();

  const partsTotal = getPartsTotal();
  const problemCount = getProblemCount();

  // 부품별로 그룹화 (같은 부품이 여러 체크리스트 항목에서 선택된 경우)
  const groupedParts = selectedParts.reduce((acc, part) => {
    const existing = acc.find(p => p.partId === part.partId);
    if (existing) {
      existing.totalQuantity += part.quantity;
      existing.totalPrice += part.quantity * part.unitPrice;
    } else {
      acc.push({
        partId: part.partId,
        name: part.name,
        partNumber: part.partNumber,
        unitPrice: part.unitPrice,
        totalQuantity: part.quantity,
        totalPrice: part.quantity * part.unitPrice,
      });
    }
    return acc;
  }, [] as Array<{
    partId: string;
    name: string;
    partNumber?: string | null;
    unitPrice: number;
    totalQuantity: number;
    totalPrice: number;
  }>);

  return (
    <div className="space-y-4">
      {/* 종합 소견 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText size={20} />
            종합 소견
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="overall-notes">진단 소견 및 특이사항</Label>
            <Textarea
              id="overall-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="전체적인 점검 결과와 특이사항을 입력하세요..."
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 문제 요약 */}
      {problemCount > 0 && (
        <Card className="border-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
              <AlertTriangle size={20} />
              발견된 문제
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              총 <span className="font-bold text-orange-700">{problemCount}건</span>의 문제가 발견되었습니다.
            </div>
          </CardContent>
        </Card>
      )}

      {/* 교체 부품 요약 */}
      {groupedParts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package size={20} />
              교체 부품 요약
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groupedParts.map((part) => (
                <div
                  key={part.partId}
                  className="flex justify-between items-start pb-3 border-b last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="font-medium">{part.name}</div>
                    {part.partNumber && (
                      <div className="text-xs text-gray-500">{part.partNumber}</div>
                    )}
                    <div className="text-sm text-gray-600 mt-1">
                      {part.unitPrice.toLocaleString()}원 × {part.totalQuantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {part.totalPrice.toLocaleString()}원
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-3 border-t-2 border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">총 부품 비용</span>
                  <span className="font-bold text-lg text-blue-600">
                    {partsTotal.toLocaleString()}원
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  * 공임 및 출장비는 견적서에서 추가됩니다
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {groupedParts.length === 0 && problemCount === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            아직 선택된 교체 부품이 없습니다
          </CardContent>
        </Card>
      )}
    </div>
  );
}
