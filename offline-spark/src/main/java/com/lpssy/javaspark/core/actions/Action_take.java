package com.lpssy.javaspark.core.actions;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;

import java.util.List;
/**
 * Action_take：演示 action 算子 take 的用法。
 * 演示知识点：take(n) 只取 RDD 前 n 个元素返回 Driver，不会把整个 RDD 算完，
 * 而是就近扫描少量分区凑够 n 条，常用于调试时“偷看几行数据”。
 * 数据来源：本地目录 ./data/words。
 * 结果去向：取到的前 3 行打印到 Driver 控制台。
 */
public class Action_take {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("take").setMaster("local");
        JavaSparkContext sc = new JavaSparkContext(conf);
        JavaRDD<String> lines = sc.textFile("./data/words");
        List<String> resultList = lines.take(3);/* take(3)：只拿前 3 条，返回普通 Java List（已回到 Driver） */

        for(String one:resultList){/* 在本机（Driver）遍历打印 */
            System.out.println(one);
        }


    }
}
