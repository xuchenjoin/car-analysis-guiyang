package com.lpssy.spark.util;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;

import com.alibaba.fastjson.JSONObject;
import com.lpssy.spark.conf.ConfigurationManager;
import com.lpssy.spark.constant.Constants;
import com.spark.spark.test.MockData;
 

/**
 * Spark工具类
 * 作用：封装Spark作业启动阶段常用的RDD/DF加载动作——根据任务参数中的日期范围（及可选车牌、区域ID），
 *       从Hive表 monitor_flow_action 中筛出卡口过车明细，转成 JavaRDD<Row> 交给后续分析算子。
 * 数据流向：输入是任务参数JSON（起止日期、车牌、区域ID）；输出是卡口过车明细RDD；
 *           本地模式(spark.local=true)下还会调用MockData生成模拟数据便于调试。
 *
 */
public class SparkUtils {
	
	/**
	 * 根据当前是否本地测试的配置，决定 如何设置SparkConf的master
	 */
//	public static void setMaster(SparkConf conf) {
//		boolean local = ConfigurationManager.getBoolean(Constants.SPARK_LOCAL);
//		if(local) {
//			conf.setMaster("local");
//		}
//	}
	
	/**
	 * 获取SQLContext
	 * 如果spark.local设置为true，那么就创建SQLContext；否则，创建HiveContext
	 */
//	public static SparkSession getSQLContext(JavaSparkContext sc) {
//		boolean local = ConfigurationManager.getBoolean(Constants.SPARK_LOCAL);
//		if(local) {
//			//如果SparkContext已经存在，SparkSession就会重用它，如果不存在，Spark就会创建一个新的SparkContext
//			SparkSession.builder().getOrCreate();
//			return SparkSession.builder().getOrCreate();
//		} else {
//			System.out.println("++++++++++++++++++++++++++++++++++++++开启hive的支持");
//			/**
//			 * "SELECT * FROM table1 join table2 ON (连接条件)"  如果某一个表小于20G 他会自动广播出去
//			 * 会将小于spark.sql.autoBroadcastJoinThreshold值（默认为10M）的表广播到executor节点，不走shuffle过程,更加高效。
//			 *
//			 * config("spark.sql.autoBroadcastJoinThreshold", "1048576000");  //单位：字节
//			 */
//			return SparkSession.builder().config("spark.sql.autoBroadcastJoinThreshold", "1048576000").enableHiveSupport().getOrCreate();
//		}
//	}
	
	/**
	 * 生成模拟数据
	 * 如果spark.local配置设置为true，则生成模拟数据；否则不生成
	 */
	public static void mockData(JavaSparkContext sc, SparkSession spark) {
		boolean local = ConfigurationManager.getBoolean(Constants.SPARK_LOCAL);
		/**
		 * 如何local为true  说明在本地测试  应该生产模拟数据    RDD-》DataFrame-->注册成临时表0
		 * false    HiveContext  直接可以操作hive表
		 */
		if(local) {
			MockData.mock(sc, spark);
		}
	}
	
	/**
	 * 获取指定日期范围内的卡口过车明细RDD。
	 * 从任务参数JSON中取出 startDate/endDate，拼SQL查Hive表 monitor_flow_action，
	 * 返回该日期区间内所有过车记录（一行=一次车辆经过卡口的抓拍）。
	 */
	public static JavaRDD<Row> getCameraRDDByDateRange(SparkSession spark, JSONObject taskParamsJsonObject) {
		String startDate = ParamUtils.getParam(taskParamsJsonObject, Constants.PARAM_START_DATE);
		String endDate = ParamUtils.getParam(taskParamsJsonObject, Constants.PARAM_END_DATE);
		String sql = 
				"SELECT * "
				+ "FROM monitor_flow_action "
				+ "WHERE date>='" + startDate + "' "
				+ "AND date<='" + endDate + "'";  
		
		Dataset<Row> monitorDF = spark.sql(sql);
		/**
		 * repartition可以提高stage的并行度
		 */
//		return actionDF.javaRDD().repartition(1000);
		return monitorDF.javaRDD();   
	}
	
	/**
	 * 获取指定日期范围内、且车牌在指定列表中的车辆过车明细RDD（用于"伴随车辆分析"等只关心特定车的场景）。
	 * 在 monitor_flow_action 上额外拼 car in ('京Axxx','京Byyy',...) 条件。
	 */
	public static JavaRDD<Row> getCameraRDDByDateRangeAndCars(SparkSession spark, JSONObject taskParamsJsonObject) {
		String startDate = ParamUtils.getParam(taskParamsJsonObject, Constants.PARAM_START_DATE);
		String endDate = ParamUtils.getParam(taskParamsJsonObject, Constants.PARAM_END_DATE);
		String cars = ParamUtils.getParam(taskParamsJsonObject, Constants.FIELD_CARS);
		String[] carArr = cars.split(",");
		String sql = 
				"SELECT * "
				+ "FROM monitor_flow_action "
				+ "WHERE date>='" + startDate + "' "
				+ "AND date<='" + endDate + "' "
				+ "AND car IN (";

		for (int i = 0; i < carArr.length; i++) {
			sql += "'" + carArr[i] + "'";
			if(i < carArr.length - 1){
				sql += ",";
			}
		}
		sql += ")";
		
		System.out.println("sql:"+sql);
		Dataset<Row> monitorDF = spark.sql(sql);
		
		/**
		 * repartition可以提高stage的并行度
		 */
//		return actionDF.javaRDD().repartition(1000);
		
		return monitorDF.javaRDD();
	}
	
	/*****************************************************/
	/**
	 * 获取指定日期范围、且属于指定区域(area_id)内的卡口过车明细RDD。
	 * 用于按行政区划/管控区域统计流量；show()打印前若干行便于本地调试。
	 */
	public static JavaRDD<Row> getCameraRDDByDateRangeAndArea(SparkSession spark, JSONObject taskParamsJsonObject,String a) {
		String startDate = ParamUtils.getParam(taskParamsJsonObject, Constants.PARAM_START_DATE);
		String endDate = ParamUtils.getParam(taskParamsJsonObject, Constants.PARAM_END_DATE);
		
		String sql = 
				"SELECT * "
				+ "FROM monitor_flow_action "
				+ "WHERE date>='" + startDate + "' "
				+ "AND date<='" + endDate + "'"
				+ "AND area_id in ('"+a +"')";
		Dataset<Row> monitorDF = spark.sql(sql);
		monitorDF.show();
		/**
		 * repartition可以提高stage的并行度
		 */
//		return actionDF.javaRDD().repartition(1000);
		return monitorDF.javaRDD();   
	}
	
}
