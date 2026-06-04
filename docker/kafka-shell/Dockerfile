FROM apache/kafka:3.7.0

USER root

# Install ttyd + bash (image is Alpine-based).
# Use HTTP repos because the image's CA bundle is stale.
RUN printf 'http://dl-cdn.alpinelinux.org/alpine/v3.19/main\nhttp://dl-cdn.alpinelinux.org/alpine/v3.19/community\n' > /etc/apk/repositories && \
    apk add --no-cache bash ttyd ca-certificates && \
    update-ca-certificates 2>/dev/null || true

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
