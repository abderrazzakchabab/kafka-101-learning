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
    <div className={`border rounded-lg p-4 transition-all ${done ? 'border-green-600 bg-green-950/30' : 'border-gray-700 bg-gray-900'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-orange-400 bg-orange-950 px-2 py-0.5 rounded">
            Exercise {index + 1}
          </span>
          <h3 className="text-sm font-semibold text-white">{exercise.title}</h3>
        </div>
        <button
          onClick={() => setDone(d => !d)}
          className={`text-xs px-2 py-1 rounded border transition-colors shrink-0 ${
            done
              ? 'border-green-600 text-green-400 bg-green-950'
              : 'border-gray-600 text-gray-400 hover:border-gray-400'
          }`}
        >
          {done ? '✓ Done' : 'Mark done'}
        </button>
      </div>

      <p className="text-sm text-gray-300 mb-3">{exercise.description}</p>

      <div className="bg-black rounded p-3 font-mono text-sm mb-3 border border-gray-800">
        <span className="text-green-400 select-none">$ </span>
        <span className="text-gray-100">{exercise.command}</span>
      </div>

      {exercise.expectedOutput && (
        <div className="text-xs text-gray-500 mb-2">
          <span className="text-gray-600">Expected: </span>
          <code className="text-gray-400">{exercise.expectedOutput}</code>
        </div>
      )}

      <button
        onClick={() => setShowHint(h => !h)}
        className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
      >
        {showHint ? '▾ Hide hint' : '▸ Show hint'}
      </button>

      {showHint && (
        <p className="mt-2 text-xs text-gray-400 bg-gray-800 rounded p-2 border-l-2 border-orange-500">
          {exercise.hint}
        </p>
      )}
    </div>
  )
}
