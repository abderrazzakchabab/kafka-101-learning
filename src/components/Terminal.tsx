'use client'

import { useState } from 'react'

const TTYD_URL = process.env.NEXT_PUBLIC_TTYD_URL ?? 'http://localhost:7681'

export default function Terminal() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`flex flex-col border border-slate-700 rounded-xl overflow-hidden bg-black shadow-lg transition-all ${expanded ? 'h-[700px]' : 'h-full min-h-[480px]'}`}>
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-gray-400 font-mono">kafka-shell</span>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {expanded ? '⬇ shrink' : '⬆ expand'}
        </button>
      </div>
      <iframe
        src={TTYD_URL}
        className="flex-1 w-full border-0"
        title="Kafka Shell Terminal"
      />
    </div>
  )
}
