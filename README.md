# Kafka 101 — Interactive Learning Webapp

An interactive Next.js learning platform built from the Apache Kafka 101 (2025) course by Tim Berglund. Each lesson page includes an embedded terminal connected to a live Kafka broker running in Docker.

## Quick Start

```bash
docker-compose up --build
```

Open **http://localhost:3000** — the embedded terminal on each lesson page is a real bash shell with Kafka CLI tools pre-configured.

## Terminal aliases (available in the browser terminal)

| Alias | Description |
|-------|-------------|
| `kafka-topics --list` | List all topics |
| `kafka-topics --create --topic X --partitions 1 --replication-factor 1` | Create a topic |
| `kafka-producer --topic X` | Produce messages |
| `kafka-consumer --topic X --from-beginning` | Consume messages |

## Development without Docker

```bash
# Start Kafka + terminal sidecar only
docker-compose up kafka kafka-shell

# Run webapp locally
npm install && npm run dev
```

## Architecture

```
webapp (Next.js :3000)
  └── iframe ──→ kafka-shell (ttyd :7681)
                      └── CLI tools ──→ kafka (broker :9092)
```

---

Original create-next-app README below:

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
