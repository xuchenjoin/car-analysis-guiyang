package com.lpssy.storm;

import org.apache.storm.Config;
import org.apache.storm.StormSubmitter;
import org.apache.storm.kafka.bolt.KafkaBolt;
import org.apache.storm.kafka.bolt.mapper.FieldNameBasedTupleToKafkaMapper;
import org.apache.storm.kafka.bolt.selector.DefaultTopicSelector;
import org.apache.storm.kafka.spout.KafkaSpout;
import org.apache.storm.topology.TopologyBuilder;
import org.apache.storm.topology.base.BaseWindowedBolt.Duration;
import org.apache.storm.tuple.Fields;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

/**
 * 【Topology 主入口·套牌车实时识别】把"套牌车检测"流水线装配并提交到 Storm 集群。
 * 数据流：KafkaSpout(kafka-spout) ─流test_stream─▶ SearchXCarBolt(bolt, fieldsGrouping by carNo)
 *        ─carNo/gate1/gate2/time1/time2─▶ SearchXCarAggrBolt(aggr-bolt) ─key/message─▶ KafkaBolt(result) ─▶ Kafka输出主题。
 * 关键设计：bolt 按 carNo 分组，保证同一车牌的过车记录进同一实例，才能在窗口内凑齐比对。
 */
public class SearchXCarTopology {

  private static final Logger LOG = LoggerFactory.getLogger(SearchXCarTopology.class);
  private static final String DEFAULT_STREAM_NAME = "test_stream";// Spout 输出流名
  private static final String DEFAULT_GROUP_ID = "kafkaSpoutTestGroup";// Kafka 消费组ID

  /*
   *  params：
   *  0 topology_name 拓扑名称 ;
   *  1 stream_name(输入流名称);   ← Kafka 输入主题（卡口过车数据）
   *  2 stream_name(输出流名称);   ← Kafka 输出主题（套牌车结果）
   *  3 broker list;
   *  4 更新频率（单位：秒）; window length
   *  5  sliding integer
   *  6 套牌车规则中的时间（单位：分钟）;
   *  7 套牌车规则中的距离（单位：公里）
   */
  public static void main(String[] args) throws Exception {

    Config conf = new Config();
    conf.setMessageTimeoutSecs(3600);// 窗口比对计算较重，超时放大到1小时

    // 定义拓扑
    TopologyBuilder builder = new TopologyBuilder();
    if (args.length >= 8) {
      String topologyName = args[0];
      String inputTopic = args[1];// Kafka 输入主题
      String outputTopic = args[2];// Kafka 输出主题
      String kafkaBrokerList = args[3];
      int windowLength = Integer.valueOf(args[4]);// 窗口长度（秒）
      int slidingInteger = Integer.valueOf(args[5]);// 滑动间隔（秒）

      long time = Long.valueOf(args[6]);// 套牌车时间阈值（分钟）
      double distance = Double.valueOf(args[7]);// 套牌车距离阈值（公里）

      String consumerConfig = "";
      if (args.length == 9) {
        consumerConfig = args[8];
      }
      String producerConfig = "";
      if (args.length == 10) {
        producerConfig = args[9];
      }

      // ① KafkaSpout：从 Kafka 消费卡口过车记录
      KafkaSpout kafkaSpout = new KafkaSpout<String, String>(
              KafkaUtils.getKafkaSpoutConfig(
                      KafkaUtils.getKafkaSpoutStreams(inputTopic, DEFAULT_STREAM_NAME),
                      inputTopic, kafkaBrokerList,
                      DEFAULT_GROUP_ID,
                      consumerConfig
              ));
      // ④ KafkaBolt：末端，把汇总结果写回 Kafka 输出主题
      KafkaBolt<String, String> kafkaBolt = new KafkaBolt<String, String>();
      kafkaBolt.withTopicSelector(new DefaultTopicSelector(outputTopic))
              .withTupleToKafkaMapper(
                      new FieldNameBasedTupleToKafkaMapper(null, "message"));// 结果体取 message 字段
      kafkaBolt.withProducerProperties(KafkaUtils.getKafkaProducerProps(kafkaBrokerList, producerConfig));

      builder.setSpout("kafka-spout", kafkaSpout);// 数据源 Spout
      builder.setBolt("bolt",
              new SearchXCarBolt(time, distance).withWindow(
                      new Duration(windowLength, TimeUnit.SECONDS),
                      new Duration(slidingInteger, TimeUnit.SECONDS)),
              10).fieldsGrouping("kafka-spout", DEFAULT_STREAM_NAME, new Fields("carNo"));// ② 套牌车检测，按carNo分组

      builder.setBolt("aggr-bolt", new SearchXCarAggrBolt(), 1).shuffleGrouping("bolt");// ③ 汇总最近10条+累计数

      builder.setBolt("result", kafkaBolt, 1).shuffleGrouping("aggr-bolt");// 末端写回 Kafka

      StormSubmitter.submitTopology(topologyName, conf, builder.createTopology());
    } else {
      System.out.println("Invalid args number: " + args.length);
    }
  }
}