export const INSTALL_CONTENT = `# How to Install Apache Kafka

Apache Kafka can be installed several ways. This guide covers the three most common approaches.

---

## Option 1: Docker (Recommended for Learning)

This webapp already runs Kafka for you! But if you want a standalone setup:

\`\`\`bash
# Pull the official Kafka image
docker pull apache/kafka:3.7.0

# Run a single-broker KRaft cluster
docker run -d \\
  --name kafka \\
  -p 9092:9092 \\
  -e KAFKA_NODE_ID=1 \\
  -e KAFKA_PROCESS_ROLES=broker,controller \\
  -e KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \\
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \\
  -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 \\
  -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \\
  -e KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER \\
  -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT \\
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \\
  apache/kafka:3.7.0
\`\`\`

Verify it's running:
\`\`\`bash
docker exec kafka kafka-topics.sh --list --bootstrap-server localhost:9092
\`\`\`

---

## Option 2: Local Installation (Linux / macOS)

### Prerequisites
- Java 17+ (\`java -version\` to check)
- \`wget\` or \`curl\`

### Steps

\`\`\`bash
# 1. Download Kafka 3.7.0
wget https://downloads.apache.org/kafka/3.7.0/kafka_2.13-3.7.0.tgz

# 2. Extract
tar -xzf kafka_2.13-3.7.0.tgz
cd kafka_2.13-3.7.0

# 3. Generate a cluster UUID (KRaft mode — no ZooKeeper!)
KAFKA_CLUSTER_ID=\\$(bin/kafka-storage.sh random-uuid)

# 4. Format storage
bin/kafka-storage.sh format -t \\$KAFKA_CLUSTER_ID -c config/kraft/reconfig-server.properties

# 5. Start the broker
bin/kafka-server-start.sh config/kraft/reconfig-server.properties
\`\`\`

### Verify
Open a new terminal:
\`\`\`bash
cd kafka_2.13-3.7.0
bin/kafka-topics.sh --list --bootstrap-server localhost:9092
\`\`\`

---

## Option 3: Confluent Platform (Full Feature Set)

Confluent Platform includes Schema Registry, Kafka Connect, ksqlDB, and a web UI.

\`\`\`bash
# Using Docker Compose
curl -L https://cnfl.io/docker-compose-quickstart -o docker-compose.yml
docker-compose up -d
\`\`\`

Access the Confluent Control Center at **http://localhost:9021**

---

## Environment Variables (Useful Shortcuts)

Once Kafka is running, set these in your shell:

\`\`\`bash
export BOOTSTRAP=localhost:9092

# Shortcuts
alias kt="kafka-topics.sh --bootstrap-server \\$BOOTSTRAP"
alias kp="kafka-console-producer.sh --bootstrap-server \\$BOOTSTRAP"
alias kc="kafka-console-consumer.sh --bootstrap-server \\$BOOTSTRAP"
\`\`\`

Then:
\`\`\`bash
kt --list                          # list topics
kt --create --topic test --partitions 3 --replication-factor 1
kp --topic test                    # produce messages
kc --topic test --from-beginning   # consume messages
\`\`\`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 9092 already in use | \`lsof -i :9092\` and kill the conflicting process |
| Java not found | Install OpenJDK 17: \`sudo apt install openjdk-17-jdk\` |
| Connection refused | Wait 10-15s for broker to fully start |
| KRaft storage not formatted | Run the \`kafka-storage.sh format\` step again |
`
