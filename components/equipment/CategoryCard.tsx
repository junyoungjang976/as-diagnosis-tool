'use client'

import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryCardProps {
  name: string
  count: number
  icon: LucideIcon
  onClick: () => void
}

export function CategoryCard({ name, count, icon: Icon, onClick }: CategoryCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-105 active:scale-95",
        "border-2 hover:border-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-8 gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground">{count}개 장비</p>
        </div>
      </CardContent>
    </Card>
  )
}
