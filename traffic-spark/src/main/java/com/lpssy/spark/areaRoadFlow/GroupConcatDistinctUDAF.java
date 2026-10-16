package com.lpssy.spark.areaRoadFlow;

import java.util.Arrays;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.spark.sql.Row;
import org.apache.spark.sql.expressions.MutableAggregationBuffer;
import org.apache.spark.sql.expressions.UserDefinedAggregateFunction;
import org.apache.spark.sql.types.DataType;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.StructType;

import com.lpssy.spark.util.StringUtils;

/**
 * 组内拼接去重函数（group_concat_distinct()）
 *
 * 技术点：自定义UDAF聚合函数
 *
 * 作用：按 区域+道路 分组后，把组内所有卡口(monitor)拼成像
 * "0001=20|0002=30|0003=50" 这样的字符串——key 是卡口ID，value 是该卡口的车流量。
 * 同一个卡口在组内多次出现时数字累加而不是重复拼接（这就是"去重"的含义）。
 *
 * 输入：String（卡口信息，如 "0001" 或 "0001=20"）
 * 输出：聚合后的大字符串，见上例
 *
 * @author Administrator
 *
 */
public class GroupConcatDistinctUDAF extends UserDefinedAggregateFunction {

	private static final long serialVersionUID = -2510776241322950505L;
	
	// 指定输入数据的字段与类型
	private StructType inputSchema = DataTypes.createStructType(Arrays.asList(
			DataTypes.createStructField("carInfo", DataTypes.StringType, true)));  
	// 指定缓冲数据的字段与类型
	private StructType bufferSchema = DataTypes.createStructType(Arrays.asList(
			DataTypes.createStructField("bufferInfo", DataTypes.StringType, true)));  
	// 指定返回类型
	private DataType dataType = DataTypes.StringType;
	// 指定是否是确定性的
	private boolean deterministic = true;
	
	/**
	 * 输入数据的类型
	 */
	@Override
	public StructType inputSchema() {
		return inputSchema;
	}
	
	/**
	 * 聚合操作的数据类型
	 */
	@Override
	public StructType bufferSchema() {
		return bufferSchema;
	}

	@Override
	public boolean deterministic() {
		return deterministic;
	}
	
	/**
	 * 初始化
	 * 可以认为是，你自己在内部指定一个初始的值
	 */
	@Override
	public void initialize(MutableAggregationBuffer buffer) {
		buffer.update(0, "");  
	}
	
	/**
	 * 更新
	 * 可以认为是，一个一个地将组内的字段值传递进来
	 * 实现拼接的逻辑
	 */
	@Override
	public void update(MutableAggregationBuffer buffer, Row input) {
		// 缓冲中的已经拼接过的monitor信息小字符串
		String bufferMonitorInfo = buffer.getString(0);//|A=2|B=1
		// 刚刚传递进来的某个monitor信息
		String inputMonitorInfo = input.getString(0);
		
		String[] split = inputMonitorInfo.split("\\|");
		String monitorId = "";
		int addNum = 1;// 本批要累加的车辆数：没有写"=数字"时按1处理
		for (String currMonitorid : split) {
			if(currMonitorid.indexOf("=") != -1){// 形如"0001=20"拆出卡口ID和数量；形如"0001"只取卡口ID
				monitorId = currMonitorid.split("=")[0];
				addNum = Integer.parseInt(currMonitorid.split("=")[1]);
			}else{
				monitorId = currMonitorid;
			}
			String oldVS = StringUtils.getFieldFromConcatString(bufferMonitorInfo, "\\|", monitorId);
			if(oldVS == null) {// 缓冲串中还没有这个卡口：直接追加 "|卡口=数量"
				bufferMonitorInfo += "|"+monitorId+"="+addNum;
			}else{// 已有这个卡口：数量累加上去，实现"去重拼接"
				bufferMonitorInfo = StringUtils.setFieldInConcatString(bufferMonitorInfo, "\\|", monitorId, Integer.parseInt(oldVS)+addNum+"");
			}
			buffer.update(0, bufferMonitorInfo);  
		}
	}
	
	/**
	 * 合并
	 * update操作，可能是针对一个分组内的部分数据，在某个节点上发生的
	 * 但是可能一个分组内的数据，会分布在多个节点上处理
	 * 此时就要用merge操作，将各个节点上分布式拼接好的串，合并起来
	 * 
	 * 海淀区 建材城西路
	 * merge1:|0001=100|0002=20|0003=4
	 * merge2:|0001=200|0002=30|0003=3|0004=100
	 * 
	 * bufferMonitorInfo1 = 0001=300|0002=50|0003=7|0004=100
	 * 
	 * 
	 */
	@Override
	public void merge(MutableAggregationBuffer buffer1, Row buffer2) {
		//缓存中的monitor信息这个大字符串
		String bufferMonitorInfo1 = buffer1.getString(0);
		//传进来          
		String bufferMonitorInfo2 = buffer2.getString(0);

        // 等于是把buffer2里面的数据都拆开来更新
		for(String monitorInfo : bufferMonitorInfo2.split("\\|")) {
			Map<String, String> map = StringUtils.getKeyValuesFromConcatString(monitorInfo, "\\|");
			/**
			 * bufferMonitorInfo1 = 0001=300|0002=50|0003=7|0009=1000
			 */
			for (Entry<String, String> entry : map.entrySet()) {
				String monitor = entry.getKey();// 逐个卡口与本节点buffer1合并：同卡口数量相加，新卡口直接拼上
				int carCount = Integer.parseInt(entry.getValue());
				String oldVS = StringUtils.getFieldFromConcatString(bufferMonitorInfo1, "\\|", monitor);
				//当没有获取到本次monitor对应的值时
				if(oldVS == null) {
					if("".equals(bufferMonitorInfo1)) {
						//当第一次聚合的时候，没有初始的传进来的bufferMonitorInfo1，默认为""
						bufferMonitorInfo1 += monitor + "=" + carCount;
					} else {
						//当上一次传进来的字符串不包含本次的monitor时，就拼上
						bufferMonitorInfo1 += "|" + monitor + "=" + carCount;
					}
	 			}else{
	 				int oldVal = Integer.valueOf(oldVS);
	 				oldVal += carCount;
	 				bufferMonitorInfo1 = StringUtils.setFieldInConcatString(bufferMonitorInfo1, "\\|", monitor, oldVal+"");
	 			}
				buffer1.update(0, bufferMonitorInfo1);  
			}
		}
	}
	
	@Override
	public DataType dataType() {
		return dataType;
	}
	
	/**
	 * evaluate方法返回数据的类型要和dateType的类型一致，不一致就会报错
	 * 聚合完成后，直接把缓冲串作为最终结果返回
	 */
	@Override
	public Object evaluate(Row row) {  
		return row.getString(0);  
	}

}
