import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: any = {
      estimate: {
        isNot: null,
      },
    }

    if (status && status !== 'all') {
      where.estimate = {
        ...where.estimate,
        status: status,
      }
    }

    const diagnoses = await prisma.diagnosis.findMany({
      where,
      include: {
        equipment: {
          include: {
            category: true,
          },
        },
        estimate: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const items = diagnoses.map((diagnosis: any) => ({
      id: diagnosis.id,
      createdAt: diagnosis.createdAt,
      customerName: diagnosis.customerName || '미입력',
      equipmentName: diagnosis.equipment.name,
      totalAmount: diagnosis.estimate?.totalAmount || 0,
      status: diagnosis.estimate?.status || 'draft',
    }))

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
