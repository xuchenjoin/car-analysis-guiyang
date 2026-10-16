package com.lpssy.spark.skynet;

import java.io.Serializable;
/**
 * 车速分段排序键（自定义二次排序 Key）。
 * 作用：把一个卡口下"低速/正常/中速/高速"四档通过车辆数打包成一个可比较对象，
 *      作为 RDD 的 key 交给 sortByKey 排序，先比高速数、再比中速、正常、低速数。
 * 数据来源：由 MonitorFlowAnalyze.speedTopNMonitor() 统计每个卡口四档车速后 new 出来。
 * 结果去向：不落库，仅在内存排序时充当排序键，排序后取车辆常高速通过的前 N 个卡口。
 * 为什么要实现 Serializable：key 要在 Shuffle 阶段跨节点传输，必须可序列化。
 */
public class SpeedSortKey implements Comparable<SpeedSortKey>,Serializable {
	private static final long serialVersionUID = 1L;
	private long lowSpeed;//低速通过车辆数（车速 0~60）
	private long normalSpeed;//正常车速通过车辆数（60~90）
	private long mediumSpeed;//中速通过车辆数（90~120）
	private long highSpeed;//高速通过车辆数（>=120）

	public SpeedSortKey() {
		super();
	}

	public SpeedSortKey(long lowSpeed, long normalSpeed, long mediumSpeed, long highSpeed) {
		super();
		this.lowSpeed = lowSpeed;
		this.normalSpeed = normalSpeed;
		this.mediumSpeed = mediumSpeed;
		this.highSpeed = highSpeed;
	}

	@Override
	public int compareTo(SpeedSortKey other) {//多字段依次比较：这就是"二次排序"的核心规则
		if(highSpeed - other.getHighSpeed() != 0){//第一优先级：高速通过数多的排前面
			return (int)(highSpeed - other.getHighSpeed());
		}else if (mediumSpeed - other.getMediumSpeed() != 0) {//第二优先级：高速数相同则比中速数
			return (int)(mediumSpeed - other.getMediumSpeed());
		}else if (normalSpeed - other.getNormalSpeed() != 0) {//第三优先级：再比正常车速通过数
			return (int)(normalSpeed - other.getNormalSpeed());
		}else if (lowSpeed - other.getLowSpeed() != 0) {//第四优先级：最后才比低速通过数
			return (int)(lowSpeed - other.getLowSpeed());
		}
		return 0;//四档计数完全相等，才算两个排序键相同
	}

	public long getLowSpeed() {
		return lowSpeed;
	}

	public void setLowSpeed(long lowSpeed) {
		this.lowSpeed = lowSpeed;
	}

	public long getNormalSpeed() {
		return normalSpeed;
	}

	public void setNormalSpeed(long normalSpeed) {
		this.normalSpeed = normalSpeed;
	}

	public long getMediumSpeed() {
		return mediumSpeed;
	}

	public void setMediumSpeed(long mediumSpeed) {
		this.mediumSpeed = mediumSpeed;
	}

	public long getHighSpeed() {
		return highSpeed;
	}

	public void setHighSpeed(long highSpeed) {
		this.highSpeed = highSpeed;
	}

	@Override
	public String toString() {
		return "SpeedSortKey [lowSpeed=" + lowSpeed + ", normalSpeed=" + normalSpeed + ", mediumSpeed=" + mediumSpeed + ", highSpeed=" + highSpeed + "]";
	}
}
