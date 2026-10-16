package com.lpssy.spark.dao.impl;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.lpssy.spark.dao.ICarTrackDAO;
import com.lpssy.spark.domain.CarInfoPer5M;
import com.lpssy.spark.domain.CarTrack;
import com.lpssy.spark.jdbc.JDBCHelper;
import com.lpssy.spark.jdbc.JDBCHelper.QueryCallback;
import com.lpssy.spark.util.DateUtils;
import com.lpssy.spark.util.StringUtils;

/**
 * 车辆轨迹DAO实现类
 * 作用：把算好的车辆轨迹批量写入MySQL的 car_track 表；
 *       （下方大段注释掉的代码是早期"按5分钟时间窗聚合车辆到 monitor_range_time_car 表"的实现，当前未启用）
 * 对应表：car_track（task_id, date, car, track）
 */
public class CarTrackDAOImpl implements ICarTrackDAO {
	@Override
	/**
	 * 批量插入车辆轨迹：遍历传入的CarTrack列表，每条组装成 Object[]{taskId,date,car,track}，
	 * 再交给JDBCHelper.executeBatch一次性批量写库。
	 */
	public void insertBatchCarTrack(List<CarTrack> carTracks) {
		JDBCHelper jdbcHelper = JDBCHelper.getInstance();
		 // car_track 表4个字段：任务ID、日期、车牌号、轨迹串
		 String sql = "INSERT INTO car_track VALUES(?,?,?,?)";
		 List<Object[]> params = new ArrayList<>();
		 for(CarTrack c : carTracks){
			 /**
			  * 添加到车辆轨迹表中
			  */
			 params.add(new Object[]{c.getTaskId(),c.getDate(),c.getCar(),c.getTrack()});
			 
			 /**
			  * 添加到段时间内的车辆信息表中
			  */
//			 long taskId = c.getTaskId();
//			 String car = c.getCar();
//			 String track = c.getTrack();
//			 Map<String, String> timeAndMonitor = StringUtils.getKeyValuesFromConcatString(track, "\\|");
//			 List<CarInfoPer5M> insertList = new ArrayList<>();
//			 List<CarInfoPer5M> updateList = new ArrayList<>();
//			 for (Entry<String, String> entry : timeAndMonitor.entrySet()) {
//				 String monitorId = entry.getKey();
//				 String dateTime = entry.getValue();
//				 String timeRange = DateUtils.getRangeTime(dateTime);
//				 
//				 String sqlText = "SELECT * FROM monitor_range_time_car WHERE task_id = ? AND monitor_id = ? AND range_time = ?";
//			  	 Object[] selarams = new Object[]{taskId ,monitorId,timeRange};
//			  	 final CarInfoPer5M carInfoPer5M = new CarInfoPer5M();
//			  	 jdbcHelper.executeQuery(sqlText, selarams, new QueryCallback() {
//					@Override
//					public void process(ResultSet rs) throws Exception {
//						if(rs.next()){
//							carInfoPer5M.setCars(rs.getString(4));
//						}
//					}
//				});
//				carInfoPer5M.setTaskId(taskId);
//				carInfoPer5M.setMonitorId(monitorId);
//				carInfoPer5M.setRangeTime(timeRange);
//			  	 if(carInfoPer5M.getCars() != null){
//			  		 String cars = carInfoPer5M.getCars();
//			  		 cars += "|"+car+"="+dateTime;
//			  		 carInfoPer5M.setCars(cars);
//			  		 updateList.add(carInfoPer5M);
//			  	 }else{
//			  		 carInfoPer5M.setCars(car+"="+dateTime);
//			  		 insertList.add(carInfoPer5M);
//			  	 }
//			}
//			
//			 String insertSQL = "INSERT INTO monitor_range_time_car VALUES(?,?,?,?)";
//			 List<Object[]> insertParams = new ArrayList<>();
//			 for (CarInfoPer5M carInfoPer5M : insertList) {
//				 insertParams.add(new Object[]{carInfoPer5M.getTaskId(),carInfoPer5M.getMonitorId(),carInfoPer5M.getRangeTime(),carInfoPer5M.getCars()});
//			 }
//			 jdbcHelper.executeBatch(insertSQL, insertParams);
//			 
//			 String updateSQL = "UPDATE monitor_range_time_car SET cars = ? WHERE task_id = ? AND monitor_id = ? AND range_time = ?";
//			 for (CarInfoPer5M carInfoPer5M : updateList) {
//				 Object[] updateParam = new Object[]{carInfoPer5M.getCars(),carInfoPer5M.getTaskId(),carInfoPer5M.getMonitorId(),carInfoPer5M.getRangeTime()};
//				 jdbcHelper.executeUpdate(updateSQL, updateParam);
//			 }
		 }
		 jdbcHelper.executeBatch(sql, params);
	}

}
