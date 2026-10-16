package com.lpssy.spark.dao;

import java.util.List;

import com.lpssy.spark.domain.CarTrack;
/**
 * 车辆轨迹DAO接口
 * 作用：把每辆车在分析时段内经过的卡口序列（轨迹串）批量写回MySQL。
 * 数据流向：输入=List<CarTrack>（Spark算好的车辆轨迹）；输出=写入表 car_track。
 */
public interface ICarTrackDAO {
	
	/**
	 * 批量插入车辆轨迹信息
	 * 对应表：car_track（task_id, date, car, track）
	 * @param carTracks 车辆轨迹列表，track形如 "卡口1=时间1|卡口2=时间2|..."
	 */
	void insertBatchCarTrack(List<CarTrack> carTracks);
}
