import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      equipmentId,
      customerName,
      customerContact,
      customerEmail,
      location,
      checkResults,
      notes,
    } = body

    // Validate required fields
    if (!equipmentId) {
      return NextResponse.json(
        { error: 'equipmentId is required' },
        { status: 400 }
      )
    }

    // Create diagnosis record
    const diagnosis = await prisma.diagnosis.create({
      data: {
        equipmentId,
        customerName: customerName || null,
        customerContact: customerContact || null,
        customerEmail: customerEmail || null,
        location: location || null,
        checkResults: JSON.stringify(checkResults || []),
        notes: notes || null,
        status: 'completed',
      },
      include: {
        equipment: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json(diagnosis, { status: 201 })
  } catch (error) {
    console.error('Error creating diagnosis:', error)
    return NextResponse.json(
      { error: 'Failed to create diagnosis' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
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

    return NextResponse.json(diagnoses)
  } catch (error) {
    console.error('Error fetching diagnoses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch diagnoses' },
      { status: 500 }
    )
  }
}
