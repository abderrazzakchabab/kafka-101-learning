#!/usr/bin/env python3
import json, subprocess, sys, time, pathlib
NB = "0772f46b-57d5-4fb9-bd04-f919b2fb1a5f"
MISSING = [
    ("partitions", "Kafka Partitions"),
    ("producers", "Kafka Producers"),
    ("schema-registry", "Confluent Schema Registry"),
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
    for attempt in range(3):
        r = subprocess.run(["notebooklm", "ask", p, "--notebook", NB, "--json"],
                           capture_output=True, text=True, timeout=240)
        if r.returncode == 0:
            try:
                ans = json.loads(r.stdout).get("answer", "").strip()
                if ans.startswith("```"):
                    ans = ans.strip("`")
                    if ans.lower().startswith("json"): ans = ans[4:].strip()
                i, j = ans.find("{"), ans.rfind("}")
                if i >= 0 and j > i: ans = ans[i:j+1]
                return json.loads(ans)
            except Exception as e:
                print(f"  parse error attempt {attempt+1}: {e}", file=sys.stderr)
        else:
            print(f"  err attempt {attempt+1}: {r.stderr.strip()[:200]}", file=sys.stderr)
        time.sleep(15 * (attempt + 1))
    return None

path = pathlib.Path(__file__).parent / "lesson-enhancements.json"
out = json.loads(path.read_text())
for slug, title in MISSING:
    if slug in out:
        continue
    print(f"-> {slug}")
    res = ask(slug, title)
    if res:
        out[slug] = res
        print(f"   ok")
    time.sleep(5)

path.write_text(json.dumps(out, indent=2, ensure_ascii=False))
print(f"Total: {len(out)} lessons")
