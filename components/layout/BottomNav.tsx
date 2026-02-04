'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, ClipboardCheck, History, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      label: '홈',
      icon: Home,
      href: '/',
      active: pathname === '/',
    },
    {
      label: '진단',
      icon: ClipboardCheck,
      href: '/diagnosis',
      active: pathname.startsWith('/diagnosis') || pathname.startsWith('/estimate'),
    },
    {
      label: '이력',
      icon: History,
      href: '/history',
      active: pathname.startsWith('/history'),
    },
    {
      label: '설정',
      icon: Settings,
      href: '/settings',
      active: pathname.startsWith('/settings'),
    },
  ]

  const handleNavClick = (href: string) => {
    if (href === '/diagnosis') {
      // Check if there's an active diagnosis
      // For now, just go to home
      router.push('/')
    } else {
      router.push(href)
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                item.active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', item.active && 'stroke-[2.5]')} />
              <span className={cn('text-xs', item.active && 'font-semibold')}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
