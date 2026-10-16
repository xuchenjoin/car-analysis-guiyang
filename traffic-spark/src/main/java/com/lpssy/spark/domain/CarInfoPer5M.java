package com.lpssy.spark.domain;

/**
 * "卡口+5分钟时间窗"内车辆信息实体类
 * 对应表：monitor_range_time_car（早期版本使用，当前相关插入逻辑已注释）
 * 作用：记录某个任务下、某个卡口、某个5分钟区间内经过的车辆列表（cars用"车牌=时间|车牌=时间"拼接）。
 */
public class CarInfoPer5M {
	/** 任务ID */
	private long taskId;
	/** 卡口ID */
	private String monitorId;
	/** 5分钟时间窗，形如 "yyyy-MM-dd HH:mm~HH:mm" */
	private String rangeTime;
	/** 该时间窗内经过的车辆串，形如 "京A11111=10:03:21|京B22222=10:04:55" */
	private String cars;
	public long getTaskId() {
		return taskId;
	}
	public void setTaskId(long taskId) {
		this.taskId = taskId;
	}
	public String getMonitorId() {
		return monitorId;
	}
	public void setMonitorId(String monitorId) {
		this.monitorId = monitorId;
	}
	public String getRangeTime() {
		return rangeTime;
	}
	public void setRangeTime(String rangeTime) {
		this.rangeTime = rangeTime;
	}
	public String getCars() {
		return cars;
	}
	public void setCars(String cars) {
		this.cars = cars;
	}
	public CarInfoPer5M(long taskId, String monitorId, String rangeTime, String cars) {
		super();
		this.taskId = taskId;
		this.monitorId = monitorId;
		this.rangeTime = rangeTime;
		this.cars = cars;
	}
	public CarInfoPer5M() {
		super();
	}
}
