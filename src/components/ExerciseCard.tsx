'use client'

import { useState } from 'react'
import type { Exercise } from '@/lib/exercises'

interface Props {
  exercise: Exercise
  index: number
}

export default function ExerciseCard({ exercise, index }: Props) {
  const [showHint, setShowHint] = useState(false)
  const [done, setDone] = useState(false)

  return (
    <div className={`rounded-xl border bg-white p-5 shadow-sm transition-all ${done ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200'}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
            Exercise {index + 1}
          </span>
          <h3 className="text-base font-semibold text-slate-900">{exercise.title}</h3>
        </div>
        <button
          onClick={() => setDone(d => !d)}
          className={`shrink-0 rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
            done
              ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
              : 'border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {done ? '✓ Done' : 'Mark done'}
        </button>
      </div>

      <p className="mb-3 text-sm text-slate-700">{exercise.description}</p>

      <div className="mb-3 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-3 font-mono text-sm">
        <span className="select-none text-emerald-400">$ </span>
        <span className="text-slate-100">{exercise.command}</span>
      </div>

      {exercise.expectedOutput && (
        <div className="mb-2 text-xs text-slate-500">
          <span className="text-slate-400">Expected: </span>
          <code className="text-slate-700">{exercise.expectedOutput}</code>
        </div>
      )}

      <button
        onClick={() => setShowHint(h => !h)}
        className="text-xs font-medium text-blue-600 hover:text-blue-700"
      >
        {showHint ? '▾ Hide hint' : '▸ Show hint'}
      </button>

      {showHint && (
        <p className="mt-2 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900">
          {exercise.hint}
        </p>
      )}
    </div>
  )
}
