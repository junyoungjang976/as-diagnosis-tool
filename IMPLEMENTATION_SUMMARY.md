# PDF Generation Implementation Summary

## 완료된 작업

### 1. 디렉토리 구조 생성 ✅
```
lib/pdf/                    - PDF 템플릿 및 유틸리티
├── estimateTemplate.tsx    - React-PDF 템플릿
├── index.ts                - 유틸리티 함수들
└── README.md               - 사용 가이드

app/api/pdf/generate/       - PDF 생성 API
└── route.ts                - POST/GET 엔드포인트

components/pdf/             - PDF 관련 컴포넌트
└── PDFPreview.tsx          - 미리보기 컴포넌트

app/estimate/[id]/pdf/      - PDF 페이지 예제
└── page.tsx                - 사용 예제

public/pdf/                 - 생성된 PDF 저장소
└── .gitkeep                - Git 추적용
```

### 2. PDF 템플릿 (lib/pdf/estimateTemplate.tsx) ✅
- **@react-pdf/renderer** 기반 한글 견적서
- **A4 사이즈**, Noto Sans KR 웹폰트
- **섹션 구성**:
  - Header: 견적서 제목, 견적번호, 일자, 유효기간
  - 고객 정보: 고객명, 연락처, 현장위치
  - 설비 정보: 설비명, 유형, 진단일시
  - 진단 요약: 문제점 목록 (bullet points)
  - 견적 내역 테이블: 품목, 규격, 수량, 단가, 금액
  - 요약: 소계, 부가세, 합계
  - Footer: 비고, 회사 정보, 유효기간 안내

### 3. 유틸리티 함수 (lib/pdf/index.ts) ✅
- `formatCurrency(amount)` - 금액 포맷: `1,000,000원`
- `formatDate(date)` - 날짜 포맷: `2024년 01월 15일`
- `generateEstimateNumber()` - 견적번호: `EST-20240115-0001`
- `generatePDFFileName(name, date)` - 파일명: `견적서_홍길동_20240115.pdf`
- `calculateValidUntil(date)` - 유효기간 계산 (30일 후)

### 4. PDF 생성 API (app/api/pdf/generate/route.ts) ✅
**POST /api/pdf/generate**
- 요청: `{ estimateId: string }`
- 처리:
  1. Estimate 데이터 조회 (diagnosis, equipment 포함)
  2. PDF 생성 (react-pdf renderToStream)
  3. `public/pdf/` 디렉토리에 파일 저장
  4. Estimate.pdfUrl 업데이트
- 응답: `{ success, pdfUrl, fileName }`

**GET /api/pdf/generate?estimateId=xxx**
- 기존 PDF가 있으면 반환
- 없으면 새로 생성하여 반환
- Content-Type: `application/pdf`
- Content-Disposition: `attachment`

### 5. PDF 미리보기 컴포넌트 (components/pdf/PDFPreview.tsx) ✅
**기능**:
- PDF 생성 버튼
- iframe 미리보기
- 다운로드 버튼
- 인쇄 버튼
- PDF 재생성 버튼
- 로딩 상태 표시
- 에러 처리

**Props**:
```tsx
interface PDFPreviewProps {
  estimateId: string;
  pdfUrl?: string;          // 초기 PDF URL (선택)
  onGenerated?: (url: string) => void;  // 생성 완료 콜백
}
```

### 6. 사용 예제 페이지 ✅
**app/estimate/[id]/pdf/page.tsx**
- PDF 미리보기 페이지 구현 예제
- URL: `/estimate/[id]/pdf`

### 7. Git 설정 ✅
**.gitignore 업데이트**:
```
# Generated PDFs
/public/pdf/*.pdf
!/public/pdf/.gitkeep
```
- PDF 파일은 Git에서 제외
- `.gitkeep` 파일로 디렉토리 구조 유지

## 사용 방법

### 컴포넌트에서 사용
```tsx
import { PDFPreview } from '@/components/pdf/PDFPreview';

<PDFPreview
  estimateId="estimate-id"
  onGenerated={(url) => console.log('Generated:', url)}
/>
```

### API 직접 호출
```typescript
// PDF 생성
const res = await fetch('/api/pdf/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ estimateId: 'xxx' }),
});
const { pdfUrl } = await res.json();

// 다운로드
window.open(`/api/pdf/generate?estimateId=xxx`, '_blank');
```

## 테스트 계획

### 1. 기본 기능 테스트
```bash
npm run dev
```
1. 진단(Diagnosis) 생성
2. 견적(Estimate) 생성
3. `/estimate/[id]/pdf` 페이지 접속
4. "PDF 생성" 버튼 클릭
5. PDF 미리보기 확인
6. 다운로드 버튼 테스트
7. 인쇄 버튼 테스트

### 2. 확인사항
- [ ] 한글이 올바르게 렌더링되는지
- [ ] 테이블 레이아웃이 깨지지 않는지
- [ ] 금액 포맷이 정확한지 (1,000,000원)
- [ ] 날짜 포맷이 한국 형식인지 (2024년 01월 15일)
- [ ] PDF 파일이 `public/pdf/` 에 저장되는지
- [ ] `pdfUrl`이 데이터베이스에 업데이트되는지
- [ ] 다운로드가 정상 작동하는지
- [ ] 인쇄가 정상 작동하는지

### 3. 엣지 케이스 테스트
- [ ] 고객 정보가 없는 경우 ("고객명 없음" 표시)
- [ ] 진단 요약이 비어있는 경우
- [ ] 부품이 많아서 여러 페이지가 되는 경우
- [ ] 특수문자가 포함된 고객명
- [ ] 동일한 견적서를 여러 번 생성할 때

## 커스터마이징 포인트

### 1. 회사 정보 변경
`lib/pdf/estimateTemplate.tsx` 파일의 Footer 섹션:
```tsx
<Text style={styles.footerText}>부성티케이</Text>
<Text style={styles.footerText}>
  전화: 02-1234-5678 | 이메일: info@busungtk.com
</Text>
```

### 2. 색상 변경
`styles` 객체에서 색상 수정:
```tsx
tableHeader: {
  backgroundColor: '#374151',  // 테이블 헤더 색
  color: 'white',
},
```

### 3. 로고 추가
템플릿의 Header 섹션에 Image 컴포넌트 추가:
```tsx
import { Image } from '@react-pdf/renderer';

<View style={{ width: 100 }}>
  <Image src="/logo.png" style={{ width: 80 }} />
</View>
```

### 4. 부가세 활성화
API route에서 부가세 계산 추가:
```typescript
const vat = Math.round(estimate.totalAmount * 0.1);
const total = estimate.totalAmount + vat;
```

## 다음 단계 (선택 사항)

### 1. 이메일 전송 기능
- PDF를 이메일로 고객에게 전송
- Nodemailer 이미 설치됨

### 2. 견적서 버전 관리
- 수정할 때마다 새 버전 생성
- 버전 히스토리 추적

### 3. PDF 서명 기능
- 디지털 서명 추가
- 승인 워크플로우

### 4. 템플릿 커스터마이징 UI
- 관리자 페이지에서 템플릿 편집
- 로고, 색상, 레이아웃 변경

## 파일 목록

### 새로 생성된 파일
1. `lib/pdf/index.ts` - 유틸리티 함수
2. `lib/pdf/estimateTemplate.tsx` - PDF 템플릿
3. `lib/pdf/README.md` - 사용 가이드
4. `app/api/pdf/generate/route.ts` - API 엔드포인트
5. `components/pdf/PDFPreview.tsx` - 미리보기 컴포넌트
6. `app/estimate/[id]/pdf/page.tsx` - 사용 예제
7. `public/pdf/.gitkeep` - Git 추적용

### 수정된 파일
1. `.gitignore` - PDF 파일 제외 규칙 추가

## 의존성

기존 `package.json`에 이미 설치된 패키지 사용:
- `@react-pdf/renderer: ^4.3.2` ✅
- `@prisma/client: ^7.3.0` ✅
- `next: 16.1.6` ✅

추가 설치 필요 없음!

## 문제 해결

### PDF 생성 실패
1. 콘솔 에러 확인
2. Estimate 데이터 존재 여부 확인
3. `public/pdf/` 디렉토리 권한 확인

### 한글 깨짐
1. 브라우저 콘솔에서 폰트 로드 확인
2. 인터넷 연결 확인 (Noto Sans KR 웹폰트)

### 파일 저장 실패
1. `public/pdf/` 디렉토리 존재 확인
2. 파일 시스템 쓰기 권한 확인
3. 디스크 공간 확인
