/**
 * PDF Utilities
 * 견적서 PDF 생성을 위한 유틸리티 함수들
 */

/**
 * 금액을 한국 원화 형식으로 포맷
 * @example 1000000 -> "1,000,000원"
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/**
 * 날짜를 한국 형식으로 포맷
 * @example new Date() -> "2024년 01월 15일"
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 견적서 번호 생성
 * @example "EST-20240115-0001"
 */
export function generateEstimateNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `EST-${year}${month}${day}-${random}`;
}

/**
 * 파일명 생성
 * @example "견적서_홍길동_20240115.pdf"
 */
export function generatePDFFileName(customerName: string, date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const sanitizedName = customerName.replace(/[^a-zA-Z0-9가-힣]/g, '_');
  return `견적서_${sanitizedName}_${year}${month}${day}.pdf`;
}

/**
 * 유효기간 계산 (발행일로부터 30일)
 */
export function calculateValidUntil(issueDate: Date): Date {
  const validUntil = new Date(issueDate);
  validUntil.setDate(validUntil.getDate() + 30);
  return validUntil;
}
