package com.lpssy.javaspark.streaming;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.spark.SparkConf;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.streaming.kafka010.ConsumerStrategies;
import org.apache.spark.streaming.kafka010.KafkaUtils;
import org.apache.spark.streaming.kafka010.LocationStrategies;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import java.util.*;
/**
 * StreamingKafkaDataToRedis：Spark Streaming 实时消费 Kafka 并写入 Redis 的端到端示例。
 * 演示知识点：1) JavaStreamingContext 指定批次间隔（这里 5 秒一个微批）；
 * 2) KafkaUtils.createDirectStream 直连方式订阅 Kafka topic；
 * 3) foreachRDD 对每个微批的 RDD 处理；foreachPartition 在每个分区内复用一个 Jedis 连接池，
 *    避免每条数据新建连接的性能大坑；4) 把消息按空格切出 key/value 写入 Redis 的 hash。
 * 数据来源：Kafka 集群 topicA（bootstrap: c7node1/2/3:9092，消费组 group1108）。
 * 结果去向：Redis 主机 c7node4:6379 的 5 号库、hash 键 "hello"，同时打印到日志。
 */
public class StreamingKafkaDataToRedis {
    public static void main(String[] args) throws InterruptedException {
        SparkConf conf = new SparkConf();
        conf.setMaster("local").setAppName("StreamingToRedis");
        JavaStreamingContext jsc = new JavaStreamingContext(conf, Durations.seconds(5));/* StreamingContext 比 SparkContext 多一个批次时长：每 5 秒切一个微批 */
        Collection<String> topics = Arrays.asList("topicA");/* 要订阅的 Kafka topic 列表 */

        Map<String, Object> kafkaParams = new HashMap<>();/* Kafka 消费者配置 */
        kafkaParams.put("bootstrap.servers", "c7node1:9092,c7node2:9092,c7node3:9092");
        kafkaParams.put("key.deserializer", StringDeserializer.class);/* key 反序列化为字符串 */
        kafkaParams.put("value.deserializer", StringDeserializer.class);/* value 反序列化为字符串 */
        kafkaParams.put("group.id", "group1108");/* 消费组 id，Kafka 端据此做位点协调 */
        kafkaParams.put("auto.offset.reset", "latest");/* 无历史位点时从最新消息开始消费 */
        kafkaParams.put("enable.auto.commit", false);/* 关闭自动提交位点，便于手动/可控管理 */
        JavaInputDStream<ConsumerRecord<String, String>> dstream = KafkaUtils.createDirectStream(jsc,/* 直连方式创建 DStream，每条消息是 ConsumerRecord */
                LocationStrategies.PreferConsistent(),/* 分区与 Executor 的位置分配策略 */
                ConsumerStrategies.<String, String>Subscribe(topics, kafkaParams)
        );


        dstream.foreachRDD(/* 每个微批（5 秒）触发一次，拿到本批数据对应的 RDD */
                recordRDD -> recordRDD.foreachPartition(/* foreachPartition：每个分区共享一个 Jedis 连接池（性能关键） */
                    iterRecords -> {
                        String redisHost = "c7node4";
                        int redisPort = 6379;
                        int redisTimeout = 30000;
                        JedisPool jedisPool = new JedisPool(new GenericObjectPoolConfig(), redisHost, redisPort, redisTimeout);/* 本分区建一个连接池，而不是每条记录建连接 */
                        Jedis jedis = jedisPool.getResource();
                        jedis.select(5);/* 切到 Redis 的 5 号数据库 */
                        while(iterRecords.hasNext()){
                            ConsumerRecord<String, String> record = iterRecords.next();
                            String value = record.value();/* 取消息体 */
                            System.out.println("有新的数据"+value);
                            String  redisKey = value.split(" ")[0];/* 约定消息格式为 “key value”，切出 hash 字段名 */
                            String  redisValue = value.split(" ")[1];/* 切出字段值 */
                            jedis.hset("hello", redisKey,redisValue);/* 写入 Redis：往 hash "hello" 塞一个 field=redisKey */
                            System.out.println("插入Redis 成功");
                        }
                        jedisPool.returnResource(jedis);/* 归还连接，复用给本分区后续数据 */
                    }
                ));
        jsc.start();/* 启动流处理：开始接收 Kafka 数据并按 5 秒微批处理 */
        jsc.awaitTermination();/* 阻塞等待，让程序一直跑下去，直到外部手动停止 */
        jsc.start();
    }
}
