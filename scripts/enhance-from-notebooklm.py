#!/usr/bin/env python3
"""Ask NotebookLM (Kafka 101 notebook) for enhanced pedagogic content per lesson.
Writes scripts/lesson-enhancements.json."""
import json, subprocess, sys, os, time, pathlib

NB = "0772f46b-57d5-4fb9-bd04-f919b2fb1a5f"
LESSONS = [
    ("intro", "Introduction to Apache Kafka"),
    ("topics", "Kafka Topics"),
    ("partitions", "Kafka Partitions"),
    ("brokers", "Kafka Brokers"),
    ("producers", "Kafka Producers"),
    ("consumers", "Kafka Consumers and Consumer Groups"),
    ("replication", "Kafka Replication and Fault Tolerance"),
    ("kafka-connect", "Kafka Connect"),
    ("schema-registry", "Confluent Schema Registry"),
    ("stream-processing", "Stream Processing with Kafka Streams"),
    ("confluent-offerings", "Confluent's Offerings"),
]

PROMPT = """Based on the sources, write a SHORT pedagogic deep-dive for "{title}".
Return ONLY a valid JSON object with these exact keys, no markdown fences:
{{
  "deepDive": "2-3 sentences with a non-obvious technical insight a beginner often misses",
  "analogy": "a vivid real-world analogy in 1-2 sentences",
  "pitfall": "a common beginner pitfall and how to avoid it, 1-2 sentences",
  "quizQuestion": "a single multiple-choice question testing real understanding",
  "quizChoices": ["choice A", "choice B", "choice C", "choice D"],
  "quizAnswer": 0,
  "quizExplanation": "why the correct answer is right, 1 sentence"
}}
Keep prose tight, concrete, and faithful to the sources. No fluff."""

def ask(slug, title):
    p = PROMPT.format(title=title)
    r = subprocess.run(
        ["notebooklm", "ask", p, "--notebook", NB, "--json"],
        capture_output=True, text=True, timeout=180
    )
    if r.returncode != 0:
        print(f"  ! {slug}: ask failed: {r.stderr.strip()[:200]}", file=sys.stderr)
        return None
    try:
        outer = json.loads(r.stdout)
        ans = outer.get("answer", "").strip()
        # strip code fences if present
        if ans.startswith("```"):
            ans = ans.strip("`")
            if ans.lower().startswith("json"):
                ans = ans[4:].strip()
        # find first { and last }
        i, j = ans.find("{"), ans.rfind("}")
        if i >= 0 and j > i:
            ans = ans[i:j+1]
        return json.loads(ans)
    except Exception as e:
        print(f"  ! {slug}: parse failed: {e}", file=sys.stderr)
        print(f"    raw: {r.stdout[:300]}", file=sys.stderr)
        return None

out = {}
for slug, title in LESSONS:
    print(f"-> {slug} ({title})")
    res = ask(slug, title)
    if res:
        out[slug] = res
        print(f"   ok ({len(res.get('deepDive',''))} chars deepDive)")
    time.sleep(2)

path = pathlib.Path(__file__).parent / "lesson-enhancements.json"
path.write_text(json.dumps(out, indent=2, ensure_ascii=False))
print(f"\nWrote {path}  ({len(out)}/{len(LESSONS)} lessons)")
