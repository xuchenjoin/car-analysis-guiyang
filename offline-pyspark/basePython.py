# -*- coding: utf-8 -*-
# =============================================
# basePython.py —— Spark 入门示例：车辆类型分布统计（WordCount 交通版）
# 作用：统计 car_types 文件中各车辆类型的出现次数
# 运行：PyCharm 直接运行（读取同目录 ./car_types）
# =============================================
import os
import sys

# 确保 Spark worker 与 driver 使用同一个 Python 解释器（避免版本不一致报错）
os.environ["PYSPARK_PYTHON"] = sys.executable
os.environ["PYSPARK_DRIVER_PYTHON"] = sys.executable

from pyspark import SparkConf, SparkContext

if __name__ == '__main__':
    # ① 创建 Spark 运行环境（local 本地单机模式）
    conf = SparkConf()
    conf.setMaster("local")
    conf.setAppName("car_type_wordcount")
    sc = SparkContext(conf=conf)

    # ② 读取数据文件（每行是空格分隔的车辆类型）
    lines = sc.textFile("./car_types")

    # ③ 拆分：把每行按空格拆分成一个个车辆类型
    words = lines.flatMap(lambda line: line.split(" "))

    # ④ 映射：每个车辆类型记为 (类型, 1)
    pairWords = words.map(lambda word: (word, 1))

    # ⑤ 聚合：相同类型累加 → 得到各车型出现次数（车型分布）
    result = pairWords.reduceByKey(lambda v1, v2: v1 + v2)

    # ⑥ 输出统计结果
    result.foreach(print)
