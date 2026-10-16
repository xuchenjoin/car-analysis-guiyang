// ============================================================
// 贵阳真实路口坐标库（约60个，覆盖云岩/南明/观山湖/花溪/白云/乌当）
// ============================================================
var GUIYANG_POINTS = [
    [106.713,26.583],[106.712,26.578],[106.703,26.585],[106.705,26.575],
    [106.708,26.578],[106.715,26.580],[106.718,26.567],[106.735,26.560],
    [106.725,26.565],[106.730,26.575],[106.720,26.585],[106.730,26.580],
    [106.740,26.575],[106.745,26.585],[106.695,26.568],[106.690,26.572],
    [106.685,26.560],[106.698,26.573],[106.698,26.580],[106.685,26.585],
    [106.670,26.590],[106.660,26.595],[106.640,26.610],[106.635,26.620],
    [106.675,26.615],[106.645,26.605],[106.630,26.625],[106.695,26.605],
    [106.705,26.595],[106.700,26.600],[106.720,26.605],[106.730,26.610],
    [106.725,26.600],[106.715,26.615],[106.680,26.630],[106.635,26.660],
    [106.630,26.655],[106.625,26.665],[106.620,26.690],[106.755,26.625],
    [106.750,26.620],[106.740,26.630],[106.760,26.545],[106.780,26.540],
    [106.700,26.555],[106.710,26.550],[106.690,26.545],[106.685,26.540],
    [106.680,26.520],[106.670,26.430],[106.675,26.440],[106.665,26.435],
    [106.650,26.400],[106.720,26.490],[106.715,26.590],[106.725,26.555],
    [106.660,26.575],[106.655,26.585],[106.745,26.555],[106.755,26.565],
    [106.670,26.500],[106.660,26.510]
];

// 用后端坐标的小数部分做哈希，映射到贵阳真实路口
var ORIGIN_BMapPoint = BMap.Point;
BMap.Point = function(lng, lat) {
    var seed = Math.abs(Math.floor((lng * 1000 + lat * 1000) % GUIYANG_POINTS.length));
    var p = GUIYANG_POINTS[seed];
    return new ORIGIN_BMapPoint(p[0], p[1]);
};

function addMap(containerId) {
    // 隐藏 Angular 模板里的空 div
    var old = document.getElementById(containerId);
    if (old) old.style.display = "none";

    // 用 body 下的全屏 div
    var cid = "fullscreen-map";
    var container = document.getElementById(cid);
    if (container) {
        container.style.display = "block";
        container.style.position = "absolute";
        container.style.top = "0";
        container.style.left = "0";
        container.style.width = window.innerWidth + "px";
        container.style.height = window.innerHeight + "px";
    }

    var map = new BMap.Map(cid);
    // 贵阳中心坐标（用原始 BMap.Point，不偏移）
    var guiyang = new ORIGIN_BMapPoint(106.71, 26.58);
    try {
        map.centerAndZoom(guiyang, 12);
        map.enableScrollWheelZoom();

        function ZoomControl() {
            this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
            this.defaultOffset = new BMap.Size(0, 0);
        }
        ZoomControl.prototype = new BMap.Control();
        ZoomControl.prototype.initialize = function(map) {
            var div = document.getElementById("zoom-in");
            if (div) div.onclick = function(e) { map.setZoom(map.getZoom() + 1); };
            var div2 = document.getElementById("zoom-out");
            if (div2) div2.onclick = function(e) { map.setZoom(map.getZoom() - 1); };
        }
        var myZoomCtrl = new ZoomControl();
        map.addControl(myZoomCtrl);

        // 暂时关闭暗色主题，排查瓦片不加载问题
        /*
        map.setMapStyle({
            styleJson: [
                {"featureType":"water","elementType":"geometry","stylers":{"color":"#021019"}},
                {"featureType":"highway","elementType":"geometry.fill","stylers":{"color":"#000000"}},
                {"featureType":"highway","elementType":"geometry.stroke","stylers":{"color":"#147a92"}},
                {"featureType":"arterial","elementType":"geometry.fill","stylers":{"color":"#000000"}},
                {"featureType":"arterial","elementType":"geometry.stroke","stylers":{"color":"#0b3d51"}},
                {"featureType":"local","elementType":"geometry","stylers":{"color":"#000000"}},
                {"featureType":"land","elementType":"all","stylers":{"color":"#08304b"}},
                {"featureType":"railway","elementType":"geometry.fill","stylers":{"color":"#000000"}},
                {"featureType":"railway","elementType":"geometry.stroke","stylers":{"color":"#08304b"}},
                {"featureType":"subway","elementType":"geometry","stylers":{"lightness":-70}},
                {"featureType":"building","elementType":"geometry.fill","stylers":{"color":"#000000"}},
                {"featureType":"all","elementType":"labels.text.fill","stylers":{"color":"#857f7f"}},
                {"featureType":"all","elementType":"labels.text.stroke","stylers":{"color":"#000000"}},
                {"featureType":"building","elementType":"geometry","stylers":{"color":"#022338"}},
                {"featureType":"green","elementType":"geometry","stylers":{"color":"#062032"}},
                {"featureType":"boundary","elementType":"geometry.stroke","stylers":{"color":"#1e1c1c"}},
                {"featureType":"manmade","elementType":"all","stylers":{"visibility":"off"}},
                {"featureType":"all","elementType":"labels","stylers":{"visibility":"off"}}
            ]
        });
        */

        setTimeout(function() {
            try {
                map.centerAndZoom(guiyang, 12);
                window.dispatchEvent(new Event('resize'));
            } catch(e) {}
        }, 500);
    } catch (e) {
        console.log("Map Exception: " + e.message);
    }
    return map;
}
