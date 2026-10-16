package com.lpssy.spark.util;

import java.math.BigDecimal;

/**
 * 数字格式工具类
 * 作用：对 double 做四舍五入保留指定小数位，避免直接用 double 产生的一长串尾差。
 * 数据流向：纯内存工具类；输入是待格式化的小数和保留位数，输出是格式化后的 double。
 * @author Administrator
 *
 */
public class NumberUtils {

	/**
	 * 格式化小数：用BigDecimal做四舍五入(ROUND_HALF_UP)，保留 scale 位小数。
	 * @param num 待格式化的原始小数
	 * @param scale 四舍五入后保留的小数位数
	 * @return 格式化后的double
	 */
	public static double formatDouble(double num, int scale) {
		BigDecimal bd = new BigDecimal(num);  
		return bd.setScale(scale, BigDecimal.ROUND_HALF_UP).doubleValue();
	}
	
}
