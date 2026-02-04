'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, X } from 'lucide-react';
import { useEstimateStore, EstimatePart } from '@/lib/stores/estimateStore';
import { formatCurrency } from '@/lib/estimate';

export function PartsTable() {
  const { parts, updatePartQuantity, removePart } = useEstimateStore();

  const handleQuantityChange = (partId: string, delta: number) => {
    const part = parts.find((p) => p.partId === partId);
    if (!part) return;

    const newQuantity = Math.max(1, part.quantity + delta);
    updatePartQuantity(partId, newQuantity);
  };

  const handleQuantityInput = (partId: string, value: string) => {
    const quantity = parseInt(value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      updatePartQuantity(partId, quantity);
    }
  };

  const calculatePartTotal = (part: EstimatePart) => {
    return part.quantity * part.unitPrice;
  };

  const totalAmount = parts.reduce((sum, part) => sum + calculatePartTotal(part), 0);

  if (parts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>부품 내역</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            선택된 부품이 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>부품 내역</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left font-medium">부품명</th>
                <th className="py-2 text-center font-medium">수량</th>
                <th className="py-2 text-right font-medium">단가</th>
                <th className="py-2 text-right font-medium">금액</th>
                <th className="py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {parts.map((part) => (
                <tr key={part.partId} className="border-b">
                  <td className="py-3">{part.name}</td>
                  <td className="py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleQuantityChange(part.partId, -1)}
                        disabled={part.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={part.quantity}
                        onChange={(e) =>
                          handleQuantityInput(part.partId, e.target.value)
                        }
                        className="h-7 w-16 text-center"
                        min={1}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleQuantityChange(part.partId, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    {formatCurrency(part.unitPrice)}
                  </td>
                  <td className="py-3 text-right font-medium">
                    {formatCurrency(calculatePartTotal(part))}
                  </td>
                  <td className="py-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removePart(part.partId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2">
                <td colSpan={3} className="py-3 text-right font-medium">
                  부품 합계
                </td>
                <td className="py-3 text-right font-bold">
                  {formatCurrency(totalAmount)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
