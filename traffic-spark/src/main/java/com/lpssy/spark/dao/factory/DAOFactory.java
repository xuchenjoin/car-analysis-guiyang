package com.lpssy.spark.dao.factory;

import com.lpssy.spark.dao.IAreaDao;
import com.lpssy.spark.dao.ICarTrackDAO;
import com.lpssy.spark.dao.IMonitorDAO;
import com.lpssy.spark.dao.IRandomExtractDAO;
import com.lpssy.spark.dao.ITaskDAO;
import com.lpssy.spark.dao.IWithTheCarDAO;
import com.lpssy.spark.dao.impl.AreaDaoImpl;
import com.lpssy.spark.dao.impl.CarTrackDAOImpl;
import com.lpssy.spark.dao.impl.MonitorDAOImpl;
import com.lpssy.spark.dao.impl.RandomExtractDAOImpl;
import com.lpssy.spark.dao.impl.TaskDAOImpl;
import com.lpssy.spark.dao.impl.WithTheCarDAOImpl;

/**
 * DAO工厂类
 * 作用：集中生产各个DAO实现对象。业务代码面向接口(IXxxDAO)编程，通过本工厂拿到实现，
 *       避免业务层直接 new XXXImpl，以后替换实现/加代理时只需改工厂一处。
 * 数据流向：无外部IO；输入=无；输出=各DAO接口的实现实例。
 * @author root
 *
 */
public class DAOFactory {
	/** 获取任务DAO实现（读 task 表） */
	public static ITaskDAO getTaskDAO(){
		return new TaskDAOImpl();
	}
	/** 获取卡口流量DAO实现（写 topn_monitor_* / monitor_state / top10_speed_detail 表） */
	public static IMonitorDAO getMonitorDAO(){
		return new MonitorDAOImpl();
	}
	/** 获取随机抽样DAO实现（写 random_extract_car / random_extract_car_detail_info 表） */
	public static IRandomExtractDAO getRandomExtractDAO(){
		return new RandomExtractDAOImpl();
	}

	/** 获取车辆轨迹DAO实现（写 car_track 表） */
	public static ICarTrackDAO getCarTrackDAO(){
		return new CarTrackDAOImpl();
	}

	/** 获取伴随车辆DAO实现（更新 task 表 task_id=3 的参数） */
	public static IWithTheCarDAO getWithTheCarDAO(){
		return new WithTheCarDAOImpl();
	}

	/** 获取区域DAO实现（读 area_info 表） */
	public static IAreaDao getAreaDao() {
		return  new AreaDaoImpl();

	}
}
