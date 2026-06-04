#!/usr/bin/env node
// Regenerate lesson hero images via Venice AI flux-2-pro.
// Usage: VENICE_API_KEY=... node scripts/generate-images.mjs

import fs from 'node:fs'
import path from 'node:path'
import https from 'node:https'
import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

const KEY = process.env.VENICE_API_KEY
if (!KEY) {
  console.error('Set VENICE_API_KEY')
  process.exit(1)
}

const OUT = path.resolve('public/images/lessons')
fs.mkdirSync(OUT, { recursive: true })

const STYLE =
  'isometric flat illustration, soft pastel palette of indigo blue, teal, and warm amber, clean vector style, abstract tech concept art, minimalist, white background, no text, no logos, no people, professional educational illustration for an online course platform'

const lessons = [
  ['intro', 'glowing river of data flowing through abstract geometric servers, connected nodes pulsing with light, event streaming concept'],
  ['topics', 'stacks of horizontal labeled scrolls representing append-only logs, organized in named bins'],
  ['partitions', 'a long log split into multiple parallel colored lanes, abstract horizontal partitioning'],
  ['brokers', 'cluster of three connected server cubes with arrows for leader-follower replication'],
  ['producers', 'origami paper planes labeled with data flying into a glowing distributed log'],
  ['consumers', 'small robots reading from a long ribbon of events at different positions'],
  ['replication', 'three identical data cubes mirrored across data center icons, sync lines between them'],
  ['kafka-connect', 'two opposite-facing pipes connecting a database icon and a search icon to a central streaming hub'],
  ['stream-processing', 'flowing river of data passing through filter funnels and aggregation gears'],
  ['schema-registry', 'a library with labeled blueprint scrolls and version tags, a central registry book'],
  ['confluent-offerings', 'three nested tiers: open core, platform, cloud — a layered enterprise data platform'],
]

function gen(slug, sceneDesc) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      model: 'flux-2-pro',
      prompt: `${sceneDesc}. Style: ${STYLE}`,
      width: 1024,
      height: 576,
      format: 'png',
    })
    const req = https.request(
      {
        hostname: 'api.venice.ai',
        path: '/api/v1/image/generate',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const data = Buffer.concat(chunks).toString('utf8')
          try {
            const j = JSON.parse(data)
            const b64 = j.images && j.images[0]
            if (b64) {
              const bin = Buffer.from(b64, 'base64')
              const sig = bin.slice(0, 4).toString('hex')
              const ext = sig.startsWith('ffd8') ? 'jpg' : sig === '52494646' ? 'webp' : 'png'
              fs.writeFileSync(path.join(OUT, `${slug}.${ext}`), bin)
              resolve({ slug, ok: true, ext })
            } else {
              resolve({ slug, ok: false, status: res.statusCode, err: data.slice(0, 300) })
            }
          } catch (e) {
            resolve({ slug, ok: false, err: `${e.message} body=${data.slice(0, 200)}` })
          }
        })
      }
    )
    req.on('error', (e) => resolve({ slug, ok: false, err: e.message }))
    req.write(body)
    req.end()
  })
}

const results = []
for (const [slug, desc] of lessons) {
  const r = await gen(slug, desc)
  results.push(r)
  console.log(`${r.ok ? '✓' : '✗'} ${slug} ${r.err ?? ''}`)
  await new Promise((r) => setTimeout(r, 1500))
}
console.log(`\n${results.filter((r) => r.ok).length}/${results.length} generated`)
