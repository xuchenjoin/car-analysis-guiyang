package com.lpssy.spark.domain;

import java.io.Serializable;

/**
 * Taskr任务domain
 * 对应表：task
 * 作用：表示一条分析任务记录——作业启动时按taskId从task表读出，从中取出taskParams(JSON)拿到起止日期、
 *       车牌列表等参数。实现Serializable以便在Spark集群节点间传输。
 * @author root
 *
 */
public class Task implements Serializable {

	/**
	 * 序列化版本号：保证跨节点反序列化时类版本一致
	 */
	private static final long serialVersionUID = 1L;

	/** 任务主键 task_id */
	private long taskId;
	/** 任务名称 */
	private String taskName;
	/** 创建时间 */
	private String createTime;
	/** 任务开始时间 */
	private String startTime;
	/** 任务结束时间 */
	private String finishTime;
	/** 任务类型（监控流量/随机抽样/伴随车等） */
	private String taskType;
	/** 任务状态（新建/运行中/完成等） */
	private String taskStatus;
	/** 任务参数JSON，如 {"startDate":["2017-01-01"],"endDate":["2017-01-01"],"cars":["京A1"]} */
	private String taskParams;

	public Task() {

	}
	public Task(long taskId, String taskName, String createTime, String startTime, String finishTime, String taskType, String taskStatus, String taskParams) {
		super();
		this.taskId = taskId;
		this.taskName = taskName;
		this.createTime = createTime;
		this.startTime = startTime;
		this.finishTime = finishTime;
		this.taskType = taskType;
		this.taskStatus = taskStatus;
		this.taskParams = taskParams;
	}
	public long getTaskId() {
		return taskId;
	}
	public void setTaskId(long taskId) {
		this.taskId = taskId;
	}
	public String getTaskName() {
		return taskName;
	}
	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getFinishTime() {
		return finishTime;
	}
	public void setFinishTime(String finishTime) {
		this.finishTime = finishTime;
	}
	public String getTaskType() {
		return taskType;
	}
	public void setTaskType(String taskType) {
		this.taskType = taskType;
	}
	public String getTaskStatus() {
		return taskStatus;
	}
	public void setTaskStatus(String taskStatus) {
		this.taskStatus = taskStatus;
	}
	public String getTaskParams() {
		return taskParams;
	}
	public void setTaskParams(String taskParams) {
		this.taskParams = taskParams;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
}
