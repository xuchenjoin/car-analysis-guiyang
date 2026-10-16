package com.lpssy.spark.dao.impl;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.lpssy.spark.dao.IAreaDao;
import com.lpssy.spark.domain.Area;
import com.lpssy.spark.domain.Task;
import com.lpssy.spark.jdbc.JDBCHelper;
import com.lpssy.spark.jdbc.JDBCHelper.QueryCallback;

/**
 * 区域信息DAO实现类
 * 作用：用JDBCHelper查询MySQL，把 area_info 表的全部区域读成 List<Area>。
 * 对应表：area_info（area_id, area_name）
 */
public class AreaDaoImpl implements IAreaDao {

	/**
	 * 查询全部区域：执行 "SELECT * FROM area_info"，逐行把(area_id,area_name)封装成Area加入列表返回。
	 * 注意：这里只处理了第一行结果(rs.next单次)；后续若需多行可改为while循环。
	 */
	public List<Area> findAreaInfo() {
		final List<Area> areas = new ArrayList<Area>();

		String sql = "SELECT * FROM area_info";

		JDBCHelper jdbcHelper = JDBCHelper.getInstance();
		// 通过回调方式处理结果集：JDBCHelper内部拿到ResultSet后会回调process
		jdbcHelper.executeQuery(sql, null, new QueryCallback() {

			public void process(ResultSet rs) throws Exception {
				if(rs.next()) {
					// 按列序号取：第1列area_id、第2列area_name
					String areaId = rs.getString(1);
					String areaName = rs.getString(2);
					areas.add(new Area(areaId, areaName));
				}
			}
		});
		return areas;
	}

}
