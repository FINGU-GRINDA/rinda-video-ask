'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { locales, localeNames, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLocale = (newLocale: Locale) => {
    // Replace current locale in path with new locale
    const segments = pathname.split('/')
    const localeIndex = segments.findIndex((s) => locales.includes(s as Locale))

    if (localeIndex !== -1) {
      segments[localeIndex] = newLocale
    } else {
      // If no locale in path, add it after the first empty segment
      segments.splice(1, 0, newLocale)
    }

    const newPath = segments.join('/') || `/${newLocale}`
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg py-1 z-50 animate-fade-in">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-muted transition-colors',
                locale === loc ? 'text-primary font-medium' : 'text-foreground'
              )}
            >
              {localeNames[loc]}
              {locale === loc && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
