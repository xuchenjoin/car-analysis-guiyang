package com.lpssy.spark.dao;

/**
 * "伴随车辆分析"DAO接口
 * 作用：调试用——把指定车牌列表拼进 task 表 task_id=3 这条任务的 task_param JSON里，
 *       便于本地反复跑"和某辆车同路出现的车"分析。
 * 数据流向：输入=要关注的车牌字符串；输出=UPDATE task 表 task_id=3 的 task_param 字段。
 */
public interface IWithTheCarDAO {
	/**
	 * 更新task表中 task_id=3 任务的任务参数，写入今天日期和指定车牌列表（调试用）
	 * @param param 车牌串，形如 "京A11111,京A22222"
	 */
	void updateTestData(String param);
}
