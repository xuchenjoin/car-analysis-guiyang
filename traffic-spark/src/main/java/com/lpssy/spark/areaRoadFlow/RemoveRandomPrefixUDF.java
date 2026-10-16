package com.lpssy.spark.areaRoadFlow;

import org.apache.spark.sql.api.java.UDF1;

/**
 * 去掉随机前缀 UDF：与 RandomPrefixUDF 配套使用
 *
 * 输入：加过随机前缀的字符串，如 "1_海淀区:01"
 * 输出：去掉 "数字_" 前缀后的原始 key，如 "海淀区:01"
 * 场景：随机前缀打散聚合完成后，再按原 key 做最终合并
 */
public class RemoveRandomPrefixUDF implements UDF1<String, String> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	//1_海淀区：建材城西路
	public String call(String val) throws Exception {// 按下划线切分，取下划线后第2段(下标1)即去掉随机前缀的原始key
		return val.split("_")[1];
	}

}
