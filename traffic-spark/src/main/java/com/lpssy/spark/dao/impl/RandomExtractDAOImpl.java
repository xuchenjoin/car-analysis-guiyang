package com.lpssy.spark.dao.impl;

import java.util.ArrayList;
import java.util.List;
import com.lpssy.spark.dao.IRandomExtractDAO;
import com.lpssy.spark.domain.RandomExtractCar;
import com.lpssy.spark.domain.RandomExtractMonitorDetail;
import com.lpssy.spark.jdbc.JDBCHelper;

/**
 * 随机抽取car信息管理DAO实现类
 * 作用：把随机抽样车辆作业的两类结果批量写入MySQL。
 * 对应表：random_extract_car（抽中车辆清单）、random_extract_car_detail_info（抽中车辆的过车明细）
 * @author root
 *
 */
public class RandomExtractDAOImpl implements IRandomExtractDAO {

		@Override
		//批量写入抽中车辆清单：表 random_extract_car（task_id, car, date, date_hour）
		public void insertBatchRandomExtractCar(List<RandomExtractCar> carRandomExtracts) {
			 JDBCHelper jdbcHelper = JDBCHelper.getInstance();
			 String sql = "INSERT INTO random_extract_car VALUES(?,?,?,?)";
			 List<Object[]> params = new ArrayList<>();
			 for (RandomExtractCar carRandomExtract : carRandomExtracts) {
				 params.add(new Object[]{carRandomExtract.getTaskId(),carRandomExtract.getCar(),carRandomExtract.getDate(),carRandomExtract.getDateHour()});
			 }
			 jdbcHelper.executeBatch(sql , params);
	}

		@Override
		//批量写入抽中车辆的过车抓拍明细：表 random_extract_car_detail_info（8个字段）
		public void insertBatchRandomExtractDetails(List<RandomExtractMonitorDetail> randomExtractMonitorDetails) {
			 JDBCHelper jdbcHelper = JDBCHelper.getInstance();
			 String sql = "INSERT INTO random_extract_car_detail_info VALUES(?,?,?,?,?,?,?,?)";
			 List<Object[]> params = new ArrayList<>();
			 for(RandomExtractMonitorDetail r : randomExtractMonitorDetails){
				 params.add(new Object[]{r.getTaskId(),r.getDate(),r.getMonitorId(),r.getCameraId(),r.getCar(),r.getActionTime(),r.getSpeed(),r.getRoadId()});
			 }
			 jdbcHelper.executeBatch(sql, params);
		}
		 
}
