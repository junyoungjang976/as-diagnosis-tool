import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DiagnosisClient } from '@/components/diagnosis/DiagnosisClient'

interface DiagnosisPageProps {
  params: Promise<{ equipmentId: string }>
}

export default async function DiagnosisPage({ params }: DiagnosisPageProps) {
  const { equipmentId } = await params

  // Fetch equipment with checklist items and parts
  const equipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
    include: {
      category: true,
      checklistItems: {
        orderBy: {
          order: 'asc',
        },
      },
      parts: {
        orderBy: {
          name: 'asc',
        },
      },
    },
  })

  if (!equipment) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-1">
            {equipment.category.name}
          </div>
          <h1 className="text-2xl font-bold mb-1">{equipment.name}</h1>
          {equipment.model && (
            <div className="text-sm text-muted-foreground">
              모델: {equipment.model}
            </div>
          )}
        </div>

        {/* Diagnosis Form - Client Component */}
        <DiagnosisClient
          equipment={{
            id: equipment.id,
            name: equipment.name,
            model: equipment.model,
            category: {
              id: equipment.category.id,
              name: equipment.category.name,
            },
          }}
          checklistItems={equipment.checklistItems.map((item: { id: string; item: string; description: string | null; order: number }) => ({
            id: item.id,
            item: item.item,
            description: item.description,
            order: item.order,
          }))}
          availableParts={equipment.parts.map((part: { id: string; name: string; partNumber: string | null; price: number }) => ({
            id: part.id,
            name: part.name,
            partNumber: part.partNumber,
            price: part.price,
          }))}
        />
      </div>
    </div>
  )
}
