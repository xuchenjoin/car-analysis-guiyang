package com.spark.spark.test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;
import java.util.Set;

import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.*;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.StructType;

import com.lpssy.spark.util.DateUtils;
import com.lpssy.spark.util.StringUtils;


/**
 * 模拟数据  数据格式如下：
 * 
 *  日期	      卡口ID		     摄像头编号  	车牌号	       拍摄时间	              车速	             道路ID   	   区域ID
 * date	 monitor_id	 camera_id	 car	action_time		speed	road_id		area_id
 * 
 * monitor_flow_action
 * monitor_camera_info
 *
 * 【用途】本地模式(SPARK_LOCAL=true)下供 AreaTop3RoadFlowAnalyze 等作业调用，
 *         在内存中造好数据并注册成同名 SparkSQL 临时表，不依赖真实 Hive 环境即可调试。
 *
 * @author Administrator
 */
public class MockData {
    /**
     * 模拟22个卡口的贵阳地段流量权重（index 与 monitor_id 0000~0021 一一对应）
     * 市中心/大居住区/交通枢纽车流大、郊区车流小 → 各卡口流量呈现地段差异
     * 顺序与 realtime.html 中 MAP_NODES 保持一致
     */
    public static int[] MONITOR_WEIGHTS = {
        18,  // 0000 金融城   观山湖
        12,  // 0001 会展城   观山湖
        26,  // 0002 喷水池   云岩中心
        22,  // 0003 大十字   云岩
        24,  // 0004 火车站   南明
        30,  // 0005 花果园   南明（大盘）
        10,  // 0006 新添寨   乌当
        10,  // 0007 绿地联盛 白云南
        14,  // 0008 大学城   花溪
        20,  // 0009 贵阳北站 观山湖（枢纽）
        16,  // 0010 世纪城   观山湖（大盘）
        12,  // 0011 金阳客站 观山湖
        18,  // 0012 紫林庵   云岩
        14,  // 0013 头桥     云岩
        16,  // 0014 大营坡   云岩
        12,  // 0015 三桥     云岩
        14,  // 0016 油榨街   南明
        12,  // 0017 沙冲路   南明
        10,  // 0018 观水路   南明
        8,   // 0019 花溪公园 花溪
        10,  // 0020 贵州大学 花溪
        6    // 0021 振华广场 乌当
    };

    /**
     * 按地段流量权重随机挑选卡口编号（0~8）
     * 权重越大被选中的概率越高 → 对应地段车流量越大
     */
    public static int weightedMonitor(Random random) {
        int total = 0;
        for (int w : MONITOR_WEIGHTS) total += w;
        int r = random.nextInt(total);
        for (int i = 0; i < MONITOR_WEIGHTS.length; i++) {
            r -= MONITOR_WEIGHTS[i];
            if (r < 0) return i;
        }
        return MONITOR_WEIGHTS.length - 1;
    }

    /**
     * 工作日 24 小时过车流量权重（贴近真实交通规律）：
     * 早高峰 07-09 点、晚高峰 17-19 点双峰突出（权重 22）；白天 10-16 点平稳；
     * 夜间 23-05 点很低；凌晨 01-03 点最低（权重 1）
     * index 与小时 0~23 一一对应
     */
    public static int[] WORKDAY_HOUR_WEIGHTS = {1,1,1,1,2,3,6,16,22,16,10,9,9,8,8,8,10,16,22,16,9,5,2,1};

    /**
     * 周末 24 小时过车流量权重（与工作日不同）：
     * 早高峰推迟到 09-11 点且更平缓（权重 12-14）；白天全天分布均匀；
     * 晚间活动延长（19-22 点仍保持高位 13-16）
     */
    public static int[] WEEKEND_HOUR_WEIGHTS = {1,1,1,1,2,3,5,8,12,14,12,10,9,9,9,9,10,12,14,16,13,8,3,2};

    /**
     * 按日期选择对应的时段曲线：周六/周日(01-06/01-07)用周末曲线，其余为工作日曲线
     * （如需模拟节假日，可在此按日期范围扩展对应的节假日曲线）
     */
    public static int[] hourWeights(String date) {
        int day = Integer.parseInt(date.substring(8));
        return (day == 6 || day == 7) ? WEEKEND_HOUR_WEIGHTS : WORKDAY_HOUR_WEIGHTS;
    }

    /**
     * 按 24 小时流量权重随机取小时（0~23）：高峰时段被选中的概率高 → 双高峰形态
     */
    public static int weightedHour(Random random, int[] weights) {
        int total = 0;
        for (int w : weights) total += w;
        int r = random.nextInt(total);
        for (int i = 0; i < weights.length; i++) {
            r -= weights[i];
            if (r < 0) return i;
        }
        return 23;
    }

    /**
     * 模拟车速（贴近真实：市区道路 30~80 km/h 为主，快速路 80~120，少量超速）
     * 超速段（约占 5%）再分层：98% 集中在 120~159（高速常态超速），仅 2% 飙到 160~260（极少数超速狂飙），
     * 保证速度 Top10 呈现不同车速而非清一色上限值
     */
    public static String mockSpeed(Random random) {
        int p = random.nextInt(100);
        if (p < 45) return (30 + random.nextInt(31)) + "";   // 45% 市区缓行 30~60
        if (p < 75) return (60 + random.nextInt(21)) + "";   // 30% 市区通行 60~80
        if (p < 95) return (80 + random.nextInt(41)) + "";   // 20% 快速路 80~120
        if (random.nextInt(100) < 98) return (120 + random.nextInt(40)) + "";  // 超速中的 98%：120~159
        return (160 + random.nextInt(101)) + "";             // 超速中的 2%：160~260 极少数
    }

    public static void mock(JavaSparkContext sc, SparkSession spark) {// 生成5天(2024-01-03~01-07)×每天3000辆车的过车模拟数据注册为临时表monitor_flow_action，再据此生成卡口-摄像头对照表注册为monitor_camera_info
    	List<Row> dataList = new ArrayList<Row>();
    	Random random = new Random();

    	/**
    	 * 车牌分配：70% 贵阳本地贵A，10% 贵B（六盘水），8% 贵G（安顺），
    	 * 5% 贵W（外地临牌/公务），其余鲁/沪外地车，贴近贵阳真实构成
    	 */
    	String[] dates = new String[]{"2024-01-03","2024-01-04","2024-01-05","2024-01-06","2024-01-07"};

    	/**
    	 * 模拟3000个车辆，每个日期都生成一份
    	 */
    	for (String date : dates) {
    	for (int i = 0; i < 3000; i++) {
        	//模拟车牌号：70% 贵Axxxxx，其余外地牌
        	int pp = random.nextInt(100);
        	String car;
        	if (pp < 70) {
        	    car = "贵A" + StringUtils.fulfuill(5, random.nextInt(100000)+"");
        	} else if (pp < 80) {
        	    car = "贵B" + StringUtils.fulfuill(5, random.nextInt(100000)+"");
        	} else if (pp < 88) {
        	    car = "贵G" + StringUtils.fulfuill(5, random.nextInt(100000)+"");
        	} else if (pp < 93) {
        	    car = "贵W" + StringUtils.fulfuill(5, random.nextInt(100000)+"");
        	} else if (pp < 97) {
        	    car = "鲁" + (char)(65+random.nextInt(26)) + StringUtils.fulfuill(5, random.nextInt(100000)+"");
        	} else {
        	    car = "沪" + (char)(65+random.nextInt(26)) + StringUtils.fulfuill(5, random.nextInt(100000)+"");
        	}
        	
        	//baseActionTime 模拟24小时（按时段权重取起始小时：早晚高峰更集中、凌晨稀少）
        	String baseActionTime = date + " " + StringUtils.fulfuill(weightedHour(random, hourWeights(date))+"");//2024-01-03 01
        	/**
        	 * 这里的for循环模拟每辆车经过不同的卡扣不同的摄像头 数据。
        	 */
        	for(int j = 0 ; j < (random.nextInt(300)+1) ; j++){
        		//模拟每个车辆每被60个摄像头拍摄后 时间上累计加1小时（短窗口保留早晚高峰形态，避免双峰被时间扩散抹平）
        		if(j % 60 == 0 && j != 0){
        			 baseActionTime = date + " " + StringUtils.fulfuill(((Integer.parseInt(baseActionTime.split(" ")[1])+1) % 24)+"");//小时 +1 并取模防溢出（23点后归零，保证 0~23 合法）
        		}
        		
        		String areaId = StringUtils.fulfuill(2,random.nextInt(8)+1+"");//模拟areaId 【一共8个区域】
        		
        		String roadId = random.nextInt(50)+1+"";//模拟道路id 【1~50 个道路】
        		
        		String monitorId = StringUtils.fulfuill(4, weightedMonitor(random)+"");//按地段流量权重生成卡口ID（市中心大、郊区小），0补全4位
        		
        		String cameraId = StringUtils.fulfuill(5, random.nextInt(100000)+"");//模拟摄像头id cameraId
        		
        		String actionTime = baseActionTime + ":" 
        				+ StringUtils.fulfuill(random.nextInt(60)+"") + ":" 
        				+ StringUtils.fulfuill(random.nextInt(60)+"");//模拟经过此卡扣开始时间 ，如：2024-01-03 20:09:10
        		
        		String speed = mockSpeed(random);//模拟车速（市区 30~80 为主、快速路 80~120、少量超速）
        		
        		Row row = RowFactory.create(date,monitorId,cameraId,car,actionTime,speed,roadId,areaId);
        		dataList.add(row);
        	}
		}
    	}
    	
    	/**
    	 * 2023-4-20 1	22	贵A1234
    	 * 2023-4-20 1	23	贵A1234
    	 * 1 【22,23】
    	 * 1 【22,23,24】
    	 */
    	
    	JavaRDD<Row> rowRdd = sc.parallelize(dataList);
    	
    	StructType cameraFlowSchema = DataTypes.createStructType(Arrays.asList(
    			DataTypes.createStructField("date", DataTypes.StringType, true),
    			DataTypes.createStructField("monitor_id", DataTypes.StringType, true),
    			DataTypes.createStructField("camera_id", DataTypes.StringType, true),
    			DataTypes.createStructField("car", DataTypes.StringType, true),
    			DataTypes.createStructField("action_time", DataTypes.StringType, true),
    			DataTypes.createStructField("speed", DataTypes.StringType, true),
    			DataTypes.createStructField("road_id", DataTypes.StringType, true),
    			DataTypes.createStructField("area_id", DataTypes.StringType, true)
    			));

    	Dataset<Row> ds = spark.createDataFrame(rowRdd, cameraFlowSchema);
    	
    	//默认打印出来df里面的20行数据
    	System.out.println("----打印 车辆信息数据----");
		ds.show();
		ds.registerTempTable("monitor_flow_action");
 
    	/**
    	 * monitorAndCameras    key：monitor_id
    	 * 						value:hashSet(camera_id)
    	 * 基于生成的数据，生成对应的卡扣号和摄像头对应基本表
    	 */
    	Map<String,Set<String>> monitorAndCameras = new HashMap<>();
    	
    	int index = 0;
    	for(Row row : dataList){
    		//row.getString(1) monitor_id
    		Set<String> sets = monitorAndCameras.get(row.getString(1));
    		if(sets == null){
    			sets = new HashSet<>();
    			monitorAndCameras.put((String)row.getString(1), sets);
    		}
    		//这里每隔1000条数据随机插入一条数据，模拟出来标准表中卡扣对应摄像头的数据比模拟数据中多出来的摄像头。这个摄像头的数据不一定会在车辆数据中有。即可以看出卡扣号下有坏的摄像头。
    		//仅对卡扣 0000~0004 模拟异常摄像头，0005~0008 保持正常，用于演示"卡口状态检测"的正常/异常对比
    		index++;
    		String monitorIdTmp = row.getString(1);
    		if(index % 1000 == 0 && monitorIdTmp.compareTo("0004") <= 0){
    			sets.add(StringUtils.fulfuill(5, random.nextInt(100000)+""));
    		} 
    		//row.getString(2) camera_id
			String cameraId = row.getString(2);
			sets.add(cameraId);
    	}
    	
    	dataList.clear();
    	
    	Set<Entry<String,Set<String>>> entrySet = monitorAndCameras.entrySet();
    	for (Entry<String, Set<String>> entry : entrySet) {
    		String monitor_id = entry.getKey();
    		Set<String> sets = entry.getValue();
    		Row row = null;
    		for (String camera_id : sets) {
    			row = RowFactory.create(monitor_id,camera_id);
    			dataList.add(row);
			}
		}

    	StructType monitorSchema = DataTypes.createStructType(Arrays.asList(
	    			DataTypes.createStructField("monitor_id", DataTypes.StringType, true),
	    			DataTypes.createStructField("camera_id", DataTypes.StringType, true)
    			));
    	
    	
    	rowRdd = sc.parallelize(dataList);
    	Dataset<Row> monitorDF = spark.createDataFrame(rowRdd, monitorSchema);
    	monitorDF.registerTempTable("monitor_camera_info");
    	System.out.println("----打印 卡扣号对应摄像头号 数据----");
    	monitorDF.show();
    }
}














