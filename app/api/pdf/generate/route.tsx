/**
 * PDF Generation API
 * POST /api/pdf/generate
 * 견적서 PDF 생성 및 파일 저장
 */

import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { prisma } from '@/lib/prisma';
import {
  EstimatePDFTemplate,
  EstimatePDFData,
  EstimatePartItem,
} from '@/lib/pdf/estimateTemplate';
import {
  generateEstimateNumber,
  calculateValidUntil,
  generatePDFFileName,
} from '@/lib/pdf';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createReadStream } from 'fs';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
  try {
    const { estimateId } = await request.json();

    if (!estimateId) {
      return NextResponse.json(
        { error: 'estimateId is required' },
        { status: 400 }
      );
    }

    // Fetch estimate data with all relations
    const estimate = await prisma.estimate.findUnique({
      where: { id: estimateId },
      include: {
        diagnosis: {
          include: {
            equipment: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!estimate) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 }
      );
    }

    // Parse parts JSON
    const parts: EstimatePartItem[] = JSON.parse(estimate.parts);

    // Parse check results for diagnosis summary
    const checkResults = JSON.parse(estimate.diagnosis.checkResults);
    const diagnosisSummary = checkResults
      .filter((item: any) => !item.checked && item.note)
      .map((item: any) => item.note);

    // Prepare PDF data
    const issueDate = new Date();
    const validUntil = estimate.validUntil || calculateValidUntil(issueDate);
    const estimateNumber = generateEstimateNumber();

    const pdfData: EstimatePDFData = {
      estimateNumber,
      issueDate,
      validUntil,
      customerName: estimate.diagnosis.customerName || '고객명 없음',
      customerContact: estimate.diagnosis.customerContact || '연락처 없음',
      location: estimate.diagnosis.location || '위치 정보 없음',
      equipmentName: estimate.diagnosis.equipment.name,
      equipmentType: estimate.diagnosis.equipment.category.name,
      diagnosisDate: estimate.diagnosis.createdAt,
      diagnosisSummary,
      parts,
      laborCost: estimate.laborCost,
      travelCost: estimate.travelCost,
      subtotal: estimate.totalAmount,
      vat: 0, // Calculate if needed
      total: estimate.totalAmount,
      notes: estimate.notes || undefined,
    };

    // Generate PDF
    const pdfStream = await renderToStream(
      <EstimatePDFTemplate data={pdfData} />
    );

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Save to file system
    const fileName = generatePDFFileName(
      pdfData.customerName,
      issueDate
    );
    const filePath = join(process.cwd(), 'public', 'pdf', fileName);
    await writeFile(filePath, pdfBuffer);

    // Update estimate with PDF URL
    const pdfUrl = `/pdf/${fileName}`;
    await prisma.estimate.update({
      where: { id: estimateId },
      data: { pdfUrl },
    });

    return NextResponse.json({
      success: true,
      pdfUrl,
      fileName,
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to download PDF directly
 * GET /api/pdf/generate?estimateId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const estimateId = searchParams.get('estimateId');

    if (!estimateId) {
      return NextResponse.json(
        { error: 'estimateId is required' },
        { status: 400 }
      );
    }

    // Check if PDF already exists
    const estimate = await prisma.estimate.findUnique({
      where: { id: estimateId },
      include: {
        diagnosis: {
          include: {
            equipment: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!estimate) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 }
      );
    }

    // If PDF exists, return it
    if (estimate.pdfUrl) {
      const filePath = join(process.cwd(), 'public', estimate.pdfUrl);
      try {
        const fileStream = createReadStream(filePath);
        return new NextResponse(fileStream as any, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${estimate.pdfUrl.split('/').pop()}"`,
          },
        });
      } catch {
        // File doesn't exist, regenerate
      }
    }

    // Generate new PDF
    const parts: EstimatePartItem[] = JSON.parse(estimate.parts);
    const checkResults = JSON.parse(estimate.diagnosis.checkResults);
    const diagnosisSummary = checkResults
      .filter((item: any) => !item.checked && item.note)
      .map((item: any) => item.note);

    const issueDate = new Date();
    const validUntil = estimate.validUntil || calculateValidUntil(issueDate);
    const estimateNumber = generateEstimateNumber();

    const pdfData: EstimatePDFData = {
      estimateNumber,
      issueDate,
      validUntil,
      customerName: estimate.diagnosis.customerName || '고객명 없음',
      customerContact: estimate.diagnosis.customerContact || '연락처 없음',
      location: estimate.diagnosis.location || '위치 정보 없음',
      equipmentName: estimate.diagnosis.equipment.name,
      equipmentType: estimate.diagnosis.equipment.category.name,
      diagnosisDate: estimate.diagnosis.createdAt,
      diagnosisSummary,
      parts,
      laborCost: estimate.laborCost,
      travelCost: estimate.travelCost,
      subtotal: estimate.totalAmount,
      vat: 0,
      total: estimate.totalAmount,
      notes: estimate.notes || undefined,
    };

    const pdfStream = await renderToStream(
      <EstimatePDFTemplate data={pdfData} />
    );

    return new NextResponse(pdfStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${generatePDFFileName(pdfData.customerName, issueDate)}"`,
      },
    });
  } catch (error) {
    console.error('PDF download error:', error);
    return NextResponse.json(
      { error: 'Failed to download PDF', details: String(error) },
      { status: 500 }
    );
  }
}
