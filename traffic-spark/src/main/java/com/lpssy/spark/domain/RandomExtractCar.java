package com.lpssy.spark.domain;

/**
 * 随机抽取出来的car信息 domain
 * 对应表：random_extract_car
 * 作用：表示一次随机抽样中被抽中的某辆车——记录任务ID、车牌号、抽样日期、抽样落到的"日期_小时"段。
 * @author root
 */
public class RandomExtractCar {
	/** 任务ID */
	private long taskId;
	/** 车牌号 */
	private String car;
	/** 抽样日期，yyyy-MM-dd */
	private String date;
	/** 抽样所在的小时段，形如 yyyy-MM-dd_HH */
	private String dateHour;
	 
	public String getCar() {
		return car;
	}
	public void setCar(String car) {
		this.car = car;
	}
	 
	public String getDateHour() {
		return dateHour;
	}
	public void setDateHour(String dateHour) {
		this.dateHour = dateHour;
	}
	public long getTaskId() {
		return taskId;
	}
	public void setTaskId(long taskId) {
		this.taskId = taskId;
	}
	 
	public RandomExtractCar(long taskId, String car, String date, String dateHour) {
		super();
		this.taskId = taskId;
		this.car = car;
		this.date = date;
		this.dateHour = dateHour;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public RandomExtractCar() {
		super();
	}
}
