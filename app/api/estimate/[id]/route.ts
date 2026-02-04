import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const estimate = await prisma.estimate.findUnique({
      where: { id },
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
        { error: '견적서를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json(estimate);
  } catch (error) {
    console.error('Estimate fetch error:', error);
    return NextResponse.json(
      { error: '견적서 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { parts, laborCost, travelCost, totalAmount, notes, status } = body;

    // 견적서 존재 여부 확인
    const existing = await prisma.estimate.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: '견적서를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 견적서 업데이트
    const estimate = await prisma.estimate.update({
      where: { id },
      data: {
        parts: parts ? JSON.stringify(parts) : undefined,
        laborCost: laborCost !== undefined ? laborCost : undefined,
        travelCost: travelCost !== undefined ? travelCost : undefined,
        totalAmount: totalAmount !== undefined ? totalAmount : undefined,
        notes: notes !== undefined ? notes : undefined,
        status: status || undefined,
      },
    });

    return NextResponse.json(estimate);
  } catch (error) {
    console.error('Estimate update error:', error);
    return NextResponse.json(
      { error: '견적서 수정 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
