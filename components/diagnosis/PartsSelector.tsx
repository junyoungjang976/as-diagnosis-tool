'use client';

import { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDiagnosisStore, SelectedPart } from '@/lib/stores/diagnosisStore';

interface PartsSelectorProps {
  checklistItemId: string;
  availableParts: Array<{
    id: string;
    name: string;
    partNumber?: string | null;
    price: number;
  }>;
}

export function PartsSelector({ checklistItemId, availableParts }: PartsSelectorProps) {
  const { selectedParts, addSelectedPart, removeSelectedPart, updatePartQuantity } = useDiagnosisStore();
  const [selectedPartId, setSelectedPartId] = useState<string>('');

  const currentItemParts = selectedParts.filter(
    p => p.checklistItemId === checklistItemId
  );

  const handleAddPart = () => {
    if (!selectedPartId) return;

    const part = availableParts.find(p => p.id === selectedPartId);
    if (!part) return;

    const newPart: SelectedPart = {
      partId: part.id,
      name: part.name,
      partNumber: part.partNumber,
      quantity: 1,
      unitPrice: part.price,
      checklistItemId,
    };

    addSelectedPart(newPart);
    setSelectedPartId('');
  };

  const handleQuantityChange = (partId: string, delta: number) => {
    const part = currentItemParts.find(p => p.partId === partId);
    if (!part) return;

    const newQuantity = Math.max(1, part.quantity + delta);
    updatePartQuantity(partId, checklistItemId, newQuantity);
  };

  const handleRemovePart = (partId: string) => {
    removeSelectedPart(partId, checklistItemId);
  };

  // 이미 선택된 부품 제외
  const availableToAdd = availableParts.filter(
    p => !currentItemParts.some(cp => cp.partId === p.id)
  );

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">교체 부품 선택</div>

      {/* 선택된 부품 목록 */}
      {currentItemParts.length > 0 && (
        <div className="space-y-2">
          {currentItemParts.map((part) => (
            <Card key={part.partId} className="bg-white">
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{part.name}</div>
                    {part.partNumber && (
                      <div className="text-xs text-gray-500">{part.partNumber}</div>
                    )}
                    <div className="text-sm text-gray-700 mt-1">
                      {part.unitPrice.toLocaleString()}원 × {part.quantity} = {' '}
                      <span className="font-medium">
                        {(part.unitPrice * part.quantity).toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(part.partId, -1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {part.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(part.partId, 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePart(part.partId)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 부품 추가 */}
      {availableToAdd.length > 0 && (
        <div className="flex gap-2">
          <Select value={selectedPartId} onValueChange={setSelectedPartId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="부품 선택..." />
            </SelectTrigger>
            <SelectContent>
              {availableToAdd.map((part) => (
                <SelectItem key={part.id} value={part.id}>
                  <div className="flex flex-col">
                    <span>{part.name}</span>
                    <span className="text-xs text-gray-500">
                      {part.partNumber && `${part.partNumber} · `}
                      {part.price.toLocaleString()}원
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={handleAddPart}
            disabled={!selectedPartId}
            size="sm"
          >
            <Plus size={16} className="mr-1" />
            추가
          </Button>
        </div>
      )}

      {availableToAdd.length === 0 && currentItemParts.length > 0 && (
        <p className="text-xs text-gray-500">모든 부품이 선택되었습니다</p>
      )}
    </div>
  );
}
