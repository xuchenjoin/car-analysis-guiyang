package com.lpssy.javaspark.core.actions;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
/**
 * Action_foreach：演示 action 算子 foreach 的用法。
 * 演示知识点：foreach 是 action——它会真正触发 Job，并在每个分区（Executor）上
 * 逐条遍历 RDD 元素；注意 println 打在 Executor 所在机器上，不一定出现在 Driver 控制台。
 * 数据来源：本地目录 ./data/words。
 * 结果去向：每条数据在其 Executor 上打印 “line is :xxx”。
 */
public class Action_foreach {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf();
        conf.setMaster("local").setAppName("foreach");
        JavaSparkContext sc = new JavaSparkContext(conf);
        JavaRDD<String> lines = sc.textFile("./data/words");
//        lines.foreach(new VoidFunction<String>() {
//            public void call(String s) throws Exception {
//                System.out.println("line is :"+s);
//            }
//        });
        lines.foreach((line)->System.out.println("line is :"+line));/* lambda 简写，等价于上面注释掉的匿名内部类 */

    }
}
