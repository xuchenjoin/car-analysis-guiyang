# -*- coding: utf-8 -*-
# =============================================
# pvuvTest.py —— 交通卡口高频车辆分析（交通版）
# 作用：统计每个卡口过车次数最高的 Top3 车辆（高频车辆）
# 数据来源：mockData.py 生成的 ./trafficdata
# 数据格式（tab 分隔）：日期  卡口ID  车牌号  区域  车辆类型  通行行为
# 运行：PyCharm 直接运行（读取同目录 ./trafficdata）
# =============================================
import os
import sys

# 确保 Spark worker 与 driver 使用同一个 Python 解释器（避免版本不一致报错）
os.environ["PYSPARK_PYTHON"] = sys.executable
os.environ["PYSPARK_DRIVER_PYTHON"] = sys.executable

from pyspark import SparkConf, SparkContext


def getCarCardInfos(one):
    """统计单辆车的过车记录，返回 [(卡口, (车牌, 过车次数)), ...]"""
    plate = one[0]
    monitorIterable = one[1]
    monitorDic = {}
    for monitor in monitorIterable:
        if monitor in monitorDic:
            monitorDic[monitor] += 1
        else:
            monitorDic[monitor] = 1
    returnlist = []
    for monitor, count in monitorDic.items():
        returnlist.append((monitor, (plate, count)))
    return returnlist


def getTop3Car(one):
    """取每个卡口过车次数最高的 3 辆车"""
    monitor = one[0]
    plate_count_iterable = one[1]
    top3Info = ["", "", ""]
    for elem in plate_count_iterable:
        count = elem[1]
        for i in range(len(top3Info)):
            if top3Info[i] == "":
                top3Info[i] = elem
                break
            elif top3Info[i][1] < count:
                for j in range(2, i, -1):
                    top3Info[j] = top3Info[j-1]
                top3Info[i] = elem
                break
    return monitor, top3Info


def getTop3CarType(one):
    """[备用扩展] 统计每个卡口通行车辆的车型 Top3（当前主流程未使用）"""
    monitor = one[0]
    carTypeIterable = one[1]
    carTypeDic = {}
    for carType in carTypeIterable:
        if carType in carTypeDic:
            carTypeDic[carType] += 1
        else:
            carTypeDic[carType] = 1
    sortedlist = sorted(carTypeDic.items(), key=lambda x: x[1], reverse=True)
    returnlist = []
    if len(sortedlist) > 3:
        for i in range(0, 3):
            returnlist.append(sortedlist[i])
    else:
        returnlist = sortedlist

    return monitor, returnlist


if __name__ == '__main__':
    # ① 创建 Spark 运行环境（local 本地单机模式）
    conf = SparkConf()
    conf.setMaster("local")
    conf.setAppName("traffic_top3")
    sc = SparkContext(conf=conf)

    # ② 读取过车数据文件（tab 分隔，第2列=卡口ID，第3列=车牌号）
    lines = sc.textFile("./trafficdata")

    # ③ 统计每个卡口过车次数最高的 Top3 车辆
    #    流程：车牌+卡口 → 按车牌聚合 → 统计每车在各卡口的过车次数 → 按卡口聚合 → 取Top3
    plate_monitor = lines.map(lambda line: (line.split("\t")[2], line.split("\t")[1]))
    plate_monitor.groupByKey() \
        .flatMap(lambda one: getCarCardInfos(one)) \
        .groupByKey() \
        .map(lambda one: getTop3Car(one)) \
        .foreach(print)

# =============================================
# 其他维度统计示例（需要时取消对应注释即可使用）：
#   ① 每个卡口通行车型 Top3：见上方 getTop3CarType 函数
#      lines.map(lambda line: (line.split("\t")[1], line.split("\t")[4])).groupByKey() \
#           .map(lambda one: getTop3CarType(one)).foreach(print)
#   ② 卡口通行量 PV：lines.map(lambda line: (line.split("\t")[1], 1)) \
#        .reduceByKey(lambda v1, v2: v1 + v2).sortBy(lambda tp: tp[1], ascending=False).foreach(print)
#   ③ 卡口独立车辆数 UV：按 (卡口, 车牌) 去重后统计
#   ④ 区域通行量：按区域过滤后再统计
# =============================================
