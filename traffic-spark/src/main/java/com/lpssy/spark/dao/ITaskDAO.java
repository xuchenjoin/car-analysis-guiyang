package com.lpssy.spark.dao;

import com.lpssy.spark.domain.Task;

/**
 * 任务管理DAO接口
 * 作用：根据任务ID从MySQL的 task 表读出本次分析任务的配置（任务名、起止时间、任务类型、任务参数JSON等）。
 * 数据流向：输入=taskId；输出=Task对象；业务作业启动第一步就是用它取任务参数。
 * @author root
 *
 */
public interface ITaskDAO {

	/**
	 * 根据task的主键查询指定的任务
	 * 对应表：task（task_id 为主键，task_param 字段里是 startDate/endDate/cars 等JSON）
	 * @param taskId 任务主键
	 * @return 任务对象；查不到时返回字段全空的Task
	 */
	Task findTaskById(long taskId);
}
