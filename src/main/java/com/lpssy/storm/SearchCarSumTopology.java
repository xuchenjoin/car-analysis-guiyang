package com.lpssy.storm;

import org.apache.storm.Config;
import org.apache.storm.StormSubmitter;
import org.apache.storm.kafka.bolt.KafkaBolt;
import org.apache.storm.kafka.bolt.mapper.FieldNameBasedTupleToKafkaMapper;
import org.apache.storm.kafka.bolt.selector.DefaultTopicSelector;
import org.apache.storm.kafka.spout.KafkaSpout;
import org.apache.storm.topology.TopologyBuilder;
import org.apache.storm.topology.base.BaseWindowedBolt.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

/**
 * 【Topology 主入口·卡口流量统计】把"实时卡口过车流量统计"流水线装配并提交到 Storm 集群。
 * 数据流：KafkaSpout(spout) ─流test_stream_sum─▶ SearchCarSumPerMinuteBolt(bolt)
 *        ─▶ KafkaBolt(result) ─▶ Kafka输出主题。本类只负责接线、配置与提交。
 */
public class SearchCarSumTopology {

  private static final Logger LOG = LoggerFactory.getLogger(SearchCarSumTopology.class);
  private static final String DEFAULT_STREAM_NAME = "test_stream_sum";// Spout 输出流名
  private static final String DEFAULT_GROUP_ID = "search-car-sum-group";// Kafka 消费组ID

  /*
   * 参数列表：
   * 0. topology_name(拓扑名称);
   * 1. stream_name(输入流名称);   ← Kafka 输入主题（卡口过车数据）
   * 2. stream_name(输出流名称);   ← Kafka 输出主题（统计结果）
   * 3. brokerlist
   * 4. 窗口大小;
   * 5. 更新频率
   */
  public static void main(String[] args) throws Exception {

    //设置拓扑配置
    Config conf = new Config();
    conf.setMessageTimeoutSecs(3600);// Tuple 处理超时放大：窗口聚合可能耗时较长

    //定义拓扑
    TopologyBuilder builder = new TopologyBuilder();
    if (args.length >= 6) {
      String topologyName = args[0];
      String inputTopic = args[1];
      String outputTopic = args[2];
      String brokerList = args[3];
      int windowLength = Integer.valueOf(args[4]);// 窗口长度（秒）
      int slidingInteger = Integer.valueOf(args[5]);// 滑动/输出频率（秒）

      String consumerConfig = "";
      if (args.length == 7) {
        consumerConfig = args[6];
      }
      String producerConfig = "";
      if (args.length == 8) {
        producerConfig = args[7];
      }
      // 定义KafkaSpout：从 Kafka 输入主题消费过车记录（carNo/time/bayonet/经度/纬度）
      KafkaSpout kafkaSpout = new KafkaSpout<String, String>(
              KafkaUtils.getKafkaSpoutConfig(
                      KafkaUtils.getKafkaSpoutStreams(inputTopic, DEFAULT_STREAM_NAME),
                      inputTopic,
                      brokerList,
                      DEFAULT_GROUP_ID,
                      consumerConfig));

      // KafkaBolt配置信息：拓扑末端，把 Bolt 结果写回 Kafka 输出主题
      KafkaBolt<String, String> kafkaBolt = new KafkaBolt<String, String>();
      kafkaBolt.withTopicSelector(new DefaultTopicSelector(outputTopic))
              .withTupleToKafkaMapper(
                      new FieldNameBasedTupleToKafkaMapper(null, "message"));// 结果体取 Tuple 的 message 字段
      kafkaBolt.withProducerProperties(KafkaUtils.getKafkaProducerProps(brokerList, producerConfig));

      builder.setSpout("spout", kafkaSpout, 1);// ① 数据源 Spout，并发1
      builder.setBolt(
              "bolt",
              new SearchCarSumPerMinuteBolt(slidingInteger).withWindow(new Duration(windowLength,
                      TimeUnit.SECONDS), new Duration(slidingInteger,
                      TimeUnit.SECONDS)), 1).shuffleGrouping("spout", DEFAULT_STREAM_NAME);// ② 窗口聚合，随机均衡接收 spout
      builder.setBolt("result", kafkaBolt, 10).shuffleGrouping("bolt");// ③ 末端写回 Kafka，并发10

      //命令行提交拓扑
      StormSubmitter.submitTopology(topologyName, conf,
              builder.createTopology());
    } else {
      System.out.println("Invalid args number.");
    }
  }
}
