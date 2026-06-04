FROM apache/kafka:3.7.0

USER root

# Install ttyd for browser-based terminal
RUN microdnf install -y wget tar && \
    wget -q -O /usr/local/bin/ttyd \
      https://github.com/tsl0922/ttyd/releases/download/1.7.7/ttyd.x86_64 && \
    chmod +x /usr/local/bin/ttyd && \
    microdnf clean all

# Helpful shell aliases and bootstrap server config
RUN echo 'export PATH=/opt/kafka/bin:$PATH' >> /root/.bashrc && \
    echo 'alias kafka-topics="kafka-topics.sh --bootstrap-server $KAFKA_BOOTSTRAP_SERVERS"' >> /root/.bashrc && \
    echo 'alias kafka-producer="kafka-console-producer.sh --bootstrap-server $KAFKA_BOOTSTRAP_SERVERS"' >> /root/.bashrc && \
    echo 'alias kafka-consumer="kafka-console-consumer.sh --bootstrap-server $KAFKA_BOOTSTRAP_SERVERS"' >> /root/.bashrc && \
    echo 'echo ""' >> /root/.bashrc && \
    echo 'echo "  ⚡ Kafka 101 Shell"' >> /root/.bashrc && \
    echo 'echo "  Bootstrap: $KAFKA_BOOTSTRAP_SERVERS"' >> /root/.bashrc && \
    echo 'echo "  Aliases: kafka-topics | kafka-producer | kafka-consumer"' >> /root/.bashrc && \
    echo 'echo ""' >> /root/.bashrc

EXPOSE 7681

CMD ["/bin/sh", "-c", "ttyd -p 7681 -W bash"]
