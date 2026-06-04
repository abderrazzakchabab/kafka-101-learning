'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

export default function LessonContent({ content }: Props) {
  return (
    <div className="prose max-w-none
      prose-headings:font-bold prose-headings:text-slate-900
      prose-p:text-slate-800 prose-p:leading-relaxed
      prose-code:bg-slate-100 prose-code:text-blue-700 prose-code:px-1 prose-code:rounded prose-code:font-medium
      prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:border prose-pre:border-slate-200
      prose-strong:text-slate-900
      prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-blue-500 prose-blockquote:text-slate-700
      prose-table:text-slate-800 prose-th:text-slate-900 prose-th:bg-slate-100
      prose-li:text-slate-800 prose-li:marker:text-slate-500
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
