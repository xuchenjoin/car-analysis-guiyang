package com.lpssy.spark.domain;


/**
 * 卡口的明细数据domain
 * 对应表：topn_monitor_detail_info / top10_speed_detail 复用本结构
 * 作用：表示一条卡口过车抓拍明细——在TopN卡口流量分析和Top10超速分析中都用它承载单行结果。
 * @author root
 *
 */
public class TopNMonitorDetailInfo   {
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
 	/** 过车时间 */
 	private String actionTime;
 	/** 当时车速 */
 	private String speed;
 	/** 道路ID */
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
	public TopNMonitorDetailInfo(long taskId, String date, String monitorId, String cameraId, String car, String actionTime, String speed, String roadId) {
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
	public TopNMonitorDetailInfo() {
		super();
	}
}
