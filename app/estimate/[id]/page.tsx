import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { EstimateHeader } from '@/components/estimate/EstimateHeader';
import { PartsTable } from '@/components/estimate/PartsTable';
import { LaborCostSection } from '@/components/estimate/LaborCostSection';
import { TravelCostSection } from '@/components/estimate/TravelCostSection';
import { TotalSection } from '@/components/estimate/TotalSection';
import { EstimateActions } from '@/components/estimate/EstimateActions';
import { EstimateInitializer } from '@/components/estimate/EstimateInitializer';

interface EstimatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EstimatePage({ params }: EstimatePageProps) {
  const { id: diagnosisId } = await params;

  // 진단 데이터 로드 (장비, 고객 정보 포함)
  const diagnosis = await prisma.diagnosis.findUnique({
    where: { id: diagnosisId },
    include: {
      equipment: {
        include: {
          category: true,
          parts: true,
        },
      },
      estimate: true,
    },
  });

  if (!diagnosis) {
    notFound();
  }

  // 체크리스트 결과에서 선택된 부품 추출
  let checkResults: Array<{ itemId: string; checked: boolean; note?: string }> = [];
  try {
    checkResults = JSON.parse(diagnosis.checkResults);
  } catch (error) {
    console.error('Failed to parse check results:', error);
  }

  // 선택된 부품 목록 (초기값)
  const selectedParts = diagnosis.equipment.parts.map((part: any) => ({
    partId: part.id,
    name: part.name,
    quantity: 1,
    unitPrice: part.price,
  }));

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <div className="container mx-auto max-w-5xl space-y-6 p-4 pt-6">
        {/* 견적 정보 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">견적서 작성</h1>
            <p className="text-sm text-muted-foreground">
              진단 결과를 바탕으로 견적서를 작성하세요
            </p>
          </div>
        </div>

        {/* 고객 및 장비 정보 */}
        <EstimateHeader diagnosis={diagnosis} />

        {/* 부품 내역 */}
        <PartsTable />

        {/* 공임 선택 */}
        <LaborCostSection />

        {/* 출장비 선택 */}
        <TravelCostSection />

        {/* 총액 및 비고 */}
        <TotalSection />

        {/* 액션 버튼 (고정 하단) */}
        <EstimateActions
          diagnosisId={diagnosisId}
          estimateId={diagnosis.estimate?.id}
        />

        {/* 초기 데이터 로드 (클라이언트 컴포넌트) */}
        <EstimateInitializer
          initialParts={selectedParts}
          existingEstimate={diagnosis.estimate}
        />
      </div>
    </div>
  );
}
