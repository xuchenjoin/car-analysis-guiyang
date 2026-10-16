package com.lpssy.spark.domain;

/**
 * 区域信息实体类
 * 对应表：area_info（area_id, area_name）
 * 作用：表示一个管控区域/行政区划，携带区域ID和区域名称，供按区域统计流量时使用。
 */
public class Area {
	/** 区域ID（area_id） */
	private String areaId;
	/** 区域名称（area_name），如"朝阳区" */
	private String areaName;
	public String getAreaId() {
		return areaId;
	}
	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}
	public String getAreaName() {
		return areaName;
	}
	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}
	
	public Area(String areaId, String areaName) {
		super();
		this.areaId = areaId;
		this.areaName = areaName;
	}
	public Area() {
		super();
	}
}
