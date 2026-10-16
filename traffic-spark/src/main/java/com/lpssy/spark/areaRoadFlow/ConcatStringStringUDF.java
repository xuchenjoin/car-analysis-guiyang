package com.lpssy.spark.areaRoadFlow;
import org.apache.spark.sql.api.java.UDF3;

/**
 * 将两个字段拼接起来（使用指定的分隔符）
 *
 * 这是一个自定义 UDF（用户自定义函数），在 AreaTop3RoadFlowAnalyze 中
 * 通过 spark.udf().register("concat_String_string", ...) 注册给 SparkSQL 使用。
 *
 * 输入：area_name（区域名称）、road_id（道路ID）、split（分隔符）
 * 输出：拼接后的字符串，例如 "海淀区:01"，为后续加随机前缀防数据倾斜做准备
 *
 * @author Administrator
 * 海淀区:建材城西路
 */
public class ConcatStringStringUDF implements UDF3<String, String, String, String> {
	private static final long serialVersionUID = 1L;
	
	@Override
	public String call(String area_name, String road_id, String split) throws Exception {// 把"区域名"和"道路ID"用分隔符拼成联合key，例如 area_name=海淀区、road_id=01、split=: => "海淀区:01"
		return area_name + split + road_id;
	}

}
