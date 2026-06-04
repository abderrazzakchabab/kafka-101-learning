export const LESSON_ENHANCEMENTS: Record<string, {
  deepDive: string; analogy: string; pitfall: string;
  quizQuestion: string; quizChoices: string[]; quizAnswer: number; quizExplanation: string;
}> = {
  "intro": {
    "deepDive": "Beginners often assume disk storage is too slow for real-time messaging, but Kafka heavily relies on the operating system's filesystem and pagecache for high performance [1, 2]. By formatting data for linear reads and writes and utilizing zero-copy network transfers, Kafka's sequential disk access rivals random memory access speeds [3-5].",
    "analogy": "Kafka operates as the central nervous system of a modern business, continuously routing real-time sensory data to the specific applications that need to react to it [6].",
    "pitfall": "A common mistake is assuming Kafka brokers push messages to consumers, which can easily overwhelm downstream systems [7]. Instead, Kafka uses a pull-based model, allowing consumers to fetch batches of data and catch up at their own maximum sustainable rate [7, 8].",
    "quizQuestion": "How does Kafka primarily track which messages a consumer has successfully processed?",
    "quizChoices": [
      "The broker deletes each message from the filesystem immediately after sending it.",
      "The consumer tracks its current position in each partition using a single integer offset.",
      "The producer maintains a shared acknowledgment database for all active consumers.",
      "The broker updates a BTree data structure to lock and mark individual messages as consumed."
    ],
    "quizAnswer": 1,
    "quizExplanation": "Instead of the broker maintaining complex per-message acknowledgment state, each consumer tracks a single integer offset representing its current position in a partition [9]."
  },
  "topics": {
    "deepDive": "Beginners often treat Kafka topics like traditional message queues where data is deleted upon read. In reality, topics act as multi-subscriber, persistent logs where performance remains constant regardless of data size. Furthermore, global message ordering isn't maintained at the topic level, but rather strictly within its underlying partitions.",
    "analogy": "A Kafka topic is conceptually similar to a folder in a filesystem where events are the individual files, but this folder is horizontally spread into separate buckets across different servers for massive parallel access.",
    "pitfall": "A common mistake is expecting a topic to guarantee strict global ordering for all events. To avoid out-of-order processing, you must ensure related events share the same event key so they are routed to the same partition, where strict ordering is guaranteed.",
    "quizQuestion": "What happens to an event in a Kafka topic after a consumer successfully reads it?",
    "quizChoices": [
      "It is immediately deleted from the partition to conserve disk space.",
      "It is marked as consumed and becomes invisible to all other consumer groups.",
      "It remains stored in the topic until the configured retention limit expires.",
      "It is automatically moved to a compacted archive topic for historical lookup."
    ],
    "quizAnswer": 2,
    "quizExplanation": "Unlike traditional messaging systems, Kafka does not delete events after consumption; instead, events remain available for multiple reads until the topic's configured retention period is reached."
  },
  "brokers": {
    "deepDive": "Beginners often view all brokers as equal peers for every read and write, but for any given partition, a strict leader-follower hierarchy exists [1]. All writes go exclusively to the broker designated as the partition's leader, while follower brokers passively pull and replicate the log to maintain high availability [1, 2].",
    "analogy": "A Kafka broker cluster acts like a network of bank branches where one specific branch handles all transactions for a specific account, while other branches silently copy the ledger in case the main branch goes offline [1].",
    "pitfall": "A common mistake is assuming a broker is fully functioning simply because it is accessible over the network. In reality, a broker is only considered 'in-sync' if it maintains an active session with the cluster controller and keeps its follower partitions fully caught up with the leaders [3, 4].",
    "quizQuestion": "Which of the following correctly describes the two strict conditions required for a Kafka broker to be considered 'alive' and part of the in-sync replica (ISR) set [3]?",
    "quizChoices": [
      "It must flush its pagecache to disk every 10 milliseconds and continuously acknowledge consumer requests.",
      "It must maintain an active session with the controller and not fall too far behind when replicating from the leader.",
      "It must participate in a majority vote quorum before any consumer is allowed to read from a partition.",
      "It must maintain an in-memory cache of all topics and push newly produced messages directly to active consumers."
    ],
    "quizAnswer": 1,
    "quizExplanation": "A broker is defined as 'in-sync' only if it sustains an active session with the controller and successfully replicates the leader's writes without lagging too far behind [3, 4]."
  },
  "consumers": {
    "deepDive": "Beginners often assume consumer groups distribute individual messages round-robin, but they actually distribute whole partitions. Because each partition is assigned to exactly one consumer within a group, Kafka maintains strict ordering and lightweight state tracking via a single integer offset while allowing horizontal scaling.",
    "analogy": "A consumer group is like a team of researchers dividing a multi-volume encyclopedia; each researcher takes exclusive responsibility for specific volumes so they never duplicate work, but together they read the entire set.",
    "pitfall": "A common mistake is spinning up more consumer instances in a group than there are partitions in the topic to increase throughput. Because a partition cannot be split across multiple consumers in the same standard group, the excess consumers will simply sit idle.",
    "quizQuestion": "What happens when a Kafka topic with 4 partitions is processed by a single consumer group containing 6 active consumers?",
    "quizChoices": [
      "The broker uses a time-slicing protocol to share the 4 partitions equally among all 6 consumers.",
      "4 consumers will each exclusively read from one partition, while the remaining 2 consumers sit idle.",
      "The broker automatically creates 2 additional partitions so all consumers have data to process.",
      "The 2 excess consumers are automatically reassigned to a new consumer group to read independently."
    ],
    "quizAnswer": 1,
    "quizExplanation": "To guarantee strict message ordering and lightweight offset tracking, Kafka assigns each partition to exactly one consumer per group, meaning any consumers exceeding the partition count remain idle."
  },
  "replication": {
    "deepDive": "Beginners often assume Kafka uses a majority-vote quorum for consensus, but it actually utilizes a dynamic set of In-Sync Replicas (ISR). Because a write is considered committed only after every member of the active ISR acknowledges it, Kafka can tolerate failures with significantly fewer total copies than traditional majority-vote systems require.",
    "analogy": "Kafka's replication is like a lead actor performing on stage while a designated group of understudies silently copies their every move from the wings, perfectly positioned to take over immediately if the lead falls ill.",
    "pitfall": "A common mistake is setting producer acknowledgments to 'all' without also configuring a minimum ISR size. If multiple brokers fail and only the leader remains active, 'acks=all' still succeeds, risking permanent data loss if that single remaining node subsequently crashes.",
    "quizQuestion": "By default, what does Kafka do if all replicas for a partition fail, and a replica that was NOT in the In-Sync Replicas (ISR) set is the first to come back online?",
    "quizChoices": [
      "It immediately elects the out-of-sync replica as the new leader to restore write availability.",
      "It waits for a replica that was part of the ISR to recover to prevent potential data loss.",
      "It triggers a majority vote among all cluster brokers to forcefully regenerate the lost data.",
      "It permanently marks the partition as deleted and redirects producers to a healthy topic."
    ],
    "quizAnswer": 1,
    "quizExplanation": "By default, Kafka disables unclean leader election and waits for an in-sync replica to recover, prioritizing strict data consistency over immediate availability."
  },
  "kafka-connect": {
    "deepDive": "Beginners often view Kafka Connect merely as a generic data copying tool, but it is fundamentally designed to maintain strong semantic guarantees across different systems. For example, when exporting data to systems like HDFS, Connect can store consumer offsets alongside the output data, ensuring exactly-once delivery even when messages lack primary keys for deduplication.",
    "analogy": "Kafka Connect acts as a set of universal plug adapters, seamlessly translating the unique inputs and outputs of hundreds of external databases into Kafka's standardized event stream current.",
    "pitfall": "A common mistake is wasting time writing custom integration code to connect Kafka to a standard database like PostgreSQL. You can avoid this by simply deploying one of the hundreds of ready-to-use connectors already provided by the Kafka community.",
    "quizQuestion": "According to the sources, how can a Kafka Connect connector to a system like HDFS achieve exactly-once delivery semantics without a primary key?",
    "quizChoices": [
      "It uses a two-phase commit protocol coordinated between the Kafka controller and the HDFS cluster.",
      "It populates the data in HDFS along with the Kafka offsets so that either both are updated or neither is.",
      "It automatically injects a synthetic primary key into every message before writing to HDFS.",
      "It buffers all messages in memory and only writes them to HDFS when a consumer explicitly commits."
    ],
    "quizAnswer": 1,
    "quizExplanation": "By storing the consumer's offset in the same place as its output data, Kafka Connect guarantees both are updated simultaneously, bypassing the need for complex two-phase commits."
  },
  "stream-processing": {
    "deepDive": "Beginners often view stream processing as simple stateless filtering, but Kafka Streams provides powerful stateful operations like aggregations, joins, and windowing [1]. Furthermore, it elegantly solves the problem of exactly-once processing by leveraging Kafka's transactional producer to atomically commit both the produced output and the consumer's offset [2, 3].",
    "analogy": "Kafka Streams acts like an assembly line worker who instantly calculates running totals and inspects items as they roll by on an unending conveyor belt, rather than throwing them in a bin to process in a batch at the end of the day [4].",
    "pitfall": "A common mistake is assuming exactly-once processing requires complex external coordination or a two-phase commit with a separate database [5]. You can avoid this by using Kafka Streams, which handles exactly-once semantics internally by writing the consumer's offset and the output data to Kafka in the same transaction [2].",
    "quizQuestion": "According to the sources, how does Kafka Streams achieve exactly-once processing semantics when reading from and writing to Kafka topics? [2]",
    "quizChoices": [
      "By buffering all incoming events in an external database and running a deduplication batch job.",
      "By writing the consumer's offset to Kafka in the same transaction as the output topics receiving the processed data.",
      "By forcing the Kafka broker to inject a unique primary key into every event before it reaches the consumer.",
      "By relying on the consumer's local memory to track processed offsets without ever committing them back to the cluster."
    ],
    "quizAnswer": 1,
    "quizExplanation": "Exactly-once processing is achieved by utilizing Kafka's transactional capabilities to atomically write both the consumer's read offset and the newly produced output data in a single transaction [2]."
  },
  "confluent-offerings": {
    "deepDive": "Beginners often confuse raw Apache Kafka with a complete enterprise data streaming platform. While open-source Kafka provides the foundational event storage and routing, cloud-native services like Confluent Cloud layer on essential components for governance, real-time computation, and seamless integration with non-Kafka systems.",
    "analogy": "If Apache Kafka is the raw, powerful engine of a vehicle, Confluent's cloud-native offerings act as the fully assembled car, providing the necessary navigation, controls, and dashboard required to safely drive it at scale.",
    "pitfall": "A common mistake is underestimating the engineering effort required to build and maintain an ecosystem around open-source Kafka. Instead of manually stitching together disparate tools for governance and integration, teams should evaluate managed data streaming platforms to focus their time on application development.",
    "quizQuestion": "According to the sources, how do cloud-native services like Confluent Cloud build upon the foundation of Apache Kafka?",
    "quizChoices": [
      "They replace Kafka's pull-based consumer model with a strict push-based routing tier.",
      "They provide an emerging data streaming platform that adds real-time computation, governance, and system integration.",
      "They convert all real-time event streams back into delayed batches for traditional database processing.",
      "They enforce strict on-premises deployments to ensure maximum data privacy and hardware utilization."
    ],
    "quizAnswer": 1,
    "quizExplanation": "The sources describe how an entire data streaming platform is emerging on top of Kafka's foundation to enable real-time computation, governance, and seamless integration with non-Kafka systems."
  },
  "partitions": {
    "deepDive": "Beginners often miss that partitions are the fundamental unit of parallelism, replication, and strict ordering [1, 2]. Because each partition is consumed by exactly one consumer within a subscribing group, your maximum parallel consumption is hard-capped by your topic's partition count [2, 3].",
    "analogy": "Think of a Kafka topic as a busy multi-lane highway, where each lane is a partition [2]. While thousands of cars use the highway simultaneously, vehicles within a specific lane must stay in a strict, unvarying sequence [2, 3].",
    "pitfall": "A common beginner mistake is producing related events without an event key, which scatters them across random partitions and breaks sequential ordering [2]. To ensure strict chronological processing, always assign a consistent event key so related events reliably route to the same partition [2].",
    "quizQuestion": "Why does Kafka distribute a topic's data across multiple partitions?",
    "quizChoices": [
      "To automatically compress data before it is written to the broker's disk.",
      "To allow parallel read/write access across multiple brokers while maintaining strict ordering for events with the same key.",
      "To allow multiple consumers within the same group to concurrently read from the exact same bucket of data.",
      "To isolate different event schemas into separate physical directories on the filesystem."
    ],
    "quizAnswer": 1,
    "quizExplanation": "Partitions allow topics to scale horizontally across many brokers for parallel access, while guaranteeing that events sharing an event key are strictly ordered within their specific partition [2]."
  },
  "producers": {
    "deepDive": "Beginners often assume producers rely on a central routing tier, but they actually query cluster metadata to send data directly to the specific broker leading the target partition. Additionally, they maximize efficiency by accumulating messages in memory and sending them as asynchronous batches, trading a small amount of latency for significantly fewer I/O operations.",
    "analogy": "A Kafka producer is like a savvy delivery driver who bypasses a central sorting facility, using a live directory to drive directly to the correct local warehouse while bundling packages to save trips.",
    "pitfall": "A common mistake is ignoring the 'acks' configuration, which determines how many brokers must acknowledge a message. To prevent silent data loss during a broker failure, configure 'acks=all' so the producer ensures all in-sync replicas have safely stored the data.",
    "quizQuestion": "How does a Kafka producer route its messages to the correct destination within the cluster?",
    "quizChoices": [
      "It sends all data to a centralized load balancer that distributes the traffic.",
      "It writes to a local store-and-forward log that brokers periodically pull from.",
      "It queries cluster metadata and sends data directly to the broker leading the target partition.",
      "It broadcasts the message to all brokers simultaneously to guarantee delivery."
    ],
    "quizAnswer": 2,
    "quizExplanation": "Kafka producers eliminate the need for an intervening routing tier by fetching metadata to identify the partition's leader and transmitting data directly to that specific broker."
  },
  "schema-registry": {
    "deepDive": "The provided sources only briefly mention that Kafka helps manage event schemas, noting it represents a 'thing' way of thinking [1]. Beyond the text, a key technical insight you should independently verify is that Confluent Schema Registry serves as a centralized governance layer, storing versioned schemas and enforcing strict compatibility checks to prevent producers from publishing malformed data that breaks downstream consumers.",
    "analogy": "Schema Registry acts as a strict contract negotiator between two applications, ensuring that any updates to their ongoing agreement never violate the fundamental terms that either party already relies on.",
    "pitfall": "A common pitfall (based on outside knowledge) is making breaking schema changes, such as deleting a required field, which crashes active consumers. Avoid this by configuring the registry to enforce strict backward compatibility before deploying changes.",
    "quizQuestion": "According to the provided sources, how does Kafka's ability to manage event schemas relate to the conceptual modeling of data?",
    "quizChoices": [
      "It forces developers to completely abandon tabular data structures.",
      "It represents a 'thing' way of thinking, bridging the tension between objects and events.",
      "It requires events to be processed in delayed batches rather than real-time.",
      "It is used exclusively to translate events into relational database schemas."
    ],
    "quizAnswer": 1,
    "quizExplanation": "The sources state that the tension between 'thing' and 'event' is not absolute, and that managing the schema of events stored in Kafka is 'very much a thing way of thinking' [1]."
  }
}
