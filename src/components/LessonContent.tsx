'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

export default function LessonContent({ content }: Props) {
  return (
    <div className="prose prose-invert prose-orange max-w-none
      prose-headings:font-bold prose-headings:text-white
      prose-p:text-gray-300 prose-p:leading-relaxed
      prose-code:bg-gray-800 prose-code:text-orange-300 prose-code:px-1 prose-code:rounded
      prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
      prose-strong:text-white
      prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-orange-500 prose-blockquote:text-gray-400
      prose-table:text-gray-300 prose-th:text-white prose-th:bg-gray-800
      prose-li:text-gray-300
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
