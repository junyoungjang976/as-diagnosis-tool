# PDF Generation Testing Guide

## Pre-Test Checklist

✅ **Dependencies**: `@react-pdf/renderer` already installed in package.json
✅ **Directories Created**:
- `lib/pdf/` - PDF templates and utilities
- `components/pdf/` - React components
- `app/api/pdf/generate/` - API endpoint
- `public/pdf/` - File storage

✅ **Files Created**:
1. `lib/pdf/index.ts` - Utility functions (formatCurrency, formatDate, generateEstimateNumber, etc.)
2. `lib/pdf/estimateTemplate.tsx` - React-PDF template with Korean support
3. `lib/pdf/README.md` - Documentation
4. `app/api/pdf/generate/route.ts` - POST/GET API endpoints
5. `components/pdf/PDFPreview.tsx` - Preview component with download/print
6. `app/estimate/[id]/pdf/page.tsx` - Example usage page

## Testing Steps

### 1. Start Development Server

```bash
cd C:\Users\jangj\projects\busungtk\as-diagnosis-tool
npm run dev
```

### 2. Create Test Data

Navigate to the app and create:
1. **Equipment Category** (가열설비)
2. **Equipment** (가스레인지)
3. **Checklist Items** for the equipment
4. **Parts** with prices
5. **Diagnosis** with customer info
6. **Estimate** based on the diagnosis

### 3. Test PDF Preview Page

Navigate to: `/estimate/[your-estimate-id]/pdf`

**Expected behavior**:
- Shows "PDF 생성" button
- Click button → Loading spinner appears
- PDF generates and shows in iframe
- Three buttons appear: Download, Print, PDF 재생성

### 4. Test API Endpoint Directly

#### Test POST endpoint:
```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d "{\"estimateId\": \"your-estimate-id\"}"
```

**Expected response**:
```json
{
  "success": true,
  "pdfUrl": "/pdf/견적서_고객명_20240115.pdf",
  "fileName": "견적서_고객명_20240115.pdf"
}
```

#### Test GET endpoint:
```bash
curl http://localhost:3000/api/pdf/generate?estimateId=your-estimate-id --output test.pdf
```

**Expected**: Downloads PDF file

### 5. Verify PDF Content

Open the generated PDF and verify:

#### Header Section
- [ ] "견적서" title is centered and prominent
- [ ] 견적번호 format: `EST-20240115-XXXX`
- [ ] 견적일자 format: `2024년 01월 15일`
- [ ] 유효기간 format: `2024년 02월 14일` (30 days later)

#### Customer Information
- [ ] 고객명 displays correctly
- [ ] 연락처 displays correctly
- [ ] 현장위치 displays correctly
- [ ] Section has bordered box styling

#### Equipment & Diagnosis
- [ ] 설비명 displays correctly
- [ ] 설비유형 (category name) displays correctly
- [ ] 진단일시 in Korean date format
- [ ] 진단 요약 shows bullet points for issues

#### Estimate Details Table
- [ ] Table header: 품목 | 규격/모델 | 수량 | 단가 | 금액
- [ ] Parts rows display correctly
- [ ] 공임 row if laborCost > 0
- [ ] 출장비 row if travelCost > 0
- [ ] Currency format: `1,000,000원` with commas

#### Summary Section
- [ ] 소계 (Subtotal)
- [ ] 부가세 (VAT) if applicable
- [ ] 합계 (Total) in bold/highlighted style

#### Footer
- [ ] 비고/특이사항 if provided
- [ ] Company info: 부성티케이
- [ ] Contact: Phone, Email, Address
- [ ] Notice: "본 견적서는 발행일로부터 30일간 유효합니다"

### 6. Test Korean Font Rendering

- [ ] All Korean characters render correctly (not as boxes)
- [ ] Font looks professional (Noto Sans KR)
- [ ] No text overlapping or cutoff

### 7. Test File System

Check that PDF file was saved:
```bash
ls C:\Users\jangj\projects\busungtk\as-diagnosis-tool\public\pdf\
```

**Expected**: Should see `견적서_[고객명]_[날짜].pdf` file

### 8. Test Database Update

Query the database:
```javascript
// In browser console or API test
const estimate = await fetch('/api/estimate/[id]').then(r => r.json());
console.log(estimate.pdfUrl); // Should be: "/pdf/견적서_XXX.pdf"
```

### 9. Test Download Function

Click "다운로드" button:
- [ ] File downloads to browser's download folder
- [ ] Filename format: `견적서_[고객명]_[날짜].pdf`
- [ ] File opens correctly in PDF viewer

### 10. Test Print Function

Click "인쇄" button:
- [ ] Opens print dialog
- [ ] PDF displays correctly in print preview
- [ ] Can print to PDF or physical printer

### 11. Test PDF Regeneration

Click "PDF 재생성" button:
- [ ] Shows loading state
- [ ] Generates new PDF
- [ ] Updates iframe preview
- [ ] New file saved (may overwrite old one)

### 12. Test Edge Cases

#### Empty/Missing Data
Create estimates with:
- [ ] No customer name → Shows "고객명 없음"
- [ ] No contact → Shows "연락처 없음"
- [ ] No location → Shows "위치 정보 없음"
- [ ] No diagnosis summary → Section should handle gracefully

#### Special Characters
- [ ] Customer name with spaces: "홍 길 동"
- [ ] Customer name with special chars: "홍길동(대표)"
- [ ] Notes with line breaks

#### Large Data
- [ ] Many parts (15+) → Should paginate correctly
- [ ] Long part names → Should wrap or truncate
- [ ] Large amounts → Format correctly (1,000,000,000원)

### 13. Test Error Handling

#### Invalid Estimate ID
```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d "{\"estimateId\": \"invalid-id\"}"
```
**Expected**: `{ "error": "Estimate not found" }` with 404 status

#### Missing Estimate ID
```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d "{}"
```
**Expected**: `{ "error": "estimateId is required" }` with 400 status

## Component Integration Test

Create a test page to verify the PDFPreview component:

```tsx
// In any page component
import { PDFPreview } from '@/components/pdf/PDFPreview';

export default function TestPage() {
  return (
    <PDFPreview
      estimateId="your-test-estimate-id"
      pdfUrl="/pdf/existing-pdf.pdf" // Optional: pre-existing PDF
      onGenerated={(url) => {
        console.log('PDF Generated:', url);
        alert(`PDF successfully generated at: ${url}`);
      }}
    />
  );
}
```

## Performance Testing

### Generation Speed
- [ ] Small estimate (1-3 parts): < 2 seconds
- [ ] Medium estimate (5-10 parts): < 3 seconds
- [ ] Large estimate (15+ parts): < 5 seconds

### File Size
- [ ] Typical PDF: 50-200 KB
- [ ] Large PDF with many items: < 1 MB

### Concurrent Generation
Test multiple PDFs at once:
- [ ] Generate 3 PDFs simultaneously
- [ ] All complete successfully
- [ ] No file conflicts or overwrites

## Accessibility Testing

- [ ] PDF is screen-reader friendly
- [ ] Text is selectable/copyable
- [ ] Print-friendly layout
- [ ] Mobile browser compatible

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

## Troubleshooting

### PDF doesn't generate
1. Check browser console for errors
2. Check server logs
3. Verify estimate data exists with all relations
4. Check `public/pdf/` directory permissions

### Korean text shows as boxes
1. Check internet connection (Noto Sans KR is web font)
2. Verify font URL in `estimateTemplate.tsx`
3. Try different browser

### File not saved
1. Check directory exists: `public/pdf/`
2. Check write permissions
3. Check disk space
4. Look for errors in API route logs

### PDF shows old data
1. Clear browser cache
2. Regenerate PDF (click "PDF 재생성")
3. Check database for latest estimate data

## Success Criteria

✅ All sections render correctly
✅ Korean text displays properly
✅ Currency and date formats are correct
✅ PDF file saves to `public/pdf/`
✅ Download and print work
✅ Database updates with pdfUrl
✅ Edge cases handled gracefully
✅ Error messages are clear
✅ No TypeScript errors in PDF files
✅ Performance is acceptable

## Next Steps After Testing

Once all tests pass:

1. **Integrate into estimate page**:
   - Add "PDF 생성" button to estimate detail page
   - Show PDF preview after generation

2. **Add to workflow**:
   - Auto-generate PDF when estimate status changes to "sent"
   - Include PDF URL in email notifications

3. **Customize branding**:
   - Replace company info with actual details
   - Add company logo
   - Adjust colors to match brand

4. **Consider enhancements**:
   - Email PDF to customer
   - Version history
   - Digital signatures
   - Custom templates
