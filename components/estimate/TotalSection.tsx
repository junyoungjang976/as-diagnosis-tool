'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEstimateStore } from '@/lib/stores/estimateStore';
import { calculateEstimate, formatCurrency } from '@/lib/estimate';
import { Switch } from '@/components/ui/switch';

export function TotalSection() {
  const { parts, selectedLabor, travelRate, includeVAT, notes, toggleVAT, setNotes } =
    useEstimateStore();

  const calculation = calculateEstimate(
    parts,
    selectedLabor,
    travelRate?.rate || 0,
    includeVAT
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>견적 총액</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 소계 항목들 */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">부품 합계</span>
            <span className="font-medium">
              {formatCurrency(calculation.partsTotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">공임 합계</span>
            <span className="font-medium">
              {formatCurrency(calculation.laborTotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">출장비</span>
            <span className="font-medium">
              {formatCurrency(calculation.travelCost)}
            </span>
          </div>
        </div>

        {/* 소계 */}
        <div className="border-t pt-2 flex justify-between">
          <span className="font-medium">소계</span>
          <span className="text-lg font-bold">
            {formatCurrency(calculation.subtotal)}
          </span>
        </div>

        {/* VAT 토글 */}
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="vat-toggle"
              checked={includeVAT}
              onCheckedChange={toggleVAT}
            />
            <Label htmlFor="vat-toggle" className="cursor-pointer">
              부가세 (10%) 포함
            </Label>
          </div>
          {includeVAT && (
            <span className="text-sm font-medium">
              {formatCurrency(calculation.vat)}
            </span>
          )}
        </div>

        {/* 총액 */}
        <div className="border-t-2 pt-3 flex justify-between items-center">
          <span className="text-lg font-bold">총 견적금액</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(calculation.grandTotal)}
          </span>
        </div>

        {/* 비고 */}
        <div className="space-y-2 border-t pt-3">
          <Label htmlFor="notes">비고</Label>
          <Textarea
            id="notes"
            placeholder="추가 내용이나 특이사항을 입력하세요"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
