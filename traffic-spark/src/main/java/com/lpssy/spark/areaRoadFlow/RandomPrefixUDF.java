package com.lpssy.spark.areaRoadFlow;

import java.util.Random;

import org.apache.spark.sql.api.java.UDF2;

/**
 * 随机前缀 UDF：给"区域:道路"联合 key 随机加 0~ranNum-1 的数字前缀（如 "3_海淀区:01"）
 *
 * 作用：解决 group by 时热门道路数据倾斜——把原本集中到一个 task 的海量数据，
 * 拆成 ranNum 份分散到多个 task，shuffle 压力被摊平；聚合完成后再由
 * RemoveRandomPrefixUDF 去掉前缀、按原 key 合并回最终结果。
 *
 * 输入：area_name_road_id（如 "海淀区:01"）、ranNum（拆分数，代码中传 10）
 * 输出：加随机前缀后的字符串
 */
public class RandomPrefixUDF implements UDF2<String, Integer, String>{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public String call(String area_name_road_id, Integer ranNum) throws Exception {// 随机生成一个 [0, ranNum) 的整数作为前缀，拼到原 key 前面
		Random random = new Random();
		int prefix = random.nextInt(ranNum);// 随机前缀：让同一个key均匀分散到ranNum个分区，防止热门key数据倾斜
		return prefix+"_"+area_name_road_id;
	}

}
