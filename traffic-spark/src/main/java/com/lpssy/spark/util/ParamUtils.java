package com.lpssy.spark.util;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.lpssy.spark.conf.ConfigurationManager;
import com.lpssy.spark.constant.Constants;

/**
 * 参数工具类
 * 作用：统一解析Spark作业的两类入参——本地调试时从配置文件 my.properties 读任务ID，
 *       集群提交时从命令行 args 读任务ID；并能从任务参数JSON中安全取出某个字段的字符串值。
 * 数据流向：输入是命令行args或任务参数JSONObject；输出是任务ID(Long)或参数字符串；
 *           业务作业启动时用它确定"跑哪个分析任务、分析哪段日期/哪些车"。
 * @author Administrator
 *
 */
public class ParamUtils {

	/**
	 * 从命令行参数中提取任务id
	 * @param args 命令行参数
	 * @param taskType 参数类型(任务id对应的值是Long类型才可以)，对应my.properties中的key
	 * @return 任务id
	 * spark.local.taskId.monitorFlow
	 */
	public static Long getTaskIdFromArgs(String[] args, String taskType) {
		boolean local = ConfigurationManager.getBoolean(Constants.SPARK_LOCAL);

		if(local) {
			return ConfigurationManager.getLong(taskType);
		} else {
			try {
				if(args != null && args.length > 0) {
					return Long.valueOf(args[0]);
				}else {
					System.out.println("集群提交任务，需要参数");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return 0L;
	}
	
	/**
	 * 从JSON对象中提取参数
	 * @param jsonObject 任务参数JSON（结构为 {"字段名":["字段值"],...}，值包在数组里，与调度平台传参格式一致）
	 * @return 参数
	 * 形如 {"name":["zhangsan"],"age":["18"]}，本方法取数组第一个元素作为字段值
	 */
	public static String getParam(JSONObject jsonObject, String field) {
		JSONArray jsonArray = jsonObject.getJSONArray(field);
		if(jsonArray != null && jsonArray.size() > 0) {
			return jsonArray.getString(0);
		}
		return null;
	}
	
}
