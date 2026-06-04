export interface Exercise {
  id: string
  title: string
  description: string
  command: string
  expectedOutput: string
  hint: string
}

export const EXERCISES: Record<string, Exercise[]> = {
  topics: [
    {
      id: 'topics-1',
      title: 'Create your first topic',
      description: 'Create a Kafka topic called `thermostat-readings` with 1 partition.',
      command: 'kafka-topics --create --topic thermostat-readings --partitions 1 --replication-factor 1',
      expectedOutput: 'Created topic thermostat-readings.',
      hint: 'The bootstrap server alias is already configured. Just run the command as-is.',
    },
    {
      id: 'topics-2',
      title: 'List all topics',
      description: 'List all topics in your Kafka cluster.',
      command: 'kafka-topics --list',
      expectedOutput: 'thermostat-readings',
      hint: 'Use the kafka-topics alias with --list.',
    },
    {
      id: 'topics-3',
      title: 'Describe a topic',
      description: 'Get detailed info about the `thermostat-readings` topic.',
      command: 'kafka-topics --describe --topic thermostat-readings',
      expectedOutput: 'Topic: thermostat-readings\tTopicId:',
      hint: 'Use --describe with --topic to inspect a specific topic.',
    },
  ],
  partitions: [
    {
      id: 'partitions-1',
      title: 'Create a partitioned topic',
      description: 'Create a topic called `sensor-events` with 3 partitions.',
      command: 'kafka-topics --create --topic sensor-events --partitions 3 --replication-factor 1',
      expectedOutput: 'Created topic sensor-events.',
      hint: 'Set --partitions 3 to distribute data across 3 partitions.',
    },
    {
      id: 'partitions-2',
      title: 'Inspect partition distribution',
      description: 'Describe `sensor-events` and identify each partition\'s leader.',
      command: 'kafka-topics --describe --topic sensor-events',
      expectedOutput: 'PartitionCount: 3',
      hint: 'Look for PartitionCount and the individual Partition rows.',
    },
  ],
  producers: [
    {
      id: 'producers-1',
      title: 'Send your first message',
      description: 'Start a console producer for `thermostat-readings` and send a JSON message.',
      command: 'kafka-producer --topic thermostat-readings',
      expectedOutput: '(type a message and press Enter, e.g. {"sensor_id":42,"temp":22})',
      hint: 'After the prompt appears, type your message and press Enter. Use Ctrl+C to exit.',
    },
    {
      id: 'producers-2',
      title: 'Send messages with keys',
      description: 'Produce messages with a key separator (sensor ID as key).',
      command: 'kafka-producer --topic thermostat-readings --property "parse.key=true" --property "key.separator=:"',
      expectedOutput: '(type: 42:{"temp":22} and press Enter)',
      hint: 'Keys route messages to consistent partitions. Format: key:value',
    },
  ],
  consumers: [
    {
      id: 'consumers-1',
      title: 'Read messages from the beginning',
      description: 'Consume all messages from `thermostat-readings` starting at offset 0.',
      command: 'kafka-consumer --topic thermostat-readings --from-beginning',
      expectedOutput: '(your previously sent messages appear here)',
      hint: '--from-beginning tells Kafka to start from offset 0. Use Ctrl+C to stop.',
    },
    {
      id: 'consumers-2',
      title: 'Consumer group',
      description: 'Consume from `sensor-events` as part of a named consumer group.',
      command: 'kafka-consumer --topic sensor-events --from-beginning --group my-app',
      expectedOutput: '(messages or empty if no messages yet)',
      hint: 'Consumer groups track which offsets have been read. Multiple instances share the load.',
    },
  ],
  replication: [
    {
      id: 'replication-1',
      title: 'Inspect replication',
      description: 'Describe `sensor-events` and identify the ISR (in-sync replicas).',
      command: 'kafka-topics --describe --topic sensor-events',
      expectedOutput: 'ReplicationFactor: 1\tIsr: 1',
      hint: 'ISR shows which replicas are in sync. With 1 broker, ISR will always be [1].',
    },
  ],
  'kafka-connect': [
    {
      id: 'kafka-connect-1',
      title: 'List connector plugins',
      description: 'Check what connector plugins are available in this Kafka installation.',
      command: 'ls $KAFKA_HOME/libs/ | grep connect',
      expectedOutput: 'connect-',
      hint: 'Kafka ships with built-in connectors in the libs directory.',
    },
  ],
  brokers: [
    {
      id: 'brokers-1',
      title: 'Get cluster metadata',
      description: 'Use the broker API to inspect your single-broker cluster.',
      command: 'kafka-broker-api-versions.sh --bootstrap-server $KAFKA_BOOTSTRAP_SERVERS',
      expectedOutput: 'kafka (id: 1, host:',
      hint: 'This tool lists API versions supported by the broker — useful for compatibility checks.',
    },
  ],
}
