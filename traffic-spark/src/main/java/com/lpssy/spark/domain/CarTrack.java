package com.lpssy.spark.domain;

/**
 * 保存车辆轨迹信息 domain
 * 对应表：car_track
 * 作用：表示一辆车在某分析日期内经过的卡口序列，track字段把多个"卡口=时间"用"|"串起来，
 *       例如 "卡口001=2017-01-01 08:00:00|卡口002=2017-01-01 08:15:00"。
 * @author root
 *
 */
public class CarTrack {
	/** 任务ID */
	private long taskId;
	/** 分析日期，yyyy-MM-dd */
	private String date;
	/** 车牌号 */
	private String car;
	/** 轨迹串：多个"卡口ID=过车时间"用|拼接 */
	private String track;
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	
	public long getTaskId() {
		return taskId;
	}
	public void setTaskId(long taskId) {
		this.taskId = taskId;
	}
	public String getCar() {
		return car;
	}
	public void setCar(String car) {
		this.car = car;
	}
	public String getTrack() {
		return track;
	}
	public void setTrack(String track) {
		this.track = track;
	}
	public CarTrack(long taskId, String date, String car, String track) {
		super();
		this.taskId = taskId;
		this.date = date;
		this.car = car;
		this.track = track;
	}
	public CarTrack() {
		super();
	}
}
