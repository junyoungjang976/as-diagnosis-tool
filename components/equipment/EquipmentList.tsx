'use client'

import { useState, useEffect } from 'react'
import { EquipmentCard } from './EquipmentCard'
import { Loader2 } from 'lucide-react'

interface Equipment {
  id: string
  name: string
  model?: string | null
}

interface EquipmentListProps {
  categoryId: string
  onStartDiagnosis: (equipmentId: string) => void
}

export function EquipmentList({ categoryId, onStartDiagnosis }: EquipmentListProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEquipment() {
      try {
        setLoading(true)
        const response = await fetch(`/api/equipment?categoryId=${categoryId}`)
        if (!response.ok) throw new Error('Failed to fetch equipment')
        const data = await response.json()
        setEquipment(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEquipment()
  }, [categoryId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (equipment.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">이 카테고리에 장비가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {equipment.map((item) => (
        <EquipmentCard
          key={item.id}
          id={item.id}
          name={item.name}
          model={item.model}
          onStartDiagnosis={onStartDiagnosis}
        />
      ))}
    </div>
  )
}
