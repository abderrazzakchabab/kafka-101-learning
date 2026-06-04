'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LESSON_META } from '@/lib/lessons-meta'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-gray-100 flex flex-col py-6 px-3 shrink-0">
      <Link href="/" className="px-3 mb-6 block">
        <span className="text-xl font-bold text-orange-400">⚡ Kafka 101</span>
        <span className="block text-xs text-gray-400 mt-0.5">2025 Edition</span>
      </Link>

      <nav className="flex-1 space-y-0.5">
        {LESSON_META.map((lesson) => {
          const href = lesson.slug === 'install' ? '/install' : `/lesson/${lesson.slug}`
          const active = pathname === href
          return (
            <Link
              key={lesson.slug}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                active
                  ? 'bg-orange-500 text-white font-medium'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xs text-gray-500 w-5 shrink-0">{lesson.order}.</span>
              <span className="truncate">{lesson.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pt-4 border-t border-gray-700 text-xs text-gray-500">
        Apache Kafka 101 · Tim Berglund
      </div>
    </aside>
  )
}
