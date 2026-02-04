'use client';

/**
 * PDF Preview Component
 * 견적서 PDF 미리보기 및 다운로드
 */

import { useState } from 'react';
import { Download, FileText, Loader2, Printer } from 'lucide-react';

interface PDFPreviewProps {
  estimateId: string;
  pdfUrl?: string;
  onGenerated?: (url: string) => void;
}

export function PDFPreview({
  estimateId,
  pdfUrl: initialPdfUrl,
  onGenerated,
}: PDFPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(initialPdfUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estimateId }),
      });

      if (!response.ok) {
        throw new Error('PDF 생성에 실패했습니다.');
      }

      const data = await response.json();
      setPdfUrl(data.pdfUrl);
      onGenerated?.(data.pdfUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF 생성 실패');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfUrl) return;

    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfUrl.split('/').pop() || '견적서.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('다운로드에 실패했습니다.');
    }
  };

  const handlePrint = () => {
    if (!pdfUrl) return;

    const printWindow = window.open(pdfUrl, '_blank');
    printWindow?.addEventListener('load', () => {
      printWindow.print();
    });
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center gap-2">
        {!pdfUrl ? (
          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                PDF 생성 중...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                PDF 생성
              </>
            )}
          </button>
        ) : (
          <>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              다운로드
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Printer className="w-4 h-4" />
              인쇄
            </button>
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  재생성 중...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  PDF 재생성
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* PDF Preview */}
      {pdfUrl && (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
          <iframe
            src={pdfUrl}
            className="w-full h-[800px]"
            title="PDF 미리보기"
          />
        </div>
      )}

      {/* No PDF Message */}
      {!pdfUrl && !isGenerating && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p>PDF를 생성하려면 위 버튼을 클릭하세요.</p>
        </div>
      )}
    </div>
  );
}
