'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, DollarSign, Download, Info } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="container mx-auto max-w-4xl p-4 space-y-4">
        <div className="pt-4">
          <h1 className="text-2xl font-bold mb-2">설정</h1>
          <p className="text-sm text-muted-foreground">
            앱 설정 및 환경설정
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <CardTitle>회사 정보</CardTitle>
            </div>
            <CardDescription>
              견적서 PDF에 표시될 회사 정보를 설정합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              회사 정보 수정
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <CardTitle>기본 단가 관리</CardTitle>
            </div>
            <CardDescription>
              공임 및 출장비 기본 단가를 설정합니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              공임 단가 관리
            </Button>
            <Button variant="outline" className="w-full justify-start">
              출장비 단가 관리
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              <CardTitle>데이터 내보내기</CardTitle>
            </div>
            <CardDescription>
              진단 및 견적 데이터를 ASMS로 내보냅니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              ASMS로 내보내기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              <CardTitle>앱 정보</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">버전</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">개발사</span>
              <span className="font-medium">부성티케이</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
