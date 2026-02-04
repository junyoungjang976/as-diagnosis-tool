'use client';

/**
 * Estimate PDF Page
 * 견적서 PDF 생성 및 미리보기 페이지
 */

import { use } from 'react';
import { PDFPreview } from '@/components/pdf/PDFPreview';

export default function EstimatePDFPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">견적서 PDF</h1>
        <p className="text-gray-600">
          PDF를 생성하고 미리보기, 다운로드, 인쇄할 수 있습니다.
        </p>
      </div>

      <PDFPreview
        estimateId={id}
        onGenerated={(url) => {
          console.log('PDF generated successfully:', url);
        }}
      />
    </div>
  );
}
