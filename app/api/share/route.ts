import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { estimateId } = body;

    if (!estimateId) {
      return NextResponse.json(
        { error: '견적서 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // Check if estimate exists
    const estimate = await prisma.estimate.findUnique({
      where: { id: estimateId },
    });

    if (!estimate) {
      return NextResponse.json(
        { error: '견적서를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Generate unique token
    const token = nanoid(16);

    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create share link
    const shareLink = await prisma.shareLink.create({
      data: {
        token,
        estimateId,
        expiresAt,
      },
    });

    // Generate full URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/share/${token}`;

    return NextResponse.json({
      success: true,
      shareLink: {
        id: shareLink.id,
        token: shareLink.token,
        url: shareUrl,
        expiresAt: shareLink.expiresAt,
      },
    });
  } catch (error) {
    console.error('공유 링크 생성 오류:', error);

    return NextResponse.json(
      { error: '공유 링크 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
