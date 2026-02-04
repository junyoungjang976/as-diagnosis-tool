'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDiagnosisStore } from '@/lib/stores/diagnosisStore';

export function CustomerInfoForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { customerInfo, setCustomerInfo } = useDiagnosisStore();

  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">고객 정보</CardTitle>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">고객명</Label>
            <Input
              id="customer-name"
              value={customerInfo.name || ''}
              onChange={(e) => setCustomerInfo({ name: e.target.value })}
              placeholder="고객명을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-contact">연락처</Label>
            <Input
              id="customer-contact"
              type="tel"
              value={customerInfo.contact || ''}
              onChange={(e) => setCustomerInfo({ contact: e.target.value })}
              placeholder="010-1234-5678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-email">이메일</Label>
            <Input
              id="customer-email"
              type="email"
              value={customerInfo.email || ''}
              onChange={(e) => setCustomerInfo({ email: e.target.value })}
              placeholder="customer@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-location">현장 위치</Label>
            <Input
              id="customer-location"
              value={customerInfo.location || ''}
              onChange={(e) => setCustomerInfo({ location: e.target.value })}
              placeholder="서울시 강남구..."
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
