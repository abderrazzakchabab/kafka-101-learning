'use client'

import { useState } from 'react'
import type { QuizQuestion } from '@/lib/lesson-content'

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [picks, setPicks] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = Object.entries(picks).reduce(
    (acc, [i, p]) => acc + (questions[Number(i)].answer === p ? 1 : 0),
    0
  )

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {i + 1}
            </span>
            <p className="text-base font-medium text-slate-900">{q.q}</p>
          </div>
          <div className="space-y-2">
            {q.choices.map((c, ci) => {
              const picked = picks[i] === ci
              const correct = submitted && q.answer === ci
              const wrong = submitted && picked && q.answer !== ci
              return (
                <button
                  key={ci}
                  type="button"
                  disabled={submitted}
                  onClick={() => setPicks((p) => ({ ...p, [i]: ci }))}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    correct
                      ? 'border-green-400 bg-green-50 text-green-900'
                      : wrong
                      ? 'border-red-400 bg-red-50 text-red-900'
                      : picked
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="mr-2 font-medium">{String.fromCharCode(65 + ci)}.</span>
                  {c}
                </button>
              )
            })}
          </div>
          {submitted && (
            <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <strong className="text-slate-900">Why:</strong> {q.explanation}
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        {submitted ? (
          <>
            <div className="text-lg font-semibold text-slate-900">
              Score: {score} / {questions.length}
            </div>
            <button
              onClick={() => {
                setSubmitted(false)
                setPicks({})
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Try again
            </button>
          </>
        ) : (
          <>
            <div className="text-sm text-slate-500">
              {Object.keys(picks).length} of {questions.length} answered
            </div>
            <button
              disabled={Object.keys(picks).length !== questions.length}
              onClick={() => setSubmitted(true)}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit answers
            </button>
          </>
        )}
      </div>
    </div>
  )
}
