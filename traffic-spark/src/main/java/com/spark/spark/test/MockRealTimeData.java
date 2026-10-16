package com.spark.spark.test;

import java.util.Properties;
import java.util.Random;

import com.lpssy.spark.util.DateUtils;
import com.lpssy.spark.util.StringUtils;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

/**
 * 实时模拟过车数据生产者（独立线程）
 *
 * 【输出】无限循环随机生成过车日志，发送到 Kafka topic "RoadRealTimeLog"，
 *         每行 tab 分隔，字段与离线过车明细一致，供 RoadRealTimeAnalyze 实时消费演示。
 */
public class MockRealTimeData extends Thread {
	
	private static final Random random = new Random();
	private static final String[] locations = new String[]{"鲁","贵","贵","贵","沪","贵","贵","深","贵","贵"};
	private KafkaProducer<String, String> producer;
	
	public MockRealTimeData() {// 构造时初始化KafkaProducer
		producer = new KafkaProducer<>(createProducerConfig());
	}
	
	private Properties createProducerConfig() {// 组装Kafka生产者配置：broker地址(node1/2/3:9092)与字符串序列化器
		Properties props = new Properties();
		props.put("bootstrap.servers", "node1:9092,node2:9092,node3:9092");
		props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
		props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
		return props;
	}
	
	public void run() {// 线程主循环：每50ms随机造一条过车日志并send到Kafka，永不停止
		System.out.println("正在生产数据 ... ... ");
		while(true) {	
			String date = DateUtils.getTodayDate();
			String baseActionTime = date + " " + StringUtils.fulfuill(random.nextInt(24)+"");
			baseActionTime = date + " " + StringUtils.fulfuill((Integer.parseInt(baseActionTime.split(" ")[1])+1)+"");
			String actionTime = baseActionTime + ":" + StringUtils.fulfuill(random.nextInt(60)+"") + ":" + StringUtils.fulfuill(random.nextInt(60)+"");
    		String monitorId = StringUtils.fulfuill(4, random.nextInt(9)+"");
    		String car = locations[random.nextInt(10)] + (char)(65+random.nextInt(26))+StringUtils.fulfuill(5,random.nextInt(99999)+"");
    		String speed = random.nextInt(260)+"";
    		String roadId = random.nextInt(50)+1+"";
    		String cameraId = StringUtils.fulfuill(5, random.nextInt(9999)+"");
    		String areaId = StringUtils.fulfuill(2,random.nextInt(8)+"");
			producer.send(new ProducerRecord<>("RoadRealTimeLog", date+"\t"+monitorId+"\t"+cameraId+"\t"+car + "\t" + actionTime + "\t" + speed + "\t" + roadId + "\t" + areaId));
			
			try {
				Thread.sleep(50);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}  
		}
	}
	
	/**
	 * 启动Kafka Producer
	 * @param args
	 */
	public static void main(String[] args) {
		MockRealTimeData producer = new MockRealTimeData();
		producer.start();
	}
	
}
