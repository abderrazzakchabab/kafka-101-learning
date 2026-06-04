#!/usr/bin/env bash
# Regenerate lesson hero images via Venice AI flux-2-pro.
# Usage: VENICE_API_KEY=... bash scripts/generate-images.sh

set -u
: "${VENICE_API_KEY:?Set VENICE_API_KEY}"

OUT="$(pwd)/public/images/lessons"
mkdir -p "$OUT"

STYLE='isometric flat illustration, soft pastel palette of indigo blue, teal, and warm amber, clean vector style, abstract tech concept art, minimalist, white background, no text, no logos, no people, professional educational illustration for an online course platform'

declare -a LESSONS=(
  "intro|glowing river of data flowing through abstract geometric servers, connected nodes pulsing with light, event streaming concept"
  "topics|stacks of horizontal labeled scrolls representing append-only logs, organized in named bins"
  "partitions|a long log split into multiple parallel colored lanes, abstract horizontal partitioning"
  "brokers|cluster of three connected server cubes with arrows for leader-follower replication"
  "producers|origami paper planes labeled with data flying into a glowing distributed log"
  "consumers|small robots reading from a long ribbon of events at different positions"
  "replication|three identical data cubes mirrored across data center icons, sync lines between them"
  "kafka-connect|two opposite-facing pipes connecting a database icon and a search icon to a central streaming hub"
  "stream-processing|flowing river of data passing through filter funnels and aggregation gears"
  "schema-registry|a library with labeled blueprint scrolls and version tags, a central registry book"
  "confluent-offerings|three nested tiers: open core, platform, cloud — a layered enterprise data platform"
)

ok=0
total=${#LESSONS[@]}
for entry in "${LESSONS[@]}"; do
  slug="${entry%%|*}"
  desc="${entry#*|}"
  prompt="${desc}. Style: ${STYLE}"
  body=$(jq -nc --arg m flux-2-pro --arg p "$prompt" --argjson w 1024 --argjson h 576 \
    '{model:$m, prompt:$p, width:$w, height:$h, format:"png"}')
  resp=$(curl -s -X POST "https://api.venice.ai/api/v1/image/generate" \
    -H "Authorization: Bearer $VENICE_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$body")
  b64=$(echo "$resp" | jq -r '.images[0] // empty')
  if [ -n "$b64" ]; then
    echo "$b64" | base64 -d > "$OUT/${slug}.png"
    sig=$(xxd -l 4 -p "$OUT/${slug}.png")
    case "$sig" in
      ffd8*) mv "$OUT/${slug}.png" "$OUT/${slug}.jpg"; ext=jpg ;;
      52494646) mv "$OUT/${slug}.png" "$OUT/${slug}.webp"; ext=webp ;;
      *) ext=png ;;
    esac
    echo "✓ $slug ($ext)"
    ok=$((ok+1))
  else
    echo "✗ $slug $(echo "$resp" | head -c 200)"
  fi
  sleep 1
done
echo
echo "$ok/$total generated"
