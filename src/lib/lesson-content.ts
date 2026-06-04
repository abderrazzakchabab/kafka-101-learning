// Pedagogic lesson content — original, structured. NOT a 1:1 copy of transcripts.
// Each lesson has: hero image, objectives, sections (with optional code/diagram), key takeaways, quiz.

export interface QuizQuestion {
  q: string
  choices: string[]
  answer: number // index
  explanation: string
}

export interface ContentBlock {
  type: 'text' | 'code' | 'callout' | 'diagram'
  body: string
  lang?: string
  variant?: 'info' | 'warning' | 'success'
  caption?: string
}

export interface LessonSection {
  heading: string
  blocks: ContentBlock[]
}

export interface LessonContentData {
  slug: string
  subtitle: string
  durationMin: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  heroImage: string // /images/lessons/<slug>.png
  objectives: string[]
  sections: LessonSection[]
  takeaways: string[]
  quiz: QuizQuestion[]
}

export const LESSON_CONTENT: Record<string, LessonContentData> = {
  intro: {
    slug: 'intro',
    subtitle: 'Why event streaming changed how modern systems are built',
    durationMin: 8,
    level: 'Beginner',
    heroImage: '/images/lessons/intro.png',
    objectives: [
      'Explain what Apache Kafka is and what problem it solves',
      'Distinguish event streaming from request/response and batch processing',
      'Identify use cases where Kafka is the right tool — and where it is not',
    ],
    sections: [
      {
        heading: 'From databases to streams',
        blocks: [
          { type: 'text', body: "Traditional systems store the **current state** of the world: a row in a `users` table tells you what the user's email is right now. Kafka takes a different view: it stores the **stream of events** that produced that state — every email change, every login, every order. State becomes a *projection* of the log, not the source of truth." },
          { type: 'callout', variant: 'info', body: '**The log is primary.** State is derived. This inversion is the foundation of every other Kafka concept.' },
        ],
      },
      {
        heading: 'What Kafka actually is',
        blocks: [
          { type: 'text', body: 'Kafka is a **distributed, durable, append-only log** with a pub/sub API on top. Producers write events; consumers read them; the broker cluster stores them and replicates them across machines for safety.' },
          { type: 'text', body: 'Three properties define it: it is **fast** (millions of events/sec on commodity hardware), **durable** (replicated to disk), and **replayable** (consumers can rewind to any point in the log).' },
        ],
      },
      {
        heading: 'When to reach for Kafka',
        blocks: [
          { type: 'text', body: '**Good fit:** event-driven microservices, real-time analytics, change data capture from databases, decoupling producers from consumers, audit trails, log aggregation, IoT pipelines.' },
          { type: 'callout', variant: 'warning', body: '**Not a fit:** request/response APIs, small low-traffic systems where a database queue suffices, workloads requiring strict global ordering across partitions.' },
        ],
      },
    ],
    takeaways: [
      'Kafka stores events in an append-only log; state is derived from that log.',
      'It decouples producers and consumers in time and identity.',
      'Use it for streaming, integration, and event sourcing — not for everything.',
    ],
    quiz: [
      {
        q: 'What is the primary data structure Kafka exposes to applications?',
        choices: ['A key-value store', 'An append-only, replayable log', 'A relational table', 'A graph database'],
        answer: 1,
        explanation: 'Kafka is fundamentally a distributed append-only log. Everything else — pub/sub, streams, connectors — is built on top of that.',
      },
      {
        q: 'Which workload is the WORST fit for Kafka?',
        choices: ['Streaming clickstream analytics', 'A synchronous REST API returning a user profile', 'Change data capture from Postgres', 'Decoupling microservices'],
        answer: 1,
        explanation: 'Kafka is asynchronous and decoupled by design. Synchronous request/response is exactly what it is not for.',
      },
    ],
  },

  topics: {
    slug: 'topics',
    subtitle: 'The unit of organization in Kafka — append-only, immutable, ordered',
    durationMin: 10,
    level: 'Beginner',
    heroImage: '/images/lessons/topics.png',
    objectives: [
      'Define a topic and describe its append-only nature',
      'Explain why events in a topic are immutable',
      'Configure retention by time and by size',
    ],
    sections: [
      {
        heading: 'A topic is a named log',
        blocks: [
          { type: 'text', body: 'A **topic** is a named, ordered, append-only sequence of events. Think of it like a filesystem log file that many producers can write to and many consumers can read from — except it is distributed and durable.' },
          { type: 'code', lang: 'bash', body: 'kafka-topics --create --topic orders --partitions 3 --replication-factor 1' },
        ],
      },
      {
        heading: 'Immutability matters',
        blocks: [
          { type: 'text', body: 'Once an event is written, it **cannot be changed or deleted by consumers**. This is not a limitation — it is the feature. Immutability gives you: replay for new consumers, audit trails for free, and reproducible derived state.' },
          { type: 'callout', variant: 'info', body: 'You **correct** the past by appending a new event, not by editing an old one. This is the same model accountants have used for centuries.' },
        ],
      },
      {
        heading: 'Retention: how long do events live?',
        blocks: [
          { type: 'text', body: 'Events stay in a topic until **retention** evicts them. Default is 7 days. You can configure by time (`retention.ms`) or by size (`retention.bytes`). For some topics — like a customer master list — you may want **compaction** instead, which keeps the latest event per key forever.' },
        ],
      },
    ],
    takeaways: [
      'Topics are named, ordered, append-only logs.',
      'Events are immutable — corrections are new appends.',
      'Retention controls how long events live; compaction keeps the latest per key.',
    ],
    quiz: [
      {
        q: 'Can a consumer delete an event from a topic?',
        choices: ['Yes, by calling delete()', 'Yes, after acknowledging it', 'No, events are immutable', 'Only the broker can'],
        answer: 2,
        explanation: 'Events in Kafka are immutable. Consumers only read; they cannot mutate the log. Eviction happens via retention policy, not consumer action.',
      },
      {
        q: 'You want to keep only the latest value per user_id forever. Which policy?',
        choices: ['retention.ms = -1', 'Log compaction', 'Increase replication factor', 'Use a single partition'],
        answer: 1,
        explanation: 'Log compaction keeps the most recent value for each key indefinitely while pruning older versions — perfect for a current-state view.',
      },
    ],
  },

  partitions: {
    slug: 'partitions',
    subtitle: 'How Kafka scales a single topic across many machines',
    durationMin: 9,
    level: 'Beginner',
    heroImage: '/images/lessons/partitions.png',
    objectives: [
      'Explain how partitions enable horizontal scale',
      'Describe how keys map to partitions',
      'Understand the ordering guarantee Kafka provides — and its limits',
    ],
    sections: [
      {
        heading: 'One topic, many shards',
        blocks: [
          { type: 'text', body: 'A topic is split into **partitions**. Each partition is itself an ordered log, hosted on one broker (with replicas elsewhere). Partitions are how Kafka scales throughput: 10 partitions = 10 brokers can write in parallel.' },
        ],
      },
      {
        heading: 'Keys decide the partition',
        blocks: [
          { type: 'text', body: 'When a producer sends an event with a key, Kafka hashes the key to choose a partition. **All events with the same key land in the same partition** — and therefore in the same order. No key? Round-robin across partitions.' },
          { type: 'code', lang: 'java', body: 'producer.send(new ProducerRecord<>("orders", "user-42", orderJson));\n// every event for user-42 will sit in the same partition, in order' },
        ],
      },
      {
        heading: 'The ordering guarantee',
        blocks: [
          { type: 'callout', variant: 'warning', body: 'Kafka guarantees order **within a partition**, not across a topic. If you need strict per-customer ordering, key by customer_id. If you need strict global ordering, use one partition (and give up scale).' },
        ],
      },
    ],
    takeaways: [
      'Partitions are the unit of parallelism.',
      'Same key → same partition → guaranteed order for that key.',
      'No global ordering across partitions. Design your keys accordingly.',
    ],
    quiz: [
      {
        q: 'You partition an "orders" topic with 6 partitions and key by customer_id. What is true?',
        choices: ['All orders are globally ordered', 'Orders for one customer are in order; across customers, no guarantee', 'Orders are random and unordered', 'You need a database to get ordering'],
        answer: 1,
        explanation: 'Kafka orders events within a partition. Keying by customer_id puts each customer\'s events on one partition, giving per-customer ordering but no cross-customer ordering.',
      },
      {
        q: 'Why might you choose more partitions than brokers?',
        choices: ['It is required', 'To allow future scale-out and more consumer parallelism', 'To reduce disk usage', 'To enforce ordering'],
        answer: 1,
        explanation: 'Partition count caps consumer parallelism and future scale. Over-provisioning partitions (within reason) leaves room to add brokers and consumers later.',
      },
    ],
  },

  brokers: {
    slug: 'brokers',
    subtitle: 'The servers that store partitions and serve clients',
    durationMin: 8,
    level: 'Beginner',
    heroImage: '/images/lessons/brokers.png',
    objectives: [
      'Describe the role of a broker in a Kafka cluster',
      'Understand the leader/follower model for a partition',
      'Explain what KRaft replaced and why',
    ],
    sections: [
      {
        heading: 'The broker, in one sentence',
        blocks: [
          { type: 'text', body: 'A **broker** is a Kafka server. It stores partition data on disk, serves produce and fetch requests, and coordinates with peers in the cluster.' },
        ],
      },
      {
        heading: 'Leader and followers',
        blocks: [
          { type: 'text', body: 'For each partition, one broker is the **leader** — it handles all reads and writes. Other brokers hold **follower** replicas that stay in sync. If the leader dies, a follower is promoted. This is how Kafka stays available through node failures.' },
        ],
      },
      {
        heading: 'KRaft: bye-bye ZooKeeper',
        blocks: [
          { type: 'text', body: 'Older Kafka used **ZooKeeper** to track cluster metadata. Modern Kafka uses **KRaft** — Kafka\'s own Raft-based consensus — built directly into the brokers. Simpler operations, faster failover, fewer moving parts.' },
        ],
      },
    ],
    takeaways: [
      'Brokers store partitions and serve clients.',
      'One leader per partition handles I/O; followers replicate for safety.',
      'KRaft replaced ZooKeeper in modern Kafka.',
    ],
    quiz: [
      {
        q: 'Where do consumer fetch requests for a given partition go?',
        choices: ['Any broker', 'Only the leader of that partition', 'ZooKeeper', 'A load balancer'],
        answer: 1,
        explanation: 'The leader of a partition is the authoritative source for reads and writes. Followers exist for replication, not to serve clients.',
      },
      {
        q: 'What does KRaft replace?',
        choices: ['The producer API', 'ZooKeeper for cluster metadata', 'The consumer group protocol', 'TLS'],
        answer: 1,
        explanation: 'KRaft is Kafka\'s built-in Raft consensus protocol, replacing the external ZooKeeper dependency for metadata management.',
      },
    ],
  },

  producers: {
    slug: 'producers',
    subtitle: 'How events get into Kafka — with the durability you choose',
    durationMin: 10,
    level: 'Beginner',
    heroImage: '/images/lessons/producers.png',
    objectives: [
      'Send events to Kafka from an application',
      'Choose an acks setting that matches your durability needs',
      'Use idempotence to prevent duplicate writes on retry',
    ],
    sections: [
      {
        heading: 'The minimal producer',
        blocks: [
          { type: 'code', lang: 'bash', body: 'kafka-producer --topic orders\n> {"id":1,"item":"book"}\n> {"id":2,"item":"mug"}' },
          { type: 'text', body: 'A producer connects to any broker, discovers the cluster, and sends records to the leader of each partition. Done.' },
        ],
      },
      {
        heading: 'The acks knob',
        blocks: [
          { type: 'text', body: '`acks` controls when a write is acknowledged: **`0`** — fire and forget. **`1`** — leader has it. **`all`** — leader and all in-sync replicas have it. Faster vs. safer; you pick.' },
          { type: 'callout', variant: 'success', body: 'For most production workloads, `acks=all` + `min.insync.replicas=2` is the safe default.' },
        ],
      },
      {
        heading: 'Idempotent producers',
        blocks: [
          { type: 'text', body: 'Enable `enable.idempotence=true` and the broker will deduplicate retries from the same producer — no more duplicate events on a network blip.' },
        ],
      },
    ],
    takeaways: [
      'Producers send events to partition leaders.',
      'acks trades latency for durability.',
      'Idempotence eliminates duplicate writes on retry.',
    ],
    quiz: [
      {
        q: 'What does acks=all guarantee?',
        choices: ['No data loss is possible ever', 'The write is in the leader and all in-sync replicas before ack', 'The producer never blocks', 'Order across partitions'],
        answer: 1,
        explanation: 'acks=all means the leader waits for all in-sync replicas to persist before acknowledging — the strongest durability Kafka offers, paired with min.insync.replicas.',
      },
      {
        q: 'A network glitch causes the producer to retry. With idempotence ON, what happens?',
        choices: ['The event is written twice', 'The broker deduplicates and writes once', 'The send fails permanently', 'Kafka downgrades to acks=0'],
        answer: 1,
        explanation: 'Idempotent producers attach a sequence number; the broker uses it to drop duplicates from retries.',
      },
    ],
  },

  consumers: {
    slug: 'consumers',
    subtitle: 'Reading from Kafka — at your own pace, with group coordination',
    durationMin: 12,
    level: 'Intermediate',
    heroImage: '/images/lessons/consumers.png',
    objectives: [
      'Read events from a topic with the consumer API',
      'Explain consumer groups and partition assignment',
      'Distinguish offset commit semantics: at-most-once vs at-least-once',
    ],
    sections: [
      {
        heading: 'The pull model',
        blocks: [
          { type: 'text', body: 'Unlike traditional message queues that push, Kafka consumers **pull** at their own rate. A slow consumer doesn\'t drop events — it just falls behind in the log, until it catches up or hits retention.' },
        ],
      },
      {
        heading: 'Consumer groups',
        blocks: [
          { type: 'text', body: 'Consumers that share a `group.id` form a **consumer group**. Kafka assigns each partition to **exactly one** consumer in the group. Add a consumer → partitions rebalance. Lose a consumer → partitions rebalance again. This is how you scale processing horizontally.' },
          { type: 'callout', variant: 'info', body: 'Rule of thumb: max useful consumers in a group = number of partitions.' },
        ],
      },
      {
        heading: 'Offsets and delivery semantics',
        blocks: [
          { type: 'text', body: 'Each consumer tracks its position via an **offset**. Commit before processing → at-most-once (may lose events). Commit after processing → at-least-once (may double-process). Use idempotent processing or transactions for exactly-once.' },
        ],
      },
    ],
    takeaways: [
      'Consumers pull; they cannot be overwhelmed.',
      'Consumer groups distribute partitions across instances.',
      'Where you commit the offset decides your delivery semantics.',
    ],
    quiz: [
      {
        q: 'A topic has 4 partitions. You run 6 consumers in one group. What happens?',
        choices: ['Each gets ~67% of one partition', 'Two consumers sit idle', 'Throughput is 1.5x faster', 'Kafka rejects 2 consumers'],
        answer: 1,
        explanation: 'A partition is assigned to exactly one consumer in a group. With more consumers than partitions, the extras are idle, ready as standby.',
      },
      {
        q: 'You commit offsets AFTER your processing function returns. Your service crashes mid-batch and restarts. What semantic is this?',
        choices: ['Exactly-once', 'At-most-once', 'At-least-once', 'None — events are lost'],
        answer: 2,
        explanation: 'Committing after processing means an uncommitted batch will be re-read after restart — at-least-once delivery, requiring idempotent processing.',
      },
    ],
  },

  replication: {
    slug: 'replication',
    subtitle: 'How Kafka survives broker failures without losing data',
    durationMin: 8,
    level: 'Intermediate',
    heroImage: '/images/lessons/replication.png',
    objectives: [
      'Define replication factor and in-sync replicas (ISR)',
      'Explain leader election when a broker fails',
      'Configure min.insync.replicas for safe writes',
    ],
    sections: [
      {
        heading: 'Replicas, not backups',
        blocks: [
          { type: 'text', body: 'Each partition has a **replication factor** N: one leader + (N-1) followers, each on a different broker. Followers continuously fetch from the leader. If a broker dies, a follower with the latest data takes over — usually in under a second.' },
        ],
      },
      {
        heading: 'The ISR',
        blocks: [
          { type: 'text', body: 'The **in-sync replica set (ISR)** is the followers caught up to the leader. Only ISR members are eligible to become leader. A slow follower drops out of the ISR until it catches up.' },
        ],
      },
      {
        heading: 'min.insync.replicas',
        blocks: [
          { type: 'callout', variant: 'warning', body: 'Set `min.insync.replicas=2` with replication factor 3. Writes (acks=all) succeed only if 2+ replicas have the data. This prevents the dangerous case of a write to a single broker that then dies.' },
        ],
      },
    ],
    takeaways: [
      'Replication factor controls how many copies exist.',
      'Only in-sync replicas can be elected leader.',
      'min.insync.replicas + acks=all = no data loss under single-broker failure.',
    ],
    quiz: [
      {
        q: 'Replication factor is 3, min.insync.replicas is 2, acks is all. Two brokers go down simultaneously. What happens to writes?',
        choices: ['Writes succeed silently', 'Writes are rejected because ISR < 2', 'Writes go to the survivor only', 'Writes are queued forever'],
        answer: 1,
        explanation: 'With only one replica left in the ISR (below min.insync.replicas=2), the broker rejects writes — protecting you from accepting a write that can\'t be replicated.',
      },
      {
        q: 'A follower falls behind. What happens?',
        choices: ['It is deleted', 'It is removed from the ISR until it catches up', 'It becomes the new leader', 'Production halts'],
        answer: 1,
        explanation: 'Slow followers are pruned from the ISR. They stay as replicas and rejoin the ISR once they catch up.',
      },
    ],
  },

  'kafka-connect': {
    slug: 'kafka-connect',
    subtitle: 'Move data in and out of Kafka without writing code',
    durationMin: 10,
    level: 'Intermediate',
    heroImage: '/images/lessons/kafka-connect.png',
    objectives: [
      'Explain what Kafka Connect is and why it exists',
      'Distinguish source connectors from sink connectors',
      'Configure a connector via JSON',
    ],
    sections: [
      {
        heading: 'The integration problem',
        blocks: [
          { type: 'text', body: 'You want events from Postgres into Kafka, and events from Kafka into Elasticsearch. You could write two custom services. Or you could use **Kafka Connect**: a framework for pre-built, configurable connectors that handle the boring parts — offsets, restarts, scaling — for you.' },
        ],
      },
      {
        heading: 'Source vs sink',
        blocks: [
          { type: 'text', body: '**Source connectors** pull data from a system into Kafka (Debezium for CDC, JDBC source, S3 source). **Sink connectors** push from Kafka into a system (Elasticsearch sink, JDBC sink, S3 sink). Same framework, opposite direction.' },
        ],
      },
      {
        heading: 'Configuration, not code',
        blocks: [
          { type: 'code', lang: 'json', body: '{\n  "name": "pg-source",\n  "connector.class": "io.debezium.connector.postgresql.PostgresConnector",\n  "database.hostname": "pg",\n  "database.dbname": "orders",\n  "topic.prefix": "cdc"\n}' },
        ],
      },
    ],
    takeaways: [
      'Connect handles common integrations without custom code.',
      'Source = into Kafka; sink = out of Kafka.',
      'Configuration is JSON; the framework handles operations.',
    ],
    quiz: [
      {
        q: 'You want every Postgres change to appear in Kafka. Which connector type?',
        choices: ['Sink', 'Source', 'Stream', 'Producer'],
        answer: 1,
        explanation: 'Data flowing INTO Kafka uses a source connector. Debezium for Postgres is the canonical choice.',
      },
      {
        q: 'Why use Kafka Connect instead of a custom service?',
        choices: ['It is faster than any code', 'It handles offsets, restarts, and scaling for you', 'It supports more languages', 'It requires no Kafka cluster'],
        answer: 1,
        explanation: 'Connect\'s value is the framework: distributed mode, offset management, restarts, and rebalancing — all the plumbing you\'d otherwise rebuild.',
      },
    ],
  },

  'stream-processing': {
    slug: 'stream-processing',
    subtitle: 'Transform streams as they flow — not after they land',
    durationMin: 12,
    level: 'Advanced',
    heroImage: '/images/lessons/stream-processing.png',
    objectives: [
      'Define stream processing and contrast with batch',
      'Use Kafka Streams operators (filter, map, join, windowed aggregations)',
      'Understand stateful processing and state stores',
    ],
    sections: [
      {
        heading: 'Batch is yesterday',
        blocks: [
          { type: 'text', body: 'Batch jobs ran nightly. By morning, the answer was hours old. **Stream processing** computes continuously: as each event arrives, derived state updates and downstream topics are written. Latency drops from hours to milliseconds.' },
        ],
      },
      {
        heading: 'Kafka Streams in 10 lines',
        blocks: [
          { type: 'code', lang: 'java', body: 'KStream<String, Order> orders = builder.stream("orders");\n\norders\n  .filter((k, v) -> v.amount() > 100)\n  .groupByKey()\n  .windowedBy(TimeWindows.of(Duration.ofMinutes(5)))\n  .count()\n  .toStream()\n  .to("large-orders-per-5min");' },
          { type: 'text', body: 'A topology: read a topic, filter, window, count, write. Kafka Streams runs this as a library inside your service — no separate cluster.' },
        ],
      },
      {
        heading: 'State stores',
        blocks: [
          { type: 'text', body: 'Aggregations need state. Kafka Streams keeps it in **local RocksDB**, backed by a **changelog topic** in Kafka. If your service dies and restarts elsewhere, state is rebuilt from the changelog. Stateful processing, no external database.' },
        ],
      },
    ],
    takeaways: [
      'Stream processing reacts continuously, not on a schedule.',
      'Kafka Streams is a library, not a cluster.',
      'State stores are local + backed by Kafka changelogs for recovery.',
    ],
    quiz: [
      {
        q: 'Which scenario screams "stream processing"?',
        choices: ['Monthly revenue report', 'Real-time fraud detection on card transactions', 'One-time data migration', 'Generating a static sitemap'],
        answer: 1,
        explanation: 'Fraud detection needs decisions in milliseconds on each event — the textbook stream processing case.',
      },
      {
        q: 'A Kafka Streams app crashes. How is its state recovered on the new instance?',
        choices: ['From a SQL backup', 'Replayed from the changelog topic in Kafka', 'Recomputed from scratch always', 'Lost permanently'],
        answer: 1,
        explanation: 'Every state store has a compacted changelog topic. On restart, the new instance reads it to rebuild state — Kafka itself is the durability layer.',
      },
    ],
  },

  'schema-registry': {
    slug: 'schema-registry',
    subtitle: 'Make event schemas explicit, versioned, and safely evolvable',
    durationMin: 10,
    level: 'Intermediate',
    heroImage: '/images/lessons/schema-registry.png',
    objectives: [
      'Explain why schemas matter in a streaming system',
      'Use Avro, Protobuf, or JSON Schema with a registry',
      'Apply compatibility rules to evolve schemas safely',
    ],
    sections: [
      {
        heading: 'The implicit-schema trap',
        blocks: [
          { type: 'text', body: 'A producer changes a field from `string` to `int`. Three consumers break in production at 3 AM. The events looked fine in Kafka. **The schema was implicit — and that\'s the bug.**' },
        ],
      },
      {
        heading: 'What the registry does',
        blocks: [
          { type: 'text', body: 'The **Schema Registry** stores schemas, versions them, and assigns each an ID. Producers serialize with a schema; the bytes on the wire are `[magic byte][schema id][payload]`. Consumers fetch the schema by ID to deserialize. Every event in Kafka is now self-describing.' },
        ],
      },
      {
        heading: 'Compatibility modes',
        blocks: [
          { type: 'text', body: '**Backward** — new schema can read old data (default). **Forward** — old schema can read new data. **Full** — both. Pick one per subject; the registry will reject incompatible changes at registration time, not in production.' },
          { type: 'callout', variant: 'success', body: 'Backward compatibility + default values for new fields = consumers can be upgraded after producers, safely.' },
        ],
      },
    ],
    takeaways: [
      'Implicit schemas cause production fires; explicit schemas prevent them.',
      'The registry stores, versions, and IDs each schema.',
      'Compatibility rules catch breaking changes before deploy.',
    ],
    quiz: [
      {
        q: 'A producer adds a new required field. Backward compatibility is enforced. What happens at registration?',
        choices: ['Accepted', 'Rejected — new required fields break backward compat', 'Accepted but consumers crash', 'A warning email is sent'],
        answer: 1,
        explanation: 'A new required field with no default means old consumers (using the old schema) can\'t parse the new data — that\'s backward-incompatible. The registry rejects it.',
      },
      {
        q: 'What goes on the wire with Schema Registry?',
        choices: ['The full schema with every event', 'Magic byte + schema ID + payload', 'Just the payload, schema is implicit', 'A JSON envelope'],
        answer: 1,
        explanation: 'The wire format is a tiny header (magic byte + 4-byte schema ID) plus the binary payload. The schema itself is fetched once and cached by ID.',
      },
    ],
  },

  'confluent-offerings': {
    slug: 'confluent-offerings',
    subtitle: "What Confluent adds on top of open-source Kafka",
    durationMin: 7,
    level: 'Beginner',
    heroImage: '/images/lessons/confluent.png',
    objectives: [
      'Distinguish Apache Kafka, Confluent Platform, and Confluent Cloud',
      'Identify Confluent-specific components (ksqlDB, Control Center, Stream Governance)',
      'Decide when managed Kafka makes sense',
    ],
    sections: [
      {
        heading: 'Three names, one ecosystem',
        blocks: [
          { type: 'text', body: '**Apache Kafka** is the open-source project. **Confluent Platform** is Apache Kafka plus Confluent\'s extra components (Schema Registry, ksqlDB, Control Center, REST Proxy) — self-managed. **Confluent Cloud** is Confluent Platform run as a managed service.' },
        ],
      },
      {
        heading: 'What you get on top',
        blocks: [
          { type: 'text', body: '**ksqlDB** — SQL over Kafka streams. **Stream Governance** — schema management, lineage, data quality. **Connectors** — hundreds of pre-built, supported integrations. **RBAC, audit logs, monitoring** — the things enterprise teams need to run Kafka in production.' },
        ],
      },
      {
        heading: 'When to pay vs run yourself',
        blocks: [
          { type: 'callout', variant: 'info', body: 'Run open-source Kafka if you have the ops expertise and the workload is steady. Use Confluent Cloud when team time is more expensive than infrastructure dollars — which is most of the time.' },
        ],
      },
    ],
    takeaways: [
      'Confluent Platform = OSS Kafka + extras, self-run.',
      'Confluent Cloud = managed Confluent Platform.',
      'Managed Kafka trades cost for operational simplicity.',
    ],
    quiz: [
      {
        q: 'Which is included in Confluent Platform but NOT vanilla Apache Kafka?',
        choices: ['The broker', 'The producer API', 'ksqlDB and Control Center', 'Partitions'],
        answer: 2,
        explanation: 'ksqlDB and Control Center are Confluent-specific. The broker, APIs, and core concepts are open-source Apache Kafka.',
      },
      {
        q: 'Your team has 3 engineers and a Kafka workload. Best option?',
        choices: ['Build a custom Kafka fork', 'Run OSS Kafka on bare metal', 'Confluent Cloud, almost certainly', 'Skip Kafka, use a database'],
        answer: 2,
        explanation: 'Small teams gain the most from managed Kafka. The dollars saved on ops time exceed the platform premium quickly.',
      },
    ],
  },
}

export function getLessonData(slug: string): LessonContentData | null {
  return LESSON_CONTENT[slug] ?? null
}
