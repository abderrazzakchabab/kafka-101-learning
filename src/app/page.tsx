import Link from "next/link";
import { LESSON_META } from "@/lib/lessons-meta";
import { LESSON_CONTENT } from "@/lib/lesson-content";

export default function Home() {
  const totalMin = Object.values(LESSON_CONTENT).reduce((a, l) => a + l.durationMin, 0);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px, 90px 90px',
        }}/>
        <div className="relative max-w-6xl mx-auto px-10 py-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse"/>
            Live Kafka environment included
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4 max-w-3xl">
            Apache Kafka 101
          </h1>
          <p className="text-xl text-blue-50 max-w-2xl mb-6">
            Learn event streaming from first principles — with hands-on exercises against a real Kafka broker running in your browser.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div><span className="block text-blue-200 text-xs uppercase tracking-wider">Lessons</span><span className="text-2xl font-bold">{LESSON_META.length}</span></div>
            <div><span className="block text-blue-200 text-xs uppercase tracking-wider">Duration</span><span className="text-2xl font-bold">~{totalMin} min</span></div>
            <div><span className="block text-blue-200 text-xs uppercase tracking-wider">Quizzes</span><span className="text-2xl font-bold">{Object.values(LESSON_CONTENT).reduce((a,l)=>a+l.quiz.length,0)} questions</span></div>
            <div><span className="block text-blue-200 text-xs uppercase tracking-wider">Level</span><span className="text-2xl font-bold">Beginner → Advanced</span></div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-10 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Course outline</h2>
        <p className="text-slate-600 mb-8">11 lessons that build on each other — start at the top, or jump to whatever you need.</p>

        <div className="grid gap-5 md:grid-cols-2">
          {LESSON_META.map((lesson) => {
            const data = LESSON_CONTENT[lesson.slug];
            const href = lesson.slug === "install" ? "/install" : `/lesson/${lesson.slug}`;
            return (
              <Link
                key={lesson.slug}
                href={href}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all"
              >
                {data ? (
                  <div className="h-32 overflow-hidden">
                    <img src={data.heroImage} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform"/>
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
                    <span className="text-3xl">⚙</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    <span className="text-slate-500 font-medium">Lesson {lesson.order}</span>
                    {data && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500">{data.durationMin} min</span>
                        <span className="text-slate-300">·</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          data.level === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                          data.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>{data.level}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {data ? data.subtitle : 'Setup guide for installing Kafka locally.'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
