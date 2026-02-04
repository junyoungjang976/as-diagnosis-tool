# PDF Generation - Quick Reference

## 🚀 Quick Start

### Use the Component (Easiest)
```tsx
import { PDFPreview } from '@/components/pdf/PDFPreview';

<PDFPreview estimateId="abc123" />
```

### Call API Directly
```typescript
// Generate PDF
const response = await fetch('/api/pdf/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ estimateId: 'abc123' }),
});
const { pdfUrl } = await response.json();

// Download link
const url = `/api/pdf/generate?estimateId=abc123`;
```

## 📦 What's Available

### Utility Functions
```typescript
import {
  formatCurrency,      // 1000000 → "1,000,000원"
  formatDate,          // new Date() → "2024년 01월 15일"
  generateEstimateNumber,  // "EST-20240115-0001"
  generatePDFFileName,     // "견적서_홍길동_20240115.pdf"
  calculateValidUntil,     // +30 days
} from '@/lib/pdf';
```

### Helper Function (Server-side)
```typescript
import { generateEstimatePDF } from '@/lib/pdf/estimate-pdf';

const estimate = await prisma.estimate.findUnique({
  where: { id },
  include: {
    diagnosis: {
      include: {
        equipment: { include: { category: true } }
      }
    }
  }
});

const pdfBuffer = await generateEstimatePDF(estimate);
```

### PDF Template
```typescript
import { EstimatePDFTemplate } from '@/lib/pdf/estimateTemplate';
import { renderToStream } from '@react-pdf/renderer';

const pdfStream = await renderToStream(
  <EstimatePDFTemplate data={pdfData} />
);
```

## 🎨 Common Customizations

### Change Company Info
**File**: `lib/pdf/estimateTemplate.tsx` (lines ~280-290)
```tsx
<Text>부성티케이</Text>
<Text>전화: YOUR-PHONE | 이메일: YOUR-EMAIL</Text>
<Text>주소: YOUR-ADDRESS</Text>
```

### Add Logo
**File**: `lib/pdf/estimateTemplate.tsx`
```tsx
import { Image } from '@react-pdf/renderer';

// In header:
<Image src="/logo.png" style={{ width: 80 }} />
```

### Change Colors
**File**: `lib/pdf/estimateTemplate.tsx` (styles object)
```tsx
tableHeader: {
  backgroundColor: '#YOUR-COLOR',
}
```

### Enable VAT
**File**: `app/api/pdf/generate/route.ts` (lines ~88, ~215)
```typescript
vat: Math.round(subtotal * 0.1),
total: subtotal + vat,
```

## 📁 File Locations

```
lib/pdf/
├── index.ts              → Utilities
├── estimateTemplate.tsx  → PDF Template
├── estimate-pdf.ts       → Helper function
└── README.md             → Full docs

components/pdf/
└── PDFPreview.tsx        → React component

app/api/pdf/generate/
└── route.ts              → POST/GET endpoints

public/pdf/               → Generated PDFs saved here
```

## 🧪 Testing

```bash
# Start dev server
npm run dev

# Visit example page
http://localhost:3000/estimate/[id]/pdf

# Test API
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{"estimateId": "your-id"}'
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| PDF not generating | Check console, verify estimate exists |
| Korean text → boxes | Check internet (web font), try different browser |
| File not saved | Check `public/pdf/` directory exists and writable |
| Old data in PDF | Click "PDF 재생성" or clear browser cache |

## 📚 Full Documentation

- **Usage Guide**: `lib/pdf/README.md`
- **Testing Guide**: `TEST_PDF_GENERATION.md`
- **Implementation**: `PDF_GENERATION_COMPLETE.md`

## 💡 Example Integration

### Add to Estimate Detail Page
```tsx
'use client';

import { PDFPreview } from '@/components/pdf/PDFPreview';
import { useState } from 'react';

export default function EstimateDetailPage({ estimateId }) {
  const [showPDF, setShowPDF] = useState(false);

  return (
    <div>
      <h1>견적서 상세</h1>

      {/* Your estimate details here */}

      <button onClick={() => setShowPDF(!showPDF)}>
        {showPDF ? 'PDF 숨기기' : 'PDF 보기'}
      </button>

      {showPDF && (
        <PDFPreview
          estimateId={estimateId}
          onGenerated={(url) => {
            console.log('PDF ready:', url);
          }}
        />
      )}
    </div>
  );
}
```

### Auto-generate on Status Change
```typescript
// In your estimate update API
await prisma.estimate.update({
  where: { id },
  data: { status: 'sent' },
});

// Trigger PDF generation
await fetch('/api/pdf/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ estimateId: id }),
});
```

### Email PDF to Customer
```typescript
import nodemailer from 'nodemailer';

// Generate PDF
const response = await fetch('/api/pdf/generate', {
  method: 'POST',
  body: JSON.stringify({ estimateId }),
});
const { pdfUrl } = await response.json();

// Send email
const transporter = nodemailer.createTransport({...});
await transporter.sendMail({
  to: customerEmail,
  subject: '견적서',
  text: '견적서를 첨부합니다.',
  attachments: [{
    filename: '견적서.pdf',
    path: `./public${pdfUrl}`,
  }],
});
```

## ✅ Checklist Before Going Live

- [ ] Update company info in template
- [ ] Add company logo (optional)
- [ ] Test with real data
- [ ] Verify Korean fonts display correctly
- [ ] Test download and print functions
- [ ] Check mobile browser compatibility
- [ ] Verify file permissions on production server
- [ ] Consider backup strategy for generated PDFs

---

**Need more details?** See `lib/pdf/README.md` for comprehensive documentation.
