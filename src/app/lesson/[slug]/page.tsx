import { notFound } from "next/navigation";
import { LESSON_META } from "@/lib/lessons-meta";
import { getLessonContent } from "@/lib/lessons";
import { EXERCISES } from "@/lib/exercises";
import LessonContent from "@/components/LessonContent";
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

  const content = getLessonContent(slug);
  const exercises = EXERCISES[slug] ?? [];

  const currentIndex = LESSON_META.findIndex(l => l.slug === slug);
  const prev = LESSON_META[currentIndex - 1];
  const next = LESSON_META[currentIndex + 1];

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <div className="mb-2 text-xs text-gray-500 uppercase tracking-wider">
        Lesson {meta.order} of {LESSON_META.length}
      </div>
      <h1 className="text-3xl font-bold text-white mb-8">{meta.title}</h1>

      <div className="mb-10">
        <LessonContent content={content} />
      </div>

      {exercises.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-orange-400">⌨</span> Hands-on Exercises
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Use the terminal below to run these commands against a live Kafka broker.
          </p>
          <div className="space-y-4">
            {exercises.map((ex, i) => (
              <ExerciseCard key={ex.id} exercise={ex} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-green-400">$</span> Live Kafka Terminal
        </h2>
        <p className="text-xs text-gray-500 mb-3">
          Connected to a real Kafka broker. Bootstrap server is pre-configured.
          Aliases available: <code className="text-orange-300">kafka-topics</code>,{" "}
          <code className="text-orange-300">kafka-producer</code>,{" "}
          <code className="text-orange-300">kafka-consumer</code>
        </p>
        <Terminal />
      </section>

      <div className="flex justify-between pt-4 border-t border-gray-800">
        {prev ? (
          <a
            href={prev.slug === "install" ? "/install" : `/lesson/${prev.slug}`}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← {prev.title}
          </a>
        ) : <span />}
        {next ? (
          <a
            href={next.slug === "install" ? "/install" : `/lesson/${next.slug}`}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {next.title} →
          </a>
        ) : <span />}
      </div>
    </div>
  );
}
