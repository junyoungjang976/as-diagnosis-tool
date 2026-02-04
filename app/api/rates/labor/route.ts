import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const laborRates = await prisma.laborRate.findMany({
      orderBy: {
        rate: 'asc',
      },
    });

    return NextResponse.json(laborRates);
  } catch (error) {
    console.error('Labor rates fetch error:', error);
    return NextResponse.json(
      { error: '공임 요율 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
