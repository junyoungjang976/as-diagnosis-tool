import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.equipmentCategory.findMany({
      include: {
        _count: {
          select: { equipment: true }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const response = categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      equipmentCount: category._count.equipment
    }))

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
