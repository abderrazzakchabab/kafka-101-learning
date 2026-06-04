export interface LessonMeta {
  slug: string
  title: string
  order: number
  file: string | null
}

export const LESSON_META: LessonMeta[] = [
  { slug: 'intro', title: 'Introduction to Kafka', order: 1, file: 'Apache_Kafka_101_is_back_2025_Edition_ft_Tim_Berglund_.md' },
  { slug: 'topics', title: 'Topics', order: 2, file: 'Topics_Apache_Kafka_101_2025_Edition_.md' },
  { slug: 'partitions', title: 'Partitions', order: 3, file: 'Partitions_Apache_Kafka_101_2025_Edition_.md' },
  { slug: 'brokers', title: 'Brokers', order: 4, file: 'Brokers_Apache_Kafka_101_2025_Edition_.md' },
  { slug: 'producers', title: 'Producers', order: 5, file: 'Producers_Apache_Kafka_101_2025_Edition_.md' },
  { slug: 'consumers', title: 'Consumers', order: 6, file: 'Consumers_Apache_Kafka_101_2025_Edition_.md' },
  { slug: 'replication', title: 'Replication', order: 7, file: 'Replication_Apache_Kafka_101_2025_Edition_.md' },
  { slug: 'kafka-connect', title: 'Kafka Connect', order: 8, file: 'Kafka_Connect_Apache_Kafka_101_2025_Edition_.md' },
  { slug: 'schema-registry', title: 'Schema Registry', order: 9, file: 'Confluent_Schema_Registry_Apache_Kafka_101_2025_Edition_.md' },
  { slug: 'stream-processing', title: 'Stream Processing', order: 10, file: 'Stream_Processing_Apache_Kafka_101_2025_Edition_.md' },
  { slug: 'confluent-offerings', title: "Confluent's Offerings", order: 11, file: 'Confluent_s_Offerings_Apache_Kafka_101_2025_Edition_.md' },
  { slug: 'install', title: 'Installing Kafka', order: 12, file: null },
]
