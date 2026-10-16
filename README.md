# 智能交通大数据分析系统（贵阳本地学习版）

> 从数据采集、离线分析、实时计算到可视化大屏的完整交通大数据教学项目。基于 Apache Storm + Kafka + Spark + 百度地图，已改造为本地一键运行，演示数据迁移到贵阳。

![Storm](https://img.shields.io/badge/Storm-1.x-orange) ![Spark](https://img.shields.io/badge/Spark-2.x-red) ![Kafka](https://img.shields.io/badge/Kafka-0.10-blue) ![JDK](https://img.shields.io/badge/JDK-8-green) ![Tomcat](https://img.shields.io/badge/Tomcat-9-yellow)

原工程为华为云 MRS 示例 `storm-car-analysis-example`，本仓库在其基础上做了完整改造，整合了离线分析、实时计算和可视化大屏，适合学习大数据全链路。

---

## 效果展示

### 实时流量监控（百度地图）
![实时流量监控](docs/screenshots/high-traffic.png)

### 交通数据分析 BI 大屏
![BI大屏](docs/screenshots/bi-dashboard.png)

### 套牌车实时告警
![套牌车告警](docs/screenshots/fake-car.png)

### 车辆出行路径分析
![车辆路径分析](docs/screenshots/car-movement.png)

---

## 项目整体架构

```
┌──────────────────────────────────────────────────────────────┐
│                        数据源                                 │
│  卡口摄像头过车记录 (车牌/时间/经纬度/车速)                     │
│  monitor_camera_info (卡口信息表)                             │
│  monitor_flow_action (过车明细表)                             │
└──────────────────────────┬───────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                        ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│     离线分析层 (Spark)     │  │     实时计算层 (Storm)        │
│  traffic-spark/           │  │  carAnalysis/src/            │
│  - 车辆轨迹分析            │  │  - 套牌车实时检测             │
│  - 拥堵分析               │  │  - 实时流量统计               │
│  - 陌生车辆分析            │  │  - Kafka → Storm → Redis     │
│  - Hive 数仓               │  │                              │
│  offline-spark/ (Spark学习)│  │                              │
│  offline-pyspark/ (PySpark)│  │                              │
└──────────────┬───────────┘  └──────────────┬───────────────┘
               │                             │
               └──────────────┬──────────────┘
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                      可视化展示层                              │
│                                                              │
│  carAnalysis/hccDemo/  → 百度地图 Web 大屏 (Tomcat+AngularJS) │
│  bi-dashboard/         → 交通数据 BI 可视化大屏 (纯 HTML)      │
│  vehicle-platform/     → 车辆综合管控平台 (纯 HTML)            │
└──────────────────────────────────────────────────────────────┘
```

---

## 目录结构（每个模块干什么）

```
car-analysis-guiyang/
│
├── 📡 carAnalysis/  (本目录) — 实时分析 Web 大屏
│   ├── hccDemo/                 # Tomcat 部署的 Web 应用
│   │   ├── index.html           # 入口
│   │   ├── lib/baidu/map.js    # 百度地图封装（含贵阳62个路口坐标）
│   │   └── src/app/dataAccess/controllers/
│   │       ├── fakeCarCtrl.js        # 套牌车告警页面
│   │       ├── highTrafficCtr.js     # 实时流量 TOP10
│   │       ├── carMovementCtrl.js    # 车辆路径分析
│   │       └── trafficStaticsCtrl.js # 卡口流量统计
│   ├── src/main/java/          # Storm Topology 实时计算代码
│   │   ├── SearchXCarTopology.java   # 套牌车检测拓扑
│   │   ├── SearchCarSumTopology.java # 流量统计拓扑
│   │   └── KafkaUtils.java           # Kafka 连接
│   └── detail-records/         # 离线过车明细数据 (9天CSV, ~28MB)
│
├── ⚙️ traffic-spark/ — Spark 离线分析主项目
│   ├── src/main/java/com/lpssy/spark/
│   │   ├── dao/               # 数据访问层 (卡口/车辆/轨迹 DAO)
│   │   ├── util/              # Spark/日期/参数工具类
│   │   └── producedate2hive/  # 数据导入 Hive
│   ├── monitor_camera_info    # 卡口信息数据 (卡口ID, 编号)
│   ├── monitor_flow_action    # 过车明细 (日期,卡口ID,车道,车牌,时间,速度...)
│   └── pom.xml                # Maven 构建
│
├── 📚 offline-spark/ — Spark 学习示例 (Java + Scala)
│   └── src/main/
│       ├── java/com/lpssy/javaspark/
│       │   ├── core/examples/    # WordCount, TopN 等基础示例
│       │   ├── actions/          # RDD action 算子
│       │   ├── sql/              # Spark SQL + Hive
│       │   └── streaming/        # Spark Streaming + Kafka → Redis
│       └── Scala/com/lpssy/scalaspark/
│           └── core/transformations/  # map/flatMap/reduceByKey 等算子
│
├── 🐍 offline-pyspark/ — PySpark 脚本
│   ├── mockData.py            # 模拟交通数据生成
│   ├── basePython.py          # Python 基础练习
│   ├── pvuvTest.py            # PV/UV 统计
│   ├── trafficdata/           # 交通测试数据
│   └── car_types/             # 车型分类数据
│
├── 📊 bi-dashboard/ — 交通数据 BI 可视化大屏 (纯 HTML)
│   ├── index.html             # BI 大屏首页 (车辆统计/类型/收费/抓拍)
│   ├── realtime.html          # 实时数据大屏
│   ├── login.html             # 登录页
│   ├── css/ js/ images/      # ECharts 图表 + 暗黑主题
│   └── picture/               # 背景图素材
│
└── 🚗 vehicle-platform/ — 车辆综合管控平台 (纯 HTML)
    ├── index.html             # 管控平台主界面
    ├── css/ js/ images/      # 地图 + 车辆列表 + 管控操作
    └── picture/               # 素材图片
```

---

## 四大可视化页面

### 1. 实时流量监控（百度地图）
- 路径：`hccDemo/` → Tomcat 部署
- 功能：TOP10 卡口实时车流量排行，地图上绿色点 = 卡口位置
- 技术：AngularJS 1.x + 百度地图 JS API

### 2. 套牌车实时告警
- 路径：`hccDemo/#/fakeCar/map`
- 功能：同一车牌短时间出现在远距离两个卡口 → 套牌车告警
- 左侧列表显示嫌疑车牌和两个出现位置

### 3. 车辆出行路径分析
- 路径：`hccDemo/#/carMovement/map`
- 功能：高频 OD（起点→终点）路径连线，线条粗细代表车次

### 4. BI 数据大屏
- 路径：直接打开 `bi-dashboard/index.html`
- 功能：车辆总数柱状图、车型饼图、收费站统计、抓拍趋势线
- 技术：ECharts + 暗黑科技风，无需后端

---

## 数据说明

### 过车明细数据 (monitor_flow_action)
```
日期      卡口ID  车道  车牌       时间              速度  方向  颜色
2024-05-28  0003  36200  粤B38678  2024-05-28 12:46:50  98   43   04
```

### 卡口信息数据 (monitor_camera_info)
```
卡口ID   卡口编号
0006    66210
0006    93833
```

### 离线测试数据 (detail-records/)
9 天的完整过车轨迹 CSV，每行一条记录：
```
卡口ID,车牌,纬度,经度,车速,方向,?,时间
xiezhi1000006,贵A6CU11,30.581955,114.315308,65,315,,2024-01-01 08:00:07
```

---

## 本地运行

### 1. 实时 Web 大屏（hccDemo）
```bash
# 需要 JDK 8 + Tomcat 9
ln -s $(pwd)/hccDemo /opt/homebrew/opt/tomcat@9/libexec/webapps/hccDemo
/opt/homebrew/opt/tomcat@9/libexec/bin/catalina.sh run
# 打开 http://localhost:8080/hccDemo/
```

### 2. BI 大屏 / 车辆管控平台
直接用浏览器打开 HTML 文件即可，无需后端：
```bash
open bi-dashboard/index.html
open vehicle-platform/index.html
```

### 3. Spark 离线分析
```bash
cd traffic-spark
mvn package
# 将 monitor_flow_action 和 monitor_camera_info 放到 HDFS
# 运行 DAO 层各 Spark 任务
```

---

## 学习要点

| 技术 | 在项目中的位置 |
|------|---------------|
| **Storm 实时计算** | `carAnalysis/src/` — Spout/Bolt 拓扑，套牌车检测 |
| **Kafka 消息队列** | `carAnalysis/src/` — 高吞吐过车数据接入 |
| **Spark 离线分析** | `traffic-spark/` — DAO 层 + Spark SQL 轨迹分析 |
| **Spark 算子学习** | `offline-spark/` — Java/Scala 版 RDD 算子示例 |
| **PySpark** | `offline-pyspark/` — Python 版数据处理脚本 |
| **ECharts 可视化** | `bi-dashboard/` — 暗黑科技风数据大屏 |
| **百度地图 API** | `hccDemo/lib/baidu/` — Marker/CurveLine/信息窗 |
| **AngularJS 1.x** | `hccDemo/` — UI Router + RequireJS |

---

## 免责声明

- 本项目仅供学习参考，地图数据 © 百度智图
- 原工程版权归华为技术有限公司，基于 Apache 2.0 协议
- 改造部分（贵阳数据、整合、文档）以 MIT 协议发布
