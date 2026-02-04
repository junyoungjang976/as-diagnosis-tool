'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useEstimateStore, LaborType } from '@/lib/stores/estimateStore';
import { formatCurrency } from '@/lib/estimate';
import { useEffect, useState } from 'react';

export function LaborCostSection() {
  const { selectedLabor, toggleLabor } = useEstimateStore();
  const [availableLabor, setAvailableLabor] = useState<LaborType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rates/labor')
      .then((res) => res.json())
      .then((data) => {
        setAvailableLabor(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load labor rates:', error);
        setLoading(false);
      });
  }, []);

  const isChecked = (laborId: string) => {
    return selectedLabor.some((l) => l.id === laborId);
  };

  const totalLaborCost = selectedLabor.reduce((sum, labor) => sum + labor.rate, 0);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>공임</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">로딩 중...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>공임</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {availableLabor.map((labor) => (
            <div key={labor.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`labor-${labor.id}`}
                  checked={isChecked(labor.id)}
                  onCheckedChange={() => toggleLabor(labor)}
                />
                <Label
                  htmlFor={`labor-${labor.id}`}
                  className="cursor-pointer font-normal"
                >
                  {labor.name}
                </Label>
              </div>
              <span className="text-sm font-medium">
                {formatCurrency(labor.rate)}
              </span>
            </div>
          ))}
        </div>

        {selectedLabor.length > 0 && (
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="font-medium">공임 합계</span>
            <span className="text-lg font-bold">
              {formatCurrency(totalLaborCost)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
