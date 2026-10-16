package com.producedate2hive;

import org.apache.spark.sql.SparkSession;

/**
 * 1.代码方式向hive中创建数据
 * 2.后面可以有sql文件执行直接在hive中创建数据库表
 *
 * 【输入】本地文件 /root/test/monitor_flow_action、/root/test/monitor_camera_info(由Data2File生成)
 * 【输出】在Hive的traffic库建好 monitor_flow_action 与 monitor_camera_info 两张表并 LOAD DATA 导入数据，
 *         供后续 SparkSQL 分析作业直接查询
 *
 */
public class Data2Hive {
	public static void main(String[] args) {// 入口：开启Hive支持->进入traffic库->建两张表->把本地模拟文件LOAD进表
		SparkSession spark = SparkSession.builder().appName("traffic2hive").enableHiveSupport().getOrCreate();
		//HiveContext是SQLContext的子类。
		spark.sql("USE traffic");
		spark.sql("DROP TABLE IF EXISTS monitor_flow_action");
		//在hive中创建monitor_flow_action表
		spark.sql("CREATE TABLE IF NOT EXISTS monitor_flow_action "
				+ "(date STRING,monitor_id STRING,camera_id STRING,car STRING,action_time STRING,speed STRING,road_id STRING,area_id STRING) "
				+ "row format delimited fields terminated by '\t' ");
		spark.sql("load data local inpath '/root/test/monitor_flow_action' into table monitor_flow_action");
		
		//在hive中创建monitor_camera_info表
		spark.sql("DROP TABLE IF EXISTS monitor_camera_info");
		spark.sql("CREATE TABLE IF NOT EXISTS monitor_camera_info (monitor_id STRING, camera_id STRING) row format delimited fields terminated by '\t'");
		spark.sql("LOAD DATA "
				+ "LOCAL INPATH '/root/test/monitor_camera_info'"
				+ "INTO TABLE monitor_camera_info");
		
		System.out.println("========data2hive finish========");
		spark.stop();
	}
}
