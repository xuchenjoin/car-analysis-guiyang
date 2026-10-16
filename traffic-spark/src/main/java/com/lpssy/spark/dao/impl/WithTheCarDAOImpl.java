package com.lpssy.spark.dao.impl;

import com.lpssy.spark.constant.Constants;
import com.lpssy.spark.dao.IWithTheCarDAO;
import com.lpssy.spark.jdbc.JDBCHelper;
import com.lpssy.spark.util.DateUtils;

/**
 * 伴随车辆分析DAO实现类
 * 作用：调试工具方法——把"今天日期+指定车牌列表"拼成任务参数JSON，UPDATE到 task 表 task_id=3 那条记录上。
 * 对应表：task（只更新 task_id=3 的 task_param 字段）
 */
public class WithTheCarDAOImpl implements IWithTheCarDAO {

	@Override
	/**
	 * 更新测试数据：用今天作为startDate/endDate，把传入的cars写进task_param JSON，
	 * 便于本地反复调试"同车出行/伴随车辆"分析。
	 * @param cars 车牌串，逗号分隔，如 "京A11111,京A22222"
	 */
	public void updateTestData(String cars) {
		JDBCHelper jdbcHelper = JDBCHelper.getInstance();
		String sql = "UPDATE task set task_param = ? WHERE task_id = 3";
		Object[] params = new Object[]{"{\"startDate\":[\""+DateUtils.getTodayDate()+"\"],\"endDate\":[\""+DateUtils.getTodayDate()+"\"],\""+Constants.FIELD_CARS+"\":[\""+cars+"\"]}"};
		jdbcHelper.executeUpdate(sql, params);
	}

}
