import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diagnosisId, parts, laborCost, travelCost, totalAmount, notes } = body;

    // 유효성 검사
    if (!diagnosisId) {
      return NextResponse.json(
        { error: 'diagnosisId가 필요합니다' },
        { status: 400 }
      );
    }

    // 진단 존재 여부 확인
    const diagnosis = await prisma.diagnosis.findUnique({
      where: { id: diagnosisId },
    });

    if (!diagnosis) {
      return NextResponse.json(
        { error: '해당 진단을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 견적서 생성
    const estimate = await prisma.estimate.create({
      data: {
        diagnosisId,
        parts: JSON.stringify(parts),
        laborCost: laborCost || 0,
        travelCost: travelCost || 0,
        totalAmount: totalAmount || 0,
        notes: notes || null,
        status: 'draft',
      },
    });

    return NextResponse.json(estimate, { status: 201 });
  } catch (error) {
    console.error('Estimate creation error:', error);
    return NextResponse.json(
      { error: '견적서 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
