'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Search,
  Rocket,
  Video,
  Layout,
  Brain,
  Plug,
  ChevronRight,
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'gettingStarted', icon: Rocket },
  { id: 'videoRecording', icon: Video },
  { id: 'widgetSetup', icon: Layout },
  { id: 'aiFeatures', icon: Brain },
  { id: 'integrations', icon: Plug },
]

interface FAQItem {
  id: string
  questionKey: string
  answerKey: string
}

const faqs: FAQItem[] = [
  { id: '1', questionKey: 'q1', answerKey: 'a1' },
  { id: '2', questionKey: 'q2', answerKey: 'a2' },
  { id: '3', questionKey: 'q3', answerKey: 'a3' },
]

function FAQAccordion({ item }: { item: FAQItem }) {
  const t = useTranslations('help.faq')
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary-500 transition-colors"
      >
        <span className="font-medium text-foreground pr-4">{t(item.questionKey)}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-muted-foreground shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-muted-foreground text-sm animate-fade-in">
          {t(item.answerKey)}
        </div>
      )}
    </div>
  )
}

export default function HelpPage() {
  const t = useTranslations('help')
  const tCategories = useTranslations('help.categories')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = faqs.filter((faq) => {
    if (!searchQuery) return true
    const question = t(`faq.${faq.questionKey}`)
    const answer = t(`faq.${faq.answerKey}`)
    const query = searchQuery.toLowerCase()
    return question.toLowerCase().includes(query) || answer.toLowerCase().includes(query)
  })

  return (
    <div className="p-6 lg:p-8 page-transition">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-card"
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-in">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                className="bg-card border rounded-xl p-5 text-left hover:border-primary-300 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <Icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary-500 transition-colors">
                  {tCategories(`${category.id}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tCategories(`${category.id}.description`)}
                </p>
              </button>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-card border rounded-xl">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-foreground text-lg">{t('faq.title')}</h2>
          </div>
          <div className="px-6 divide-y">
            {filteredFaqs.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No results found for &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredFaqs.map((faq) => <FAQAccordion key={faq.id} item={faq} />)
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-primary-50 to-violet-50 border border-primary-100 rounded-xl p-6">
          <div className="text-center mb-6">
            <h2 className="font-semibold text-foreground text-lg">{t('contact.title')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('contact.description')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="mailto:support@rindaask.com"
              className="flex flex-col items-center p-4 bg-white rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <span className="font-medium text-foreground">{t('contact.email')}</span>
              <span className="text-xs text-muted-foreground mt-1">support@rindaask.com</span>
            </a>
            <button className="flex flex-col items-center p-4 bg-white rounded-xl border hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center mb-3">
                <MessageCircle className="w-5 h-5 text-success-600" />
              </div>
              <span className="font-medium text-foreground">{t('contact.chat')}</span>
              <span className="text-xs text-muted-foreground mt-1">Available 9AM-6PM KST</span>
            </button>
            <a
              href="tel:+821012345678"
              className="flex flex-col items-center p-4 bg-white rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center mb-3">
                <Phone className="w-5 h-5 text-warning-600" />
              </div>
              <span className="font-medium text-foreground">{t('contact.phone')}</span>
              <span className="text-xs text-muted-foreground mt-1">+82-10-1234-5678</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://docs.rindaask.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-between p-4 bg-card border rounded-xl hover:border-primary-300 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-medium text-foreground group-hover:text-primary-500 transition-colors">
                Documentation
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">Full API reference and guides</p>
            </div>
            <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary-500 transition-colors" />
          </a>
          <a
            href="https://status.rindaask.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-between p-4 bg-card border rounded-xl hover:border-primary-300 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-medium text-foreground group-hover:text-primary-500 transition-colors">
                System Status
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">Check service availability</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <span className="text-xs text-success-600 font-medium">All systems operational</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
