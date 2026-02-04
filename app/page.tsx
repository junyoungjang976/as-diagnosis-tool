'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CategoryCard } from '@/components/equipment/CategoryCard'
import { EquipmentList } from '@/components/equipment/EquipmentList'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Flame, ChefHat, Cog, Wind, Snowflake, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  equipmentCount: number
}

const categoryIcons = {
  '가열설비': Flame,
  '조리설비': ChefHat,
  '가공설비': Cog,
  '후드': Wind,
  '냉장설비': Snowflake,
}

export default function Home() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/equipment/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category)
    setDialogOpen(true)
  }

  const handleStartDiagnosis = (equipmentId: string) => {
    router.push(`/diagnosis/${equipmentId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">고장 진단 도구</h1>
          <p className="text-muted-foreground">
            진단할 장비 카테고리를 선택하세요
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name as keyof typeof categoryIcons] || Cog
            return (
              <CategoryCard
                key={category.id}
                name={category.name}
                count={category.equipmentCount}
                icon={Icon}
                onClick={() => handleCategoryClick(category)}
              />
            )
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              카테고리가 없습니다. 데이터를 시드해주세요.
            </p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCategory?.name}</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <EquipmentList
              categoryId={selectedCategory.id}
              onStartDiagnosis={handleStartDiagnosis}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
