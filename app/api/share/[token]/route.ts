import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: '유효하지 않은 공유 링크입니다.' },
        { status: 400 }
      );
    }

    // Find share link
    const shareLink = await prisma.shareLink.findUnique({
      where: { token },
      include: {
        estimate: {
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
        },
      },
    });

    if (!shareLink) {
      return NextResponse.json(
        { error: '공유 링크를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Check if link has expired
    if (new Date() > shareLink.expiresAt) {
      return NextResponse.json(
        { error: '공유 링크가 만료되었습니다.' },
        { status: 410 }
      );
    }

    // Increment view count
    await prisma.shareLink.update({
      where: { id: shareLink.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    // Return estimate data
    return NextResponse.json({
      success: true,
      estimate: shareLink.estimate,
      viewCount: shareLink.viewCount + 1,
      expiresAt: shareLink.expiresAt,
    });
  } catch (error) {
    console.error('공유 링크 조회 오류:', error);

    return NextResponse.json(
      { error: '공유 링크 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
