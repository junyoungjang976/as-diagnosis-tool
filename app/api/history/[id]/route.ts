import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const diagnosis = await prisma.diagnosis.findUnique({
      where: { id },
      include: {
        equipment: {
          include: {
            category: true,
          },
        },
        estimate: true,
      },
    })

    if (!diagnosis) {
      return NextResponse.json(
        { error: 'Diagnosis not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(diagnosis)
  } catch (error) {
    console.error('Error fetching diagnosis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch diagnosis' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete estimate first (if exists) due to foreign key constraint
    await prisma.estimate.deleteMany({
      where: { diagnosisId: id },
    })

    // Delete diagnosis
    await prisma.diagnosis.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting diagnosis:', error)
    return NextResponse.json(
      { error: 'Failed to delete diagnosis' },
      { status: 500 }
    )
  }
}
