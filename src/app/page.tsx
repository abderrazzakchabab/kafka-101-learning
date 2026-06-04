import Link from "next/link";
import { LESSON_META } from "@/lib/lessons-meta";

export default function Home() {
  const lessons = LESSON_META;

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          ⚡ Apache Kafka 101
        </h1>
        <p className="text-lg text-gray-400 mb-1">
          2025 Edition · Tim Berglund
        </p>
        <p className="text-gray-500 max-w-2xl">
          Learn Kafka through video transcripts, hands-on CLI exercises, and a live Kafka environment
          running right in your browser. No setup required.
        </p>
      </div>

      <div className="grid gap-3 mb-10">
        {lessons.map((lesson) => {
          const href = lesson.slug === "install" ? "/install" : `/lesson/${lesson.slug}`;
          return (
            <Link
              key={lesson.slug}
              href={href}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-800 bg-gray-900 hover:border-orange-500 hover:bg-gray-800 transition-all group"
            >
              <span className="text-2xl font-bold text-gray-700 group-hover:text-orange-500 w-10 text-right shrink-0">
                {lesson.order}
              </span>
              <div>
                <div className="font-medium text-white group-hover:text-orange-400 transition-colors">
                  {lesson.title}
                </div>
                {lesson.slug === "install" && (
                  <div className="text-xs text-gray-500 mt-0.5">Setup guide</div>
                )}
              </div>
              <span className="ml-auto text-gray-600 group-hover:text-orange-500 transition-colors">→</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 rounded-lg border border-blue-800 bg-blue-950/30 text-sm text-blue-300">
        <strong className="text-blue-200">Live Kafka environment:</strong> Each lesson page includes an embedded
        terminal connected to a real Kafka broker. Type commands, produce messages, and consume events —
        all in your browser.
      </div>
    </div>
  );
}
