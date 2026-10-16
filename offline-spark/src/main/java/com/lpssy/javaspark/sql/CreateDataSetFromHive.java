package com.lpssy.javaspark.sql;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
//-server -Xms512M -Xmx1024M -XX:PermSize=256M -XX:MaxNewSize=512M -XX:MaxPermSize=512M
/**
 * CreateDataSetFromHive：演示 Spark SQL 如何连接外置 Hive 元数据仓库并执行 HiveQL。
 * 演示知识点：用 SparkSession.builder() + enableHiveSupport() 开启 Hive 支持，
 * 通过 hive.metastore.uris 连到远程 Hive Metastore，之后就能用 spark.sql() 访问 Hive 里已建好的表。
 * 数据来源：远程 Hive（Metastore: thrift://c7node1:9083）中的 src 表。
 * 结果去向：执行 SELECT * FROM src，结果封装成 Dataset<Row>；本示例没有 show()，只做取数演示。
 */
public class CreateDataSetFromHive {
    public static void main(String[] args) {
        SparkSession spark = SparkSession/* 链式构建 SQL 入口 SparkSession */
                .builder()
                .appName("JavaSparkHive")
//                .master("local")
//                .config("spark.sql.warehouse.dir", warehouseLocation)
                .config("hive.metastore.uris","thrift://c7node1:9083")/* 指定远程 Hive Metastore 地址，找到 Hive 里已登记的表 */
                .enableHiveSupport()/* 开启 Hive 支持，才能读写 Hive 表 */
                .getOrCreate();

//        spark.sql("CREATE TABLE IF NOT EXISTS src (key INT, value STRING) USING hive");
//        spark.sql("LOAD DATA LOCAL INPATH 'examples/src/main/resources/kv1.txt' INTO TABLE src");
        Dataset<Row> sql = spark.sql("SELECT * FROM src");/* 执行 HiveQL 查 Hive 表 src，结果是分布式 Dataset<Row>（即 DataFrame） */
//                sql.show();
    }
}
