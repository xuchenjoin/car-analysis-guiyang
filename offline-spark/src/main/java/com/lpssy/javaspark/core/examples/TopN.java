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
import java.util.List;
/**
 * TopN：求每个班级成绩前三名（Java 匿名内部类写法）。
 * 演示知识点：mapToPair 把每行解析成 (班级,分数) → groupByKey 按班级分组 →
 * 在 foreach 里把全班成绩装进 List 做 JDK 降序排序后取前 3。
 * 注意这是“整组加载进内存再排序”的朴素写法，TopN2 给出了常量内存的改进思路。
 * 数据来源：本地文件 ./data/scores.txt，每行格式为“班级名<Tab>分数”。
 * 结果去向：按班级打印 className 和该班前 3 名分数到控制台。
 */
public class TopN {
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
        });/* mapToPair 结束：此时已得到 (班级,分数) 集合 */

        pairInfo.groupByKey().foreach(new VoidFunction<Tuple2<String, Iterable<Integer>>>() {/* groupByKey 按班级分组，foreach 是 action，逐班级执行下面的 call */
            @Override
            public void call(Tuple2<String, Iterable<Integer>> tp) throws Exception {
                String className = tp._1;/* 班级名 */
                List<Integer> scoreList = IteratorUtils.toList(tp._2.iterator());/* 把该班分数迭代器整体转成 List，才能用 JDK 排序 */
                Collections.sort(scoreList, new Comparator<Integer>() {/* 对全班分数排序 */
                    @Override
                    public int compare(Integer o1, Integer o2) {
                        return o2-o1;/* 返回 o2-o1 即降序，大分数排前面 */
                    }
                });/* JDK 降序排序结束 */

                if(scoreList.size()>3){/* 按人数分两种情况打印前 3 名 */
                    System.out.println("className = "+className);
                    for(int i =0 ;i<3;i++){/* 人数多于 3：只打印降序后的前 3 个 */
                        System.out.println("Socre = "+scoreList.get(i));
                    }
                }else{
                    System.out.println("className = "+className);
                    for(int i =0 ;i<scoreList.size();i++){/* 人数不足 3：全部打印，避免数组越界 */
                        System.out.println("Socre = "+scoreList.get(i));
                    }
                }

            }
        });

    }
}
