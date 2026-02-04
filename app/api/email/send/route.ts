import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEstimateEmail } from '@/lib/email';
import { generateEstimatePDF } from '@/lib/pdf/estimate-pdf';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { estimateId, recipientEmail } = body;

    if (!estimateId || !recipientEmail) {
      return NextResponse.json(
        { error: '견적서 ID와 수신자 이메일이 필요합니다.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: '올바른 이메일 주소를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Fetch estimate with related data
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
        { error: '견적서를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Generate PDF
    const pdfBuffer = await generateEstimatePDF(estimate);

    // Prepare email data
    const emailData = {
      customerName: estimate.diagnosis.customerName || '고객',
      equipmentName: estimate.diagnosis.equipment.name,
      totalAmount: estimate.totalAmount,
      validUntil: estimate.validUntil || undefined,
    };

    // Send email
    await sendEstimateEmail({
      to: recipientEmail,
      estimateData: emailData,
      pdfBuffer,
      pdfFilename: `견적서_${estimate.diagnosis.customerName}_${estimate.diagnosis.equipment.name}.pdf`,
    });

    // Update estimate status
    await prisma.estimate.update({
      where: { id: estimateId },
      data: { status: 'sent' },
    });

    return NextResponse.json({
      success: true,
      message: '견적서가 성공적으로 전송되었습니다.',
    });
  } catch (error) {
    console.error('이메일 전송 오류:', error);

    const errorMessage = error instanceof Error
      ? error.message
      : '이메일 전송 중 오류가 발생했습니다.';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
