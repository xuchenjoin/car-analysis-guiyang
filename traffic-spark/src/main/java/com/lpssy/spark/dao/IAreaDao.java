package com.lpssy.spark.dao;

import java.util.List;

import com.lpssy.spark.domain.Area;
/**
 * 区域(管控区/行政区划)信息DAO接口
 * 作用：从MySQL的 area_info 表读取 区域ID→区域名称 的映射，供按区域统计卡口流量时使用。
 * 数据流向：输入=无；输出=List<Area>（区域列表）；由DAOFactory.getAreaDao()获取实现。
 */
public interface IAreaDao {
	List<Area> findAreaInfo(); // 查询全部区域信息，对应表 area_info（area_id, area_name）
}
