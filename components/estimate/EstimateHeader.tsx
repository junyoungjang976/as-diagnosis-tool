'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EstimateHeaderProps {
  diagnosis: {
    customerName?: string | null;
    customerContact?: string | null;
    customerEmail?: string | null;
    location?: string | null;
    equipment: {
      name: string;
      model?: string | null;
      category: {
        name: string;
      };
    };
  };
}

export function EstimateHeader({ diagnosis }: EstimateHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>견적 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 고객 정보 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">고객 정보</h3>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <div>
              <span className="font-medium">고객명:</span>{' '}
              <span>{diagnosis.customerName || '-'}</span>
            </div>
            <div>
              <span className="font-medium">연락처:</span>{' '}
              <span>{diagnosis.customerContact || '-'}</span>
            </div>
            <div>
              <span className="font-medium">이메일:</span>{' '}
              <span>{diagnosis.customerEmail || '-'}</span>
            </div>
            <div>
              <span className="font-medium">위치:</span>{' '}
              <span>{diagnosis.location || '-'}</span>
            </div>
          </div>
        </div>

        {/* 장비 정보 */}
        <div className="space-y-2 border-t pt-4">
          <h3 className="text-sm font-medium text-muted-foreground">장비 정보</h3>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <div>
              <span className="font-medium">카테고리:</span>{' '}
              <span>{diagnosis.equipment.category.name}</span>
            </div>
            <div>
              <span className="font-medium">장비명:</span>{' '}
              <span>{diagnosis.equipment.name}</span>
            </div>
            {diagnosis.equipment.model && (
              <div>
                <span className="font-medium">모델명:</span>{' '}
                <span>{diagnosis.equipment.model}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
