package com.lpssy.spark.domain;

/**
 * 获取车流量排名前N的卡口
 * 对应表：topn_monitor_car_count
 * 作用：表示"某任务下，一个卡口总共过了多少辆车"的TopN排名结果，用于大屏/报表展示最拥堵的卡口。
 * @author root
 *
 */
public class TopNMonitor2CarCount {
	/** 任务ID */
	private long taskId;
	/** 卡口ID */
	private String monitorId;
	/** 该卡口在分析时段内的过车总数 */
	private int carCount;
	 
	public String getMonitorId() {
		return monitorId;
	}
	public void setMonitorId(String monitorId) {
		this.monitorId = monitorId;
	}
	 
	public TopNMonitor2CarCount(long taskId, String monitorId, int carCount) {
		super();
		this.taskId = taskId;
		this.monitorId = monitorId;
		this.carCount = carCount;
	}
	public int getCarCount() {
		return carCount;
	}
	public void setCarCount(int carCount) {
		this.carCount = carCount;
	}
	public long getTaskId() {
		return taskId;
	}
	public void setTaskId(long taskId) {
		this.taskId = taskId;
	}
	public TopNMonitor2CarCount() {

	}
}
