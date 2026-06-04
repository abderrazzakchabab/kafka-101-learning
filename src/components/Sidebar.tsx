'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LESSON_META } from '@/lib/lessons-meta'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 min-h-screen shrink-0 border-r border-slate-200 bg-white flex flex-col">
      <Link href="/" className="px-6 py-6 border-b border-slate-200 block hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold">K</span>
          <div>
            <div className="text-base font-bold text-slate-900 leading-tight">Kafka 101</div>
            <div className="text-xs text-slate-500">2025 · Tim Berglund</div>
          </div>
        </div>
      </Link>

      <div className="px-6 pt-5 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Course outline
      </div>

      <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
        {LESSON_META.map((lesson) => {
          const href = lesson.slug === 'install' ? '/install' : `/lesson/${lesson.slug}`
          const active = pathname === href
          return (
            <Link
              key={lesson.slug}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {lesson.order}
              </span>
              <span className="truncate">{lesson.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 px-6 py-4 text-xs text-slate-500">
        Apache Kafka 101 · 2025 Edition
      </div>
    </aside>
  )
}
