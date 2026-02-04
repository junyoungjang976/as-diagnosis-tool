import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const travelRates = await prisma.travelRate.findMany({
      orderBy: {
        rate: 'asc',
      },
    });

    return NextResponse.json(travelRates);
  } catch (error) {
    console.error('Travel rates fetch error:', error);
    return NextResponse.json(
      { error: '출장비 요율 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
