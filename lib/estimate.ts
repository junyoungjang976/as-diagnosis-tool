/**
 * 견적서 계산 로직
 */

export interface EstimatePart {
  partId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface EstimateCalculation {
  partsTotal: number;
  laborTotal: number;
  travelCost: number;
  subtotal: number;
  vat: number;
  grandTotal: number;
}

/**
 * 부품 총액 계산
 */
export function calculatePartsTotal(parts: EstimatePart[]): number {
  return parts.reduce((sum, part) => {
    return sum + (part.quantity * part.unitPrice);
  }, 0);
}

/**
 * 공임 총액 계산
 */
export function calculateLaborTotal(selectedLabor: { rate: number }[]): number {
  return selectedLabor.reduce((sum, labor) => sum + labor.rate, 0);
}

/**
 * 전체 견적 계산
 */
export function calculateEstimate(
  parts: EstimatePart[],
  selectedLabor: { rate: number }[],
  travelCost: number,
  includeVAT: boolean = false
): EstimateCalculation {
  const partsTotal = calculatePartsTotal(parts);
  const laborTotal = calculateLaborTotal(selectedLabor);
  const subtotal = partsTotal + laborTotal + travelCost;
  const vat = includeVAT ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = subtotal + vat;

  return {
    partsTotal,
    laborTotal,
    travelCost,
    subtotal,
    vat,
    grandTotal,
  };
}

/**
 * 금액을 한국 원화 형식으로 포맷
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/**
 * 견적서 데이터 검증
 */
export function validateEstimate(
  parts: EstimatePart[],
  selectedLabor: unknown[],
  travelCost: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (parts.length === 0) {
    errors.push('부품을 최소 1개 이상 선택해주세요.');
  }

  if (parts.some(p => p.quantity <= 0)) {
    errors.push('부품 수량은 1개 이상이어야 합니다.');
  }

  if (selectedLabor.length === 0) {
    errors.push('작업 유형을 최소 1개 이상 선택해주세요.');
  }

  if (travelCost < 0) {
    errors.push('출장비는 0원 이상이어야 합니다.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
