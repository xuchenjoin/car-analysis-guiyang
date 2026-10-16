package com.lpssy.spark.dao;

import java.util.List;

import com.lpssy.spark.domain.MonitorState;
import com.lpssy.spark.domain.TopNMonitor2CarCount;
import com.lpssy.spark.domain.TopNMonitorDetailInfo;

/**
 * 卡口流量监控管理DAO接口
 * 作用：把"卡口流量TopN分析"作业的三类结果批量写回MySQL——
 *       车流量排名TopN卡口、TopN卡口下的过车明细、卡口/摄像头正常异常状态汇总、Top10超速明细。
 * 数据流向：输入=Spark聚合后的结果List；输出=分别写入
 *          topn_monitor_car_count / topn_monitor_detail_info / monitor_state / top10_speed_detail 四张表。
 * @author root
 *
 */
public interface IMonitorDAO {
	/**
	 * 卡口流量topN批量插入到数据库
	 * 对应表：topn_monitor_car_count（task_id, monitor_id, car_count）
	 * @param topNMonitor2CarCounts
	 */
	void insertBatchTopN(List<TopNMonitor2CarCount> topNMonitor2CarCounts);
	
	/**
	 * 卡口下车辆具体信息插入到数据库
	 * 对应表：topn_monitor_detail_info（TopN卡口下每条过车抓拍明细）
	 * @param monitorDetailInfos
	 */
	void insertBatchMonitorDetails(List<TopNMonitorDetailInfo> monitorDetailInfos);

	
	/**
	 * 卡口状态信息插入到数据库
	 * 对应表：monitor_state（正常/异常卡口数、摄像头数、异常摄像头明细串）
	 * @param monitorState
	 */
	void insertMonitorState(MonitorState monitorState);

	void insertBatchTop10Details(List<TopNMonitorDetailInfo> topNMonitorDetailInfos); // Top10超速明细，对应表 top10_speed_detail（8个字段）
}
