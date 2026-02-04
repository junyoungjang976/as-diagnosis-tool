import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const equipment = await prisma.equipment.findUnique({
      where: {
        id: id
      },
      include: {
        category: true,
        checklistItems: {
          orderBy: {
            order: 'asc'
          }
        },
        parts: {
          orderBy: {
            name: 'asc'
          }
        }
      }
    })

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}
