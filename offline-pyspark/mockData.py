# -*- coding: utf-8 -*-
# =============================================
# mockData.py —— 模拟过车数据生成器（交通版）
# 作用：随机生成卡口过车记录（供 pvuvTest.py 分析使用）
# 数据格式（tab 分隔）：日期  卡口ID  车牌号  区域  车辆类型  通行行为
# 运行：PyCharm 直接运行（默认输出 ./trafficdata）
#       或 python3 mockData.py <输出路径>
# =============================================
import os
import sys
import time
import random


def getPlateNumber():
    """生成随机车牌号（省份汉字 + 字母 + 5位数字字母）"""
    provinces = ['贵', '京', '沪', '粤', '川', '渝']
    letters = 'ABCDEFGHJK'
    plate = random.choice(provinces) + random.choice(letters)
    for i in range(5):
        plate += random.choice('0123456789ABCDEFGHJKLMNPQRSTUVWXYZ')
    return plate


def writeLogToFile(path, log):
    """把一行过车记录追加写入文件"""
    with open(path, 'a+') as f:
        f.writelines(log + '\n')


def mock(path):
    """随机生成一次过车记录：日期\t卡口ID\t车牌\t区域\t车型\t通行行为"""
    date = time.strftime('%Y-%m-%d')

    # 随机车牌
    plate = getPlateNumber()

    # 每辆车随机通过 1~10 次，每次随机一个卡口、车型和通行行为
    for j in range(0, random.randint(1, 10)):
        # 随机卡口（8 个卡口之一）
        monitor = 'monitor_%04d' % random.randint(1, 8)

        # 随机区域（贵阳 6 个区之一）
        areas = ['南明区', '云岩区', '花溪区', '乌当区', '白云区', '观山湖区']
        area = areas[random.randint(0, 5)]

        # 随机车辆类型
        car_types = ['小汽车', 'SUV', '货车', '公交车', '出租车', '摩托车', '面包车']
        car_type = car_types[random.randint(0, 6)]

        # 随机通行行为
        behaviors = ['直行', '左转', '右转', '掉头', '停车', '超速', '违停']
        behavior = behaviors[random.randint(0, 6)]

        # 按 tab 拼接一行完整过车记录
        oneInfo = date + '\t' + monitor + '\t' + plate + '\t' + area + '\t' + car_type + '\t' + behavior
        writeLogToFile(path, oneInfo)


if __name__ == '__main__':
    # 输出路径：默认 ./trafficdata，也可用命令行参数指定
    outputPath = sys.argv[1] if len(sys.argv) > 1 else "./trafficdata"

    # 重新生成前清空旧文件，避免重复运行导致数据堆积
    if os.path.exists(outputPath):
        os.remove(outputPath)

    # 生成 9999 辆车的过车记录
    for i in range(1, 10000):
        mock(outputPath)
