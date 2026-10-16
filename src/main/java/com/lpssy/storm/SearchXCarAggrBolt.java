package com.lpssy.storm;

import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.BasicOutputCollector;
import org.apache.storm.topology.IBasicBolt;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;

import java.util.Calendar;
import java.util.LinkedList;
import java.util.Map;

/**
 * 【普通Bolt·套牌车结果汇总】SearchXCarTopology 的末端汇总节点。
 * 上游：SearchXCarBolt（shuffleGrouping），Tuple 含 carNo/gate1/gate2/time1/time2（一辆命中的套牌车）。
 * 下游：以 Fields("key","message") 发给 KafkaBolt 写回 Kafka 输出主题。
 * 逻辑：维护最多10条最近套牌车记录的滑动队列，来一条就拼成多行文本+当日累计命中数，整体发射。
 */
public class SearchXCarAggrBolt implements IBasicBolt {
  private static final long serialVersionUID = -2741339868952866216L;
  private int day = -1;// 当前统计到哪一天，跨天重置计数
  private int count = 0;// 当日累计命中套牌车次数
  private LinkedList<String> fakeCars = new LinkedList<String>();// 最近最多10条套牌车明细

/** 输出两个字段：key(分组占位)、message(拼好的汇总文本，被 KafkaBolt 取走) */
  @Override
  public void declareOutputFields(OutputFieldsDeclarer declarer) {
    declarer.declare(new Fields("key", "message"));
  }

  @Override
  public Map<String, Object> getComponentConfiguration() {
    return null;
  }

  @Override
  public void cleanup() {
  }

/** 每收到一条套牌车命中记录就执行一次：更新当日计数、维护最近10条队列、拼装并发射汇总消息 */
  @Override
  public void execute(Tuple tuple, BasicOutputCollector collector) {

    String carNo = tuple.getStringByField("carNo");// 从上游取这辆套牌车完整信息
    String gate1 = tuple.getStringByField("gate1");
    String gate2 = tuple.getStringByField("gate2");
    String time1 = tuple.getStringByField("time1");
    String time2 = tuple.getStringByField("time2");

    int dayOfMonth = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
    if (day != -1 && day != dayOfMonth) {// 跨到新的一天就把计数清零重新开始
      count = 0;
    } else {
      count++;
    }
    day = dayOfMonth;

    StringBuilder sb = new StringBuilder(carNo);// 拼一条明细：车牌,卡口1,时间1,卡口2,时间2
    sb.append(",")
            .append(gate1)
            .append(",")
            .append(time1)
            .append(",")
            .append(gate2)
            .append(",")
            .append(time2);

    if (fakeCars.size() > 10) {// 队列只留最近10条：超过就挤掉最老的一条
      fakeCars.removeFirst();
    }
    fakeCars.addLast(sb.toString());

    StringBuilder emitResult = new StringBuilder();// 每条明细占一行，最后一行追加当日累计命中数
    for (String item : fakeCars) {
      emitResult.append(item).append("\n");
    }
    emitResult.append(count);

    collector.emit(new Values("key", emitResult.toString()));// message 字段即整段汇总文本
  }

  @Override
  public void prepare(Map arg0, TopologyContext arg1) {
  }

}
