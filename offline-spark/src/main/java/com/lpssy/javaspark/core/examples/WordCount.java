package com.lpssy.javaspark.core.examples;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.*;
import scala.Tuple2;

import java.util.Arrays;
/**
 * WordCount：Spark Core 词频统计入门示例（Java 版）。
 * 演示知识点：Spark 编程的经典套路——textFile 读文件 → flatMap 切分压平 →
 * mapToPair 拼成 (单词,1) → reduceByKey 按单词聚合求和 → 交换键值后 sortByKey 降序排序。
 * 数据来源：本地目录 ./data/words（每行是用空格分隔的多个单词）。
 * 结果去向：collect() 拉回 Driver 后按词频降序打印（单词, 次数）到控制台。
 */
public class WordCount {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf();/* 创建 Spark 配置对象 */
        conf.setMaster("local").setAppName("wordcount");/* local=本地模式跑，应用名 wordcount */
        JavaSparkContext sc = new JavaSparkContext(conf);/* Spark 入口上下文，后续所有算子都通过它创建 RDD */
        JavaRDD<String> lines = sc.textFile("./data/words");/* 数据输入：把目录里每行文本读成一个字符串元素 */
        JavaRDD<String> words = lines.flatMap(line -> Arrays.asList(line.split(" ")).iterator());/* flatMap：按空格切词，再把多行结果压平成一个个独立单词 */
        JavaPairRDD<String, Integer> pairWords = words.mapToPair( word -> new Tuple2<>(word, 1));/* mapToPair：给每个单词记 1 次，变成 (单词,1) */
        JavaPairRDD<String, Integer> reduceResult = pairWords.reduceByKey((v1, v2) -> v1 + v2);/* reduceByKey：按相同单词分组求和，得到 (单词,总次数) */
        JavaPairRDD<Integer, String> transRDD = reduceResult.mapToPair(tp -> new Tuple2<>(tp._2, tp._1));/* 交换键值：把次数提到 key 的位置，才能“按次数”排序 */
        JavaPairRDD<String, Integer> result = transRDD.sortByKey(false).mapToPair(tp -> new Tuple2<>(tp._2, tp._1));/* sortByKey(false)=按次数降序排好，再把键值换回来 */
        /**
         * System.out::println 这种方式会报序列化问题，不要使用
         */
//        result.foreach(System.out::println);
        result.collect().forEach(System.out::println);/* action：collect 把全量结果拉回 Driver 再打印（示例数据量小才这样做） */



//        JavaRDD<String> words = lines.flatMap((FlatMapFunction<String, String>) line -> Arrays.asList(line.split(" ")).iterator());
//        JavaPairRDD<String, Integer> pairWords = words.mapToPair((PairFunction<String, String, Integer>) word -> new Tuple2<>(word, 1));
//        JavaPairRDD<String, Integer> reduceResult = pairWords.reduceByKey((Function2<Integer, Integer, Integer>) (v1, v2) -> v1 + v2);
//        JavaPairRDD<Integer, String> transRDD = reduceResult
//                    .mapToPair((PairFunction<Tuple2<String, Integer>, Integer, String>) tp -> new Tuple2<>(tp._2, tp._1));
//        JavaPairRDD<String, Integer> result = transRDD.sortByKey(false).mapToPair((PairFunction<Tuple2<Integer, String>, String, Integer>) tp -> new Tuple2<>(tp._2, tp._1));
//        result.foreach((VoidFunction<Tuple2<String,Integer>>) tp-> System.out.println(tp));
        sc.stop();/* 关闭 SparkContext，释放资源 */
    }
}
