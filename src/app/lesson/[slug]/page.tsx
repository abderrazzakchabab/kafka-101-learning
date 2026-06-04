import { notFound } from "next/navigation";
import Link from "next/link";
import { LESSON_META } from "@/lib/lessons-meta";
import { LESSON_CONTENT, getLessonData } from "@/lib/lesson-content";
import { EXERCISES } from "@/lib/exercises";
import StructuredLesson from "@/components/StructuredLesson";
import Quiz from "@/components/Quiz";
import Terminal from "@/components/Terminal";
import ExerciseCard from "@/components/ExerciseCard";

export function generateStaticParams() {
  return LESSON_META.filter(l => l.slug !== "install").map(l => ({ slug: l.slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = LESSON_META.find(l => l.slug === slug && l.slug !== "install");
  if (!meta) notFound();

  const data = getLessonData(slug);
  const exercises = EXERCISES[slug] ?? [];

  const currentIndex = LESSON_META.findIndex(l => l.slug === slug);
  const prev = LESSON_META[currentIndex - 1];
  const next = LESSON_META[currentIndex + 1];

  return (
    <div className="min-h-screen">
      {data && (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white">
          <div className="absolute inset-0 opacity-30">
            <img src={data.heroImage} alt="" className="w-full h-full object-cover"/>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-blue-900/40"/>
          <div className="relative max-w-4xl mx-auto px-10 py-12">
            <nav className="mb-4 flex items-center gap-2 text-xs text-blue-100">
              <Link href="/" className="hover:text-white">Course</Link>
              <span>›</span>
              <span className="text-white">Lesson {meta.order}</span>
            </nav>
            <div className="flex items-center gap-2 mb-3 text-xs">
              <span className="rounded-full bg-white/20 backdrop-blur px-3 py-1 font-medium">
                Lesson {meta.order} of {LESSON_META.length}
              </span>
              <span className="rounded-full bg-white/20 backdrop-blur px-3 py-1 font-medium">
                {data.level}
              </span>
              <span className="rounded-full bg-white/20 backdrop-blur px-3 py-1 font-medium">
                {data.durationMin} min
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-3">{meta.title}</h1>
            <p className="text-lg text-blue-50 max-w-2xl">{data.subtitle}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0">
          {data ? (
            <StructuredLesson data={data} />
          ) : (
            <div className="text-slate-600">Content coming soon.</div>
          )}

          {data && data.quiz.length > 0 && (
            <section className="mt-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">?</span>
                  Check your understanding
                </h2>
                <p className="text-sm text-slate-600">Answer all questions, then submit to see your score.</p>
              </div>
              <Quiz questions={data.quiz} />
            </section>
          )}

          {exercises.length > 0 && (
            <section className="mt-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">⌨</span>
                  Hands-on practice
                </h2>
                <p className="text-sm text-slate-600">Run these commands in the terminal on the right →</p>
              </div>
              <div className="space-y-4">
                {exercises.map((ex, i) => (
                  <ExerciseCard key={ex.id} exercise={ex} index={i} />
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 flex justify-between border-t border-slate-200 pt-6">
            {prev ? (
              <Link
                href={prev.slug === "install" ? "/install" : `/lesson/${prev.slug}`}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <span className="text-xs text-slate-500">← Previous</span>
                <span className="font-semibold text-slate-900 group-hover:text-blue-700">{prev.title}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link
                href={next.slug === "install" ? "/install" : `/lesson/${next.slug}`}
                className="group flex flex-col items-end rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <span className="text-xs text-slate-500">Next →</span>
                <span className="font-semibold text-slate-900 group-hover:text-blue-700">{next.title}</span>
              </Link>
            ) : <span />}
          </div>
        </div>

        <aside className="sticky top-4 self-start h-[calc(100vh-2rem)] flex flex-col z-10">
          <div className="mb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 text-sm">$</span>
              Live Kafka terminal
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Try <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800">kafka-topics --list</code>
            </p>
          </div>
          <div className="flex-1 min-h-[480px]">
            <Terminal />
          </div>
        </aside>
      </div>
    </div>
  );
}
