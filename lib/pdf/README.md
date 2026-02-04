# PDF Generation Module

견적서 PDF 생성 기능 모듈

## 구성 요소

### 1. PDF Template (`estimateTemplate.tsx`)
- `@react-pdf/renderer` 기반 한글 견적서 템플릿
- A4 사이즈, Noto Sans KR 폰트 사용
- 고객 정보, 설비 정보, 진단 요약, 견적 내역 포함

### 2. PDF Utilities (`index.ts`)
- `formatCurrency()` - 금액 포맷 (1,000,000원)
- `formatDate()` - 한국 날짜 포맷 (2024년 01월 15일)
- `generateEstimateNumber()` - 견적서 번호 생성 (EST-20240115-0001)
- `generatePDFFileName()` - PDF 파일명 생성
- `calculateValidUntil()` - 유효기간 계산 (30일)

### 3. API Route (`/api/pdf/generate/route.ts`)
- **POST**: PDF 생성 및 파일 저장
- **GET**: PDF 직접 다운로드
- 생성된 PDF는 `public/pdf/` 디렉토리에 저장
- Estimate 테이블에 `pdfUrl` 자동 업데이트

### 4. Preview Component (`components/pdf/PDFPreview.tsx`)
- 인앱 PDF 미리보기 (iframe)
- 다운로드 버튼
- 인쇄 버튼
- PDF 생성/재생성 버튼

## 사용 방법

### 1. 컴포넌트에서 PDF 미리보기 사용

```tsx
import { PDFPreview } from '@/components/pdf/PDFPreview';

export default function EstimatePage({ estimateId }: { estimateId: string }) {
  return (
    <div>
      <h1>견적서</h1>
      <PDFPreview
        estimateId={estimateId}
        onGenerated={(url) => {
          console.log('PDF generated:', url);
        }}
      />
    </div>
  );
}
```

### 2. API 직접 호출

```typescript
// PDF 생성 및 URL 받기
const response = await fetch('/api/pdf/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ estimateId: 'xxx' }),
});

const { pdfUrl, fileName } = await response.json();
console.log('PDF URL:', pdfUrl); // /pdf/견적서_홍길동_20240115.pdf

// PDF 직접 다운로드
const downloadUrl = `/api/pdf/generate?estimateId=xxx`;
window.open(downloadUrl, '_blank');
```

### 3. 유틸리티 함수 사용

```typescript
import {
  formatCurrency,
  formatDate,
  generateEstimateNumber,
  calculateValidUntil,
} from '@/lib/pdf';

console.log(formatCurrency(1000000)); // "1,000,000원"
console.log(formatDate(new Date())); // "2024년 01월 15일"
console.log(generateEstimateNumber()); // "EST-20240115-0001"
console.log(calculateValidUntil(new Date())); // 30일 후 날짜
```

## 파일 저장 위치

- **생성 경로**: `public/pdf/`
- **파일명 형식**: `견적서_[고객명]_[YYYYMMDD].pdf`
- **접근 URL**: `/pdf/[파일명].pdf`
- **Git 관리**: PDF 파일은 `.gitignore`에 등록됨

## 테스트

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 테스트
# 1. 진단 생성
# 2. 견적 생성
# 3. PDF Preview 컴포넌트에서 "PDF 생성" 버튼 클릭
# 4. 생성된 PDF 미리보기, 다운로드, 인쇄 테스트
```
