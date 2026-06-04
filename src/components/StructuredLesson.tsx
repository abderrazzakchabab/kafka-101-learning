import type { LessonContentData, ContentBlock } from '@/lib/lesson-content'
import ReactMarkdown from 'react-markdown'

function Block({ block }: { block: ContentBlock }) {
  if (block.type === 'code') {
    return (
      <pre className="my-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
        <code className={`language-${block.lang ?? 'text'}`}>{block.body}</code>
      </pre>
    )
  }
  if (block.type === 'callout') {
    const palette =
      block.variant === 'warning'
        ? 'border-amber-300 bg-amber-50 text-amber-900'
        : block.variant === 'success'
        ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
        : 'border-blue-300 bg-blue-50 text-blue-900'
    return (
      <div className={`my-4 rounded-xl border-l-4 ${palette} p-4 text-sm`}>
        <ReactMarkdown>{block.body}</ReactMarkdown>
      </div>
    )
  }
  return (
    <div className="prose prose-slate my-3 max-w-none text-slate-700">
      <ReactMarkdown>{block.body}</ReactMarkdown>
    </div>
  )
}

export default function StructuredLesson({ data }: { data: LessonContentData }) {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-blue-700">
          Learning objectives
        </h2>
        <ul className="space-y-2">
          {data.objectives.map((o, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-800">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </section>

      {data.sections.map((s, i) => (
        <section key={i}>
          <h2 className="mb-3 border-l-4 border-blue-600 pl-3 text-2xl font-bold text-slate-900">
            {s.heading}
          </h2>
          <div>
            {s.blocks.map((b, bi) => (
              <Block key={bi} block={b} />
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-700">
          Key takeaways
        </h2>
        <ul className="space-y-2">
          {data.takeaways.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-800">
              <span className="font-bold text-emerald-700">✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
