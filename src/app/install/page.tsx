import { INSTALL_CONTENT } from "@/lib/install";
import LessonContent from "@/components/LessonContent";
import Terminal from "@/components/Terminal";

export default function InstallPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <div className="mb-2 text-xs text-slate-600 uppercase tracking-wider font-semibold">
        Lesson 12 of 12
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Installing Kafka</h1>

      <div className="mb-10 text-slate-800">
        <LessonContent content={INSTALL_CONTENT} />
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="text-emerald-600">$</span> Try it in the Terminal
        </h2>
        <p className="text-sm text-slate-700 mb-3">
          This terminal is already connected to a running Kafka broker — no install needed here!
          Use it to verify commands from the guide above.
        </p>
        <Terminal />
      </section>

      <div className="flex justify-between pt-4 border-t border-slate-200">
        <a href="/lesson/confluent-offerings" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors">
          ← Confluent&apos;s Offerings
        </a>
        <a href="/" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors">
          Back to course overview →
        </a>
      </div>
    </div>
  );
}
