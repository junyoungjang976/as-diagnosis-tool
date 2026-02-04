'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface EquipmentCardProps {
  id: string
  name: string
  model?: string | null
  onStartDiagnosis: (id: string) => void
}

export function EquipmentCard({ id, name, model, onStartDiagnosis }: EquipmentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <h3 className="font-semibold text-base mb-1">{name}</h3>
        {model && (
          <p className="text-sm text-muted-foreground">모델: {model}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => onStartDiagnosis(id)}
        >
          진단 시작
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}
