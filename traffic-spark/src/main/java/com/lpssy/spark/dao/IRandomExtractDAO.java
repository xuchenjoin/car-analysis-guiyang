package com.lpssy.spark.dao;

import java.util.List;

import com.lpssy.spark.domain.RandomExtractCar;
import com.lpssy.spark.domain.RandomExtractMonitorDetail;

/**
 * 随机抽取car信息管理DAO类
 * 作用：把"随机抽样车辆"作业的结果写回MySQL——抽到的车辆清单、以及这些被抽中车辆的每次过车抓拍明细。
 * 数据流向：输入=Spark抽样结果List；输出=写入 random_extract_car 和 random_extract_car_detail_info 两张表。
 * @author root
 *
 */
public interface IRandomExtractDAO {
	/**
	 * 批量插入抽中的车辆清单
	 * 对应表：random_extract_car（task_id, car, date, date_hour）
	 */
	void insertBatchRandomExtractCar(List<RandomExtractCar> carRandomExtracts);

	/**
	 * 批量插入被抽中车辆的过车抓拍明细
	 * 对应表：random_extract_car_detail_info（task_id, date, monitor_id, camera_id, car, action_time, speed, road_id）
	 */
	void insertBatchRandomExtractDetails(List<RandomExtractMonitorDetail> randomExtractMonitorDetails);

//	void insertBatchRandomExtractDetails(List<RandomExtractMonitorDetail> randomExtractMonitorDetails);
}
