# 智能交通大数据分析系统（贵阳本地版）

基于 Apache Storm + Kafka + 百度地图 的实时交通大数据分析演示系统。
原工程为华为云 MRS 官方示例 `storm-car-analysis-example`，本仓库已改造为**本地一键运行**的学习版本，并将演示数据从上海迁移到了贵州贵阳。

![Storm](https://img.shields.io/badge/Storm-1.x-orange) ![Kafka](https://img.shields.io/badge/Kafka-0.10-blue) ![JDK](https://img.shields.io/badge/JDK-8-red) ![Tomcat](https://img.shields.io/badge/Tomcat-9-green)

---

## 一、系统功能

| 模块 | 说明 |
|------|------|
| 🚨 套牌车实时告警 | 同一车牌短时间内出现在距离过远的两个卡口，判定为套牌车 |
| 📊 观测点实时流量监控 | TOP10 卡口实时车流量排行，红/橙/绿三色热度条 |
| 🛣️ 卡口流量分析 | 按时间统计各卡口流量趋势 |
| 🗺️ 车辆出行路径分析 | 高频 OD（起点-终点）路径连线，线条粗细代表车次 |

地图上每个绿色圆点 = 一个卡口（摄像头），红/橙线条 = 高频出行路径。

---

## 二、系统架构

```
┌─────────────┐    ┌──────────┐    ┌──────────────────┐
│  模拟车流量  │ →  │  Kafka   │ →  │  Storm Topology   │
│  (生产者)    │    │ 消息队列  │    │ 实时计算/套牌检测 │
└─────────────┘    └──────────┘    └────────┬─────────┘
                                            │
                                            ▼
                                     ┌──────────────┐
                                     │  Web UI      │
                                     │  (Tomcat +   │
                                     │   AngularJS) │
                                     │  百度地图可视化│
                                     └──────────────┘
```

- **Storm Topology**：`src/main/java/` 下的 Java 代码，做流式计算
- **Web UI**：`hccDemo/` 目录，AngularJS 1.x + 百度地图 JS API
- **本地模式**：无需 Kafka/Storm 集群，后端直接返回内置假数据（`use.dummy.data=true`）

---

## 三、本地快速启动（5 分钟）

### 环境要求
- macOS / Linux
- JDK 8（Corretto / OpenJDK 均可）
- Tomcat 9（**不要用 Tomcat 10+**，本项目用 `javax.servlet` 老 API）

### 步骤

```bash
# 1. 克隆
git clone https://github.com/<your-name>/carAnalysis.git
cd carAnalysis/hccDemo

# 2. 软链到 Tomcat webapps（按你本机路径改）
ln -s $(pwd) /opt/homebrew/opt/tomcat@9/libexec/webapps/hccDemo

# 3. 确认假数据模式已开启
cat WEB-INF/classes/app.conf | grep use.dummy.data
# 应显示 use.dummy.data=true

# 4. 启动 Tomcat
export JAVA_HOME=/path/to/jdk8
/opt/homebrew/opt/tomcat@9/libexec/bin/catalina.sh run
```

浏览器打开：

| 页面 | URL |
|------|-----|
| 首页 | http://localhost:8080/hccDemo/ |
| 套牌车告警 | http://localhost:8080/hccDemo/#/fakeCar/map |
| 实时流量监控 | http://localhost:8080/hccDemo/#/highTraffic/map |
| 卡口流量分析 | http://localhost:8080/hccDemo/#/trafficStat/map |
| 车辆路径分析 | http://localhost:8080/hccDemo/#/carMovement/map |

---

## 四、关键改造点（相对于原版华为云示例）

原版依赖内网 Kafka/Storm 集群（192.168.133.131），本地完全跑不起来。本仓库改造：

1. **启用假数据模式**：`WEB-INF/classes/app.conf` 设 `use.dummy.data=true`，跳过 Kafka 直接返回测试数据
2. **地图容器修复**：原版 Angular UI Router + tiny-layout 把地图容器裁剪成约 260×260，改为 body 下全屏 `#fullscreen-map` div
3. **数据迁移到贵阳**：
   - 62 个贵阳真实路口坐标（云岩/南明/观山湖/花溪/白云/乌当）
   - 路径起点终点映射到贵阳真实地标（喷水池、大十字、甲秀楼、花果园、贵阳北站、观山湖公园、花溪公园、青岩古镇等）
   - 左上角城市标签从"上海"改为"贵阳"
4. **去除华为云标识**：删除"华为云首页"链接、"购买 MRS"红色按钮、华为版权信息
5. **修复选中 tab 双层边框**（蓝色 outline + 红色下边框）

---

## 五、目录结构

```
carAnalysis/
├── pom.xml                  # Maven 构建（Storm Topology）
├── src/main/java/           # Storm 实时计算代码
├── hccDemo/                 # Web UI（可部署 WAR 目录）
│   ├── index.html           # 入口页
│   ├── main.js              # RequireJS 配置
│   ├── lib/baidu/map.js     # 地图封装（含贵阳坐标映射）
│   ├── src/app/
│   │   ├── framework/views/menus.html        # 顶部导航
│   │   └── dataAccess/controllers/           # 各页面控制器
│   │       ├── fakeCarCtrl.js               # 套牌车告警
│   │       ├── highTrafficCtr.js            # 实时流量
│   │       ├── carMovementCtrl.js           # 路径分析
│   │       └── trafficStaticsCtrl.js        # 卡口统计
│   └── WEB-INF/classes/app.conf             # 配置文件
└── detail-records/          # 原始测试数据
```

---

## 六、学习要点

- **Storm 实时计算**：Spout/Bolt 拓扑、流式 join、时间窗口
- **Kafka 消息队列**：高吞吐车辆轨迹数据接入
- **AngularJS 1.x**：UI Router、ng-include、双向绑定
- **百度地图 JS API v2.0**：Marker、CurveLine、信息窗口
- **Tomcat WAR 部署**：老版 `javax.servlet` 与 Tomcat 9 的兼容性

---

## 七、免责声明

- 本项目仅供学习参考，地图数据 © 百度智图
- 原工程版权归华为技术有限公司，基于 Apache 2.0 协议
- 改造部分（贵阳数据、本地启动脚本）以 MIT 协议发布

## License

Apache-2.0
