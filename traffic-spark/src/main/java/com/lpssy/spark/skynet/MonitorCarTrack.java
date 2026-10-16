package com.lpssy.spark.skynet;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.PairFunction;
import org.apache.spark.api.java.function.VoidFunction;
import org.apache.spark.broadcast.Broadcast;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SQLContext;

import com.alibaba.fastjson.JSONObject;
import com.lpssy.spark.conf.ConfigurationManager;
import com.lpssy.spark.constant.Constants;
import com.lpssy.spark.dao.ITaskDAO;
import com.lpssy.spark.dao.factory.DAOFactory;
import com.lpssy.spark.domain.Task;
import com.lpssy.spark.util.DateUtils;
import com.lpssy.spark.util.ParamUtils;
import com.lpssy.spark.util.SparkUtils;
import com.spark.spark.test.MockData;

import org.apache.spark.sql.SparkSession;
import scala.Tuple2;

/*
 * 车辆行驶轨迹还原（单独运行的 Spark 任务入口）。
 * 思路：先找出"经过过指定卡口 0001"的所有车牌，再取出这些车的全部过车记录，
 *      按每辆车分组、按通过时间先后排序，把途经的卡口号用 "-->" 串成一条轨迹链。
 * 输入：Hive 表 monitor_flow_action（卡口过车流水，本地用 MockData 造的临时表）。
 * 输出：控制台打印 "车牌 : 0002-->0003-->0007..." 轨迹，本类不落库。
 * 下面是程序打印出来的轨迹样例（车牌 : 按时间排好序的卡口号链）：
京F88622	: 0006-->0003-->0008-->0006-->0001-->0008-->0007-->0000-->0007-->0001-->0002-->0004-->0006-->0005-->0005-->0003-->0007-->0000-->0004-->0001-->0001-->0004
深E66902	: 0007-->0007-->0004-->0005-->0005-->0001-->0004-->0003-->0007
京W11471	: 0007-->0007-->0001-->0006-->0001-->0005-->0003-->0007-->0001-->0003-->0006-->0008-->0006-->0005-->0003-->0002-->0000-->0006-->0006-->0003-->0000-->0000-->0004-->0000-->0005-->0003-->0001-->0000-->0000-->0000-->0000-->0007-->0000-->0000-->0008
京C49161	: 0001-->0007-->0004-->0003-->0001-->0008-->0007-->0001-->0007-->0004-->0002-->0004-->0005-->0002-->0005-->0006-->0004-->0003-->0001-->0000-->0000-->0002-->0008-->0005-->0007-->0007-->0000

 */
public class MonitorCarTrack {

    public static void main(String[] args) {

        /**
         * 判断应用程序是否在本地执行
         */
        JavaSparkContext sc = null;
        SparkSession spark = null;
        Boolean onLocal = ConfigurationManager.getBoolean(Constants.SPARK_LOCAL);

        if(onLocal){
            // 构建Spark运行时的环境参数
            SparkConf conf = new SparkConf()
                    .setAppName(Constants.SPARK_APP_NAME)
//			.set("spark.sql.shuffle.partitions", "300")
//			.set("spark.default.parallelism", "100")
//			.set("spark.storage.memoryFraction", "0.5")
//			.set("spark.shuffle.consolidateFiles", "true")
//			.set("spark.shuffle.file.buffer", "64")
//			.set("spark.shuffle.memoryFraction", "0.3")
//			.set("spark.reducer.maxSizeInFlight", "96")
//			.set("spark.shuffle.io.maxRetries", "60")
//			.set("spark.shuffle.io.retryWait", "60")
//			.set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
//			.registerKryoClasses(new Class[]{SpeedSortKey.class})
                    ;
            /**
             * 设置spark运行时的master  根据配置文件来决定的
             */
            conf.setMaster("local");
            sc = new JavaSparkContext(conf);

            spark = SparkSession.builder().getOrCreate();
            /**
             * 基于本地测试生成模拟测试数据，如果在集群中运行的话，直接操作Hive中的表就可以
             * 本地模拟数据注册成一张临时表
             * monitor_flow_action	数据表：监控车流量所有数据
             * monitor_camera_info	标准表：卡扣对应摄像头标准表
             */
            MockData.mock(sc, spark);
        }else{
            System.out.println("++++++++++++++++++++++++++++++++++++++开启hive的支持");
            spark = SparkSession.builder().enableHiveSupport().getOrCreate();
            spark.sql("use traffic");
        }

//        SparkConf sparkConf = new SparkConf().setAppName(Constants.SPARK_APP_NAME);
//        SparkUtils.setMaster(sparkConf);
//
//        JavaSparkContext sc = new JavaSparkContext(sparkConf);
//        SparkSession spark = SparkUtils.getSQLContext(sc);
//
//        if (ConfigurationManager.getBoolean(Constants.SPARK_LOCAL)) {
//            MockData.mock(sc, spark);
//        } else {
//            spark.sql("use traffic");
//        }




        long taskId = ParamUtils.getTaskIdFromArgs(args, Constants.SPARK_LOCAL_TASKID_MONITOR);
        if (taskId == 0L) {
            System.out.println("args is null");
            System.exit(-1);
        }

        ITaskDAO taskDAO = DAOFactory.getTaskDAO();
        Task task = taskDAO.findTaskById(taskId);

        if (task == null) {
            System.exit(-1);
        }
        // 处理从task表中获得的参数
        JSONObject taskParamsJsonObject = JSONObject.parseObject(task.getTaskParams());

        // 获得row类型的RDD : 2018-01-23	0001	91631	京U16332	2018-01-23 00:27:58	202	5	06
        JavaRDD<Row> cameraRDD = SparkUtils.getCameraRDDByDateRange(spark, taskParamsJsonObject);
        cameraRDD.cache();

        // 获取map类型RDD: monitorID -> car       0001 : 京U16332
        JavaPairRDD<String, String> monitor2CarRDD = getMonitor2CarRDD(cameraRDD);

        // 过滤掉monitorId不等于0001的数据 0001 : 京U16332
        JavaPairRDD<String, String> filteredMonitor2CarRDD = getFilteredMonitor2CarRDD(monitor2CarRDD);

        // 去掉monitorId, 只保留car  京U16332
        JavaRDD<String> carRDD = getCarRDD(filteredMonitor2CarRDD);

        // 去重，然后获得car到集合中  [京U16332,京U16332...]
        List<String> carList = carRDD.distinct().collect();

        // 使得executor端能够获得carList
        final Broadcast<List<String>> carListBroadcast = sc.broadcast(carList);

        // print the reuslt
        // carList.forEach(System.out::println);

        // 开启另一条支线
        // 获得map类型RDD: car -> row   京U16332 : 2018-01-23	0001	91631	京U16332	2018-01-23 00:27:58	202	5	06
        JavaPairRDD<String, Row> car2RowRDD = getCar2RowRDD(cameraRDD);

        // 保留 0001卡扣下通过车辆的 信息
        JavaPairRDD<String, Row> filterCar2RowRDD = getFilteredCar2RowRDD(car2RowRDD, carListBroadcast);

        // car相同的放在一组中
        JavaPairRDD<String, Iterable<Row>> car2RowsRDD = filterCar2RowRDD.groupByKey();

        // 按时间排序，获得car -> monitor_ids   京U53611	: 0002-->0003-->0007-->0001-->0008-->0005-->0003-->0004-->0003
        JavaPairRDD<String, String> car2MonitorsRDD = getCar2MonitorsRDD(car2RowsRDD);

        // 打印结果
       car2MonitorsRDD.foreach(new VoidFunction<Tuple2<String, String>>() {
            /**
		 *
		 */
		private static final long serialVersionUID = 1L;

			@Override
            public void call(Tuple2<String, String> stringStringTuple2) throws Exception {
                String carId = stringStringTuple2._1;
                String track = stringStringTuple2._2;
                System.out.println(carId + "\t: " + track);
            }
        });
    }
/**
     * 轨迹拼接核心：输入 (车牌, [该车所有过车行])，输出 (车牌, "0002-->0003-->0007") 轨迹链。
     * 组内先按通过时间 action_time 升序排序，再依次把卡口号拼起来，最后去掉末尾多余的 "-->"。
     */
    private static JavaPairRDD<String, String> getCar2MonitorsRDD(JavaPairRDD<String, Iterable<Row>> car2RowsRDD) {
        return car2RowsRDD.mapToPair(new PairFunction<Tuple2<String,Iterable<Row>>, String, String>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Tuple2<String, String> call(Tuple2<String, Iterable<Row>> stringIterableTuple2) throws Exception {
                String carId = stringIterableTuple2._1;
                Iterator<Row> iter = stringIterableTuple2._2.iterator();
                List<Row> rows = new ArrayList<>();
                while (iter.hasNext()) {
                    rows.add(iter.next());//把迭代器里的过车行装进 List，方便内存内排序
                }

                Collections.sort(rows, new Comparator<Row>() {//按通过时间从早到晚排，轨迹才有先后顺序
                    @Override
                    public int compare(Row o1, Row o2) {
                        if (DateUtils.before(o1.getAs("action_time")+"", o2.getAs("action_time")+"")) {
                            return -1;
                        } else
                            return 1;
                    }
                });
                StringBuilder stringBuilder = new StringBuilder();
                for (Row row : rows) {
                    stringBuilder.append((String)row.getAs("monitor_id"));//依次把卡口号追加进轨迹
                    stringBuilder.append("-->");
                }
                return new Tuple2<>(carId, stringBuilder.substring(0, stringBuilder.length() - 3));//截掉最后多拼的一个 "-->"
            }
        });
    }
/**
     * 用广播变量过滤：只保留"经过过 0001 卡口"的那些车辆的全部过车记录。
     * carList 是小集合，广播到每个 Executor 后本地 contains 判断，避免 shuffle。
     */
    private static JavaPairRDD<String, Row> getFilteredCar2RowRDD(JavaPairRDD<String, Row> car2RowRDD, final Broadcast<List<String>> carListBroadcast) {
        return car2RowRDD.filter(new Function<Tuple2<String, Row>, Boolean>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Boolean call(Tuple2<String, Row> v1) throws Exception {
                String carId = v1._1;
                List<String> carList = carListBroadcast.value();//从广播变量取出"经过0001"的车牌白名单
                return carList.contains(carId);//车牌在白名单里才保留
            }
        });
    }
/**
     * 把过车行转成 (车牌, 整行记录)，后面要按车牌分组还原轨迹。
     */
    private static JavaPairRDD<String, Row> getCar2RowRDD(JavaRDD<Row> cameraRDD) {
        return cameraRDD.mapToPair(new PairFunction<Row, String, Row>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Tuple2<String, Row> call(Row row) throws Exception {
                return new Tuple2<>((String)row.getAs("car"), row);
            }
        });
    }
/**
     * 丢弃卡口号，只取车牌这一列，得到纯车牌 RDD。
     */
    private static JavaRDD<String> getCarRDD(JavaPairRDD<String, String> monitor2CarRDD) {
        return monitor2CarRDD.map(new Function<Tuple2<String, String>, String>() {
            private static final long serialVersionUID = 1L;
            @Override
            public String call(Tuple2<String, String> v1) throws Exception {
                return v1._2;//只要 value（车牌），丢掉 key（卡口号）
            }
        });
    }
/**
     * 过滤出卡口号等于 0001 的记录：这些就是"经过过 0001 卡口"的车。
     */
    private static JavaPairRDD<String,String> getFilteredMonitor2CarRDD(JavaPairRDD<String, String> monitor2CarRDD) {
        return monitor2CarRDD.filter(new Function<Tuple2<String, String>, Boolean>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Boolean call(Tuple2<String, String> v1) throws Exception {
                return v1._1.equals("0001");//key 是卡口号，只保留 0001
            }
        });
    }
/**
     * 把过车行转成 (卡口号, 车牌)，即 0001 -> 京U16332 这种映射。
     */
    private static JavaPairRDD<String, String> getMonitor2CarRDD(JavaRDD<Row> cameraRDD) {
        JavaPairRDD<String, String> monitor2CarRDD = cameraRDD.mapToPair(new PairFunction<Row, String, String>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Tuple2<String, String> call(Row row) throws Exception {
                return new Tuple2<>((String)row.getAs("monitor_id"), (String)row.getAs("car"));
            }
        });
        return monitor2CarRDD;
    }
}
