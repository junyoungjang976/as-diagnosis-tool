'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEstimateStore, TravelRate } from '@/lib/stores/estimateStore';
import { formatCurrency } from '@/lib/estimate';
import { useEffect, useState } from 'react';

export function TravelCostSection() {
  const { travelRate, setTravelRate } = useEstimateStore();
  const [availableRates, setAvailableRates] = useState<TravelRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rates/travel')
      .then((res) => res.json())
      .then((data) => {
        setAvailableRates(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load travel rates:', error);
        setLoading(false);
      });
  }, []);

  const handleRateChange = (rateId: string) => {
    const rate = availableRates.find((r) => r.id === rateId);
    setTravelRate(rate || null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>출장비</CardTitle>
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
        <CardTitle>출장비</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={travelRate?.id || ''}
          onValueChange={handleRateChange}
          className="space-y-3"
        >
          {availableRates.map((rate) => (
            <div
              key={rate.id}
              className="flex items-center justify-between space-x-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={rate.id} id={`travel-${rate.id}`} />
                <Label
                  htmlFor={`travel-${rate.id}`}
                  className="cursor-pointer font-normal"
                >
                  {rate.distance}
                </Label>
              </div>
              <span className="text-sm font-medium">
                {formatCurrency(rate.rate)}
              </span>
            </div>
          ))}
        </RadioGroup>

        {travelRate && (
          <div className="border-t mt-4 pt-3 flex items-center justify-between">
            <span className="font-medium">선택된 출장비</span>
            <span className="text-lg font-bold">
              {formatCurrency(travelRate.rate)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
