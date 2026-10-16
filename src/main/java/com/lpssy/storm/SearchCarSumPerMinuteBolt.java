package com.lpssy.storm;

import org.apache.storm.task.OutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseWindowedBolt;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;
import org.apache.storm.windowing.TupleWindow;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.Map.Entry;

/**
 * 卡口过车流量"窗口计数"Bolt（SearchCarSumTopology 的中间聚合节点）。
 * 上游：KafkaSpout（流 test_stream_sum），Tuple 含 carNo/time/bayonet/经度/纬度；
 * 下游：结果以 Fields("key","message") 发给 KafkaBolt 写回 Kafka 输出主题。
 * 逻辑：每隔 rate 秒统计窗口内每个卡口过车数，按数量降序拼成文本输出。
 */
public class SearchCarSumPerMinuteBolt extends BaseWindowedBolt {
  private static final long serialVersionUID = 668785327917400661L;
  private static final Logger LOGGER = LoggerFactory.getLogger(SearchCarSumPerMinuteBolt.class);
  private OutputCollector collector;

/** 卡口号 -> 过车累计次数（一个统计周期内累加） */
  private Map<String, Integer> map;
  private long lastTimeMillis = 0L;// 上一次真正输出结果的时间戳
  private long rate = 0l;// 输出频率（秒），构造时由 Topology 传入

/** 构造时传入统计输出频率（秒） */
  public SearchCarSumPerMinuteBolt(long rate) {
    this.rate = rate;
  }

  @Override
  public void prepare(Map stormConf, TopologyContext context,
                      OutputCollector collector) {
    this.collector = collector;// 保存发射器，后面 emit 结果用
    map = new HashMap<String, Integer>();
  }

/** 窗口触发一次就执行一次；内部按 rate 秒节流，不是每次窗口都输出 */
  @Override
  public void execute(TupleWindow inputWindow) {
    long currentTimeMillis = System.currentTimeMillis();
    if (lastTimeMillis == 0) {
      lastTimeMillis = currentTimeMillis;// 首次只记时间，不输出
      return;
    }

/** 距上次输出超过一个统计周期，才执行一次完整统计 */
    if (currentTimeMillis - lastTimeMillis > (rate * 1000)) {
      lastTimeMillis = currentTimeMillis;
      List<Tuple> tuplesInWindow = inputWindow.get();// 当前窗口内全部过车记录

      String bayonet = null;
      Integer count = 0;
      for (Tuple tupleInWindow : tuplesInWindow) {// 按卡口号累计计数
        bayonet = (String) tupleInWindow.getStringByField("bayonet");
        count = map.get(bayonet);
        if (count == null) {
          count = 0;
        }
        count++;
        map.put(bayonet, count);
      }
      List<Entry<String, Integer>> list = new ArrayList<Entry<String, Integer>>(
              map.entrySet());
      Collections.sort(list, new Comparator<Map.Entry<String, Integer>>() {// 按过车量降序
        public int compare(Map.Entry<String, Integer> o1,
                           Map.Entry<String, Integer> o2) {
          return (o2.getValue() - o1.getValue());
        }
      });
      StringBuilder builder = new StringBuilder("");
      for (Entry<String, Integer> entry : list) {// 拼成"卡口,数量"每行一条
        if (builder.toString() == "" || builder.toString().isEmpty()) {
          builder = builder.append(entry.getKey() + "," + entry.getValue());
        } else {
          builder.append("\n").append(entry.getKey() + "," + entry.getValue());
        }
      }
      LOGGER.info("**************************SearchCarSumPerMinuteBolt emit:**********" + builder.toString() + "***************************");
      collector.emit(new Values("key", builder.toString()));// message 字段即统计文本，被下游 KafkaBolt 取走
      LOGGER.info("**************************SearchCarSumPerMinuteBolt emit success*************************************");
      map.clear();// 清空计数，进入下一周期
    }
  }

/** 声明输出字段：key(分组用)、message(统计结果文本) */
  @Override
  public void declareOutputFields(OutputFieldsDeclarer declarer) {
    declarer.declare(new Fields("key", "message"));
  }
}