'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Calendar, Building2 } from 'lucide-react';

interface EstimateData {
  id: string;
  parts: string;
  laborCost: number;
  travelCost: number;
  totalAmount: number;
  validUntil: string | null;
  notes: string | null;
  diagnosis: {
    customerName: string | null;
    equipment: {
      name: string;
      model: string | null;
      category: {
        name: string;
      };
    };
  };
}

interface ShareData {
  success: boolean;
  estimate: EstimateData;
  viewCount: number;
  expiresAt: string;
  error?: string;
}

export default function SharePage() {
  const params = useParams();
  const token = params.token as string;
  const [data, setData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEstimate() {
      try {
        const response = await fetch(`/api/share/${token}`);
        const result = await response.json();

        if (!response.ok) {
          setError(result.error || '견적서를 불러오는데 실패했습니다.');
          return;
        }

        setData(result);
      } catch (err) {
        setError('견적서를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchEstimate();
  }, [token]);

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    window.open(`/api/estimate/${data?.estimate.id}/pdf`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">견적서를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-red-600">오류</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { estimate } = data;
  const parts = JSON.parse(estimate.parts);
  const validUntil = estimate.validUntil ? new Date(estimate.validUntil) : null;
  const expiresAt = new Date(data.expiresAt);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-8 h-8" />
                <h1 className="text-3xl font-bold">부성TK</h1>
              </div>
              <p className="text-blue-100">주방설비 A/S 전문</p>
            </div>
            <FileText className="w-16 h-16 opacity-50" />
          </div>
        </div>

        {/* Customer Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>견적서</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">고객명</p>
                <p className="font-semibold">{estimate.diagnosis.customerName || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">설비</p>
                <p className="font-semibold">
                  {estimate.diagnosis.equipment.category.name} - {estimate.diagnosis.equipment.name}
                </p>
              </div>
              {estimate.diagnosis.equipment.model && (
                <div>
                  <p className="text-sm text-gray-600">모델명</p>
                  <p className="font-semibold">{estimate.diagnosis.equipment.model}</p>
                </div>
              )}
              {validUntil && (
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    견적 유효기간
                  </p>
                  <p className="font-semibold">{validUntil.toLocaleDateString('ko-KR')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Parts Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>부품 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">품목</th>
                    <th className="text-center py-2 px-4">수량</th>
                    <th className="text-right py-2 px-4">단가</th>
                    <th className="text-right py-2 px-4">금액</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((part: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{part.name}</td>
                      <td className="text-center py-3 px-4">{part.quantity}</td>
                      <td className="text-right py-3 px-4">
                        {part.unitPrice.toLocaleString('ko-KR')}원
                      </td>
                      <td className="text-right py-3 px-4 font-semibold">
                        {part.total.toLocaleString('ko-KR')}원
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Cost Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>비용 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">부품비</span>
                <span className="font-semibold">
                  {parts.reduce((sum: number, p: any) => sum + p.total, 0).toLocaleString('ko-KR')}원
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">공임</span>
                <span className="font-semibold">{estimate.laborCost.toLocaleString('ko-KR')}원</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">출장비</span>
                <span className="font-semibold">{estimate.travelCost.toLocaleString('ko-KR')}원</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-2">
                <span className="text-lg font-bold">총 견적금액</span>
                <span className="text-xl font-bold text-blue-600">
                  {estimate.totalAmount.toLocaleString('ko-KR')}원
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {estimate.notes && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>비고</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{estimate.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-center mb-6">
          <Button onClick={handleDownloadPDF} size="lg" className="gap-2">
            <Download className="w-5 h-5" />
            PDF 다운로드
          </Button>
        </div>

        {/* Footer */}
        <Card className="bg-gray-100">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">부성티케이 (BUSUNG TK)</p>
              <p>전화: 02-1234-5678 | 이메일: contact@busungtk.com</p>
              <p>홈페이지: www.busungtk.com</p>
              <p className="text-xs text-gray-500 mt-3">
                이 견적서는 {expiresAt.toLocaleDateString('ko-KR')}까지 유효합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
