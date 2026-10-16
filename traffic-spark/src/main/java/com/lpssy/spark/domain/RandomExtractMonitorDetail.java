package com.lpssy.spark.domain;

/**
 * 被抽中车辆的过车抓拍明细实体类
 * 对应表：random_extract_car_detail_info
 * 作用：记录抽中车辆每次经过卡口摄像头的抓拍信息——在哪天、哪个卡口、哪个摄像头、几点几分、车速多少、在哪条路上。
 */
public class RandomExtractMonitorDetail  {
	/** 任务ID */
	private long taskId;
 	/** 过车日期 yyyy-MM-dd */
 	private String date;
 	/** 卡口ID */
 	private String monitorId;
 	/** 摄像头ID */
 	private String cameraId;
 	/** 车牌号 */
 	private String car;
 	/** 过车时间 yyyy-MM-dd HH:mm:ss */
 	private String actionTime;
 	/** 当时车速 */
 	private String speed;
 	/** 所在道路ID */
 	private String roadId;
	public long getTaskId() {
		return taskId;
	}
	public void setTaskId(long taskId) {
		this.taskId = taskId;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getMonitorId() {
		return monitorId;
	}
	public void setMonitorId(String monitorId) {
		this.monitorId = monitorId;
	}
	public String getCameraId() {
		return cameraId;
	}
	public void setCameraId(String cameraId) {
		this.cameraId = cameraId;
	}
	public String getCar() {
		return car;
	}
	public void setCar(String car) {
		this.car = car;
	}
	public String getActionTime() {
		return actionTime;
	}
	public void setActionTime(String actionTime) {
		this.actionTime = actionTime;
	}
	public String getSpeed() {
		return speed;
	}
	public void setSpeed(String speed) {
		this.speed = speed;
	}
	public String getRoadId() {
		return roadId;
	}
	public void setRoadId(String roadId) {
		this.roadId = roadId;
	}
	public RandomExtractMonitorDetail(long taskId, String date, String monitorId, String cameraId, String car, String actionTime, String speed, String roadId) {
		super();
		this.taskId = taskId;
		this.date = date;
		this.monitorId = monitorId;
		this.cameraId = cameraId;
		this.car = car;
		this.actionTime = actionTime;
		this.speed = speed;
		this.roadId = roadId;
	}
	public RandomExtractMonitorDetail() {
		super();
	}
}
