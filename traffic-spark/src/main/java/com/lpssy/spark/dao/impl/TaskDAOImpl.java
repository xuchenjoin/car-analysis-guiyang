package com.lpssy.spark.dao.impl;

import java.sql.ResultSet;
import com.lpssy.spark.dao.ITaskDAO;
import com.lpssy.spark.domain.Task;
import com.lpssy.spark.jdbc.JDBCHelper;
import com.lpssy.spark.jdbc.JDBCHelper.QueryCallback;

/**
 * 任务管理DAO实现类
 * 作用：根据任务ID查询MySQL的 task 表，把一行任务记录的8个字段全部读出，封装成Task对象返回。
 * 对应表：task（task_id, task_name, create_time, start_time, finish_time, task_type, task_status, task_param）
 * @author root
 *
 */
public class TaskDAOImpl implements ITaskDAO {
	@Override
	/**
	 * 按主键查询任务：SQL "SELECT * FROM task WHERE task_id=?"，
	 * 回调里按列序号把ResultSet各列set进Task对象；调用方拿到后即可解析taskParams(JSON)取起止日期/车牌等。
	 */
	public Task findTaskById(long taskId) {
		final Task task = new Task();

		String sql = "SELECT * FROM task WHERE task_id = ?";
		
		Object[] params = new Object[]{taskId};
		
		JDBCHelper jdbcHelper = JDBCHelper.getInstance();
		jdbcHelper.executeQuery(sql, params, new QueryCallback() {
			
			@Override
			public void process(ResultSet rs) throws Exception {
				if(rs.next()) {
					// 按建表列顺序依次取：1任务ID 2任务名 3创建时间 4开始时间 5结束时间 6任务类型 7任务状态 8任务参数JSON
					long taskid = rs.getLong(1);
					String taskName = rs.getString(2);
					String createTime = rs.getString(3);
					String startTime = rs.getString(4);
					String finishTime = rs.getString(5);
					String taskType = rs.getString(6);
					String taskStatus = rs.getString(7);
					String taskParam = rs.getString(8);
					
					task.setTaskId(taskid);
					task.setTaskName(taskName); 
					task.setCreateTime(createTime); 
					task.setStartTime(startTime);
					task.setFinishTime(finishTime);
					task.setTaskType(taskType);  
					task.setTaskStatus(taskStatus);
					task.setTaskParams(taskParam);  
				}
			}
		});
		return task;
	}

}
