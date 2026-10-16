package com.lpssy.javaspark.core.examples;

import org.apache.commons.collections.IteratorUtils;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.PairFunction;
import org.apache.spark.api.java.function.VoidFunction;
import scala.Tuple2;

import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
/**
 * TopN2：求每个班级成绩前三名的改进版示例。
 * 演示知识点：与 TopN 同样的 groupByKey 分组，但不把全班成绩全装进 List 排序，
 * 而是用一个长度为 3 的数组 top3Score“在线维护 Top3”——来一个分数就和现有名次比较，
 * 更大就后移插入。好处是内存占用恒定 O(3)，不必整组加载。
 * 数据来源：本地文件 ./data/scores.txt，每行“班级名<Tab>分数”。
 * 结果去向：按班级打印 className 和维护出的 Top3 分数到控制台。
 */
public class TopN2 {
    public static void main(String[] args) {
        SparkConf conf =new SparkConf();
        conf.setMaster("local");
        conf.setAppName("topn");
        JavaSparkContext sc = new JavaSparkContext(conf);
        JavaRDD<String> lines = sc.textFile("./data/scores.txt");/* 读取成绩文件 */
        JavaPairRDD<String, Integer> pairInfo = lines.mapToPair(new PairFunction<String, String, Integer>() {
            @Override
            public Tuple2<String, Integer> call(String line) throws Exception {
                return new Tuple2<String, Integer>(line.split("\t")[0], Integer.valueOf(line.split("\t")[1]));/* 按 Tab 切成 (班级, 分数) */
            }
        });

        pairInfo.groupByKey().foreach(new VoidFunction<Tuple2<String, Iterable<Integer>>>() {/* 按班级分组，foreach 里逐组维护 Top3 */
            @Override
            public void call(Tuple2<String, Iterable<Integer>> tp) throws Exception {
                String className = tp._1;/* 班级名 */
                Iterator<Integer> iter = tp._2.iterator();/* 直接用迭代器逐条取数，不整组转 List */

                Integer[] top3Score = new Integer[3];/* 长度 3 的数组，始终保持第 0、1、2 名，空位为 null */
                while(iter.hasNext()){
                    Integer currScore = iter.next();/* 取下一个分数 */
                    for(int i =0;i<3;i++){/* 依次和第 1、2、3 名比较 */
                        if(top3Score[i]==null){
                            top3Score[i] = currScore;/* 该名次还空着：直接占坑 */
                            break;
                        }else if(currScore>top3Score[i]){
                            for(int j = 2;j>i;j--){
                                top3Score[j]=top3Score[j-1];/* 比第 i 名大：把 i 及之后的名次整体后挪一格 */
                            }
                            top3Score[i] = currScore;/* 把当前分数顶到第 i 名 */
                            break;
                        }
                    }
                }

                System.out.println("className = "+className);
                for (Integer score :top3Score){/* 打印最终维护出的前三名（人数不足时后面几位是 null） */
                    System.out.println("score = "+score);
                }

            }
        });

    }
}
