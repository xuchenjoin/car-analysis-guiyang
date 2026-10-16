define(['language/dataAccess', 'src/app/common/commonInfo', 'baidu'],
    function(i18n, commonInfo, baidu) {
        "use strict";
        var carMovemnet = function($rootScope, $scope, $state, $stateParams, $compile, mask, showLogDetailService, commonService, timeService, storage, fakeCarService) {
            var refreshST;
            $scope.i18n = i18n;
            $rootScope.currentPage = "carMovement"
            $scope.commonInfo = commonInfo;
            $scope.warningListTable = {
                "id": "carMovementTable",
                "enablePagination": "auto",
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "displayLength": $stateParams['results-per-page'],
                "currentPage": {
                    pageIndex: $stateParams.page
                },
                "totalRecords": 0,
                "draggable": true,
                "data": [],
                "checkbox": false,
                "paginationStyle": "full_numbers",
                "tableLanguage": {
                    "sEmptyTable": i18n.dps_table_no_data_show
                },
                "columns": [{
                        "sTitle": "Path",
                        "mData": "junction",
                        "bSortable": false,
                        "sWidth": "35%"
                    },
                    {
                        "sTitle": "Number of Travels",
                        "mData": "throughPut",
                        "bSortable": false,
                        "sWidth": "65%"
                    }
                ],

                "changeSelect": function(evtObj) {
                    $scope.warningListTable.displayLength = evtObj.displayLength;
                    $stateParams['results-per-page'] = evtObj.displayLength;
                    requestNum = evtObj.displayLength;
                    $stateParams.page = 1;
                    refreshWarningList($stateParams.page, requestNum, alarmType);
                },
                "callback": function(evtObj) {
                    $stateParams.page = evtObj.currentPage;

                    getCarMovemnetData($stateParams.page, requestNum, alarmType);
                },
                "renderRow": function(nRow, aData, iDataIndex) {}
            };
            $scope.mouseOverList = function(tlist){
                callfocusMarker(tlist,false);
            }
            $scope.mouseClickList = function(tlist){
                callfocusMarker(tlist,true);
            }
            $scope.mouseOutList = function(tlist) {
                removeInfoBox();
            }

            $scope.backInitialState = function(){
                clearMap();
                shownLines = topTenSrcRelatedLines.slice(0);
                addLines(shownLines);
                setZoom(points);
            }
            $scope.tableAction = function(event){
                var target = angular.element(event.target);
                if(target.hasClass("hidetable")){
                    $("#leftMenu").css("cssText", "height:110px !important");
                    target.removeClass("hidetable");
                } else{
                    $("#leftMenu").css("cssText", "height:85% !important");
                    target.addClass("hidetable");
                }
            }
            $scope.showSearchBox = function(){
                $("#search-box").css("border","1px solid #71e8ff");
                $("#search-box").animate({width:"170px"});
                $("#search").removeClass("inputdisable");
            }
            $scope.hideSearchBox = function(){
                $("#search-box").css("border","0px solid #71e8ff");
                $("#search-box").animate({width:"0px"});
                $("#search").addClass("inputdisable");
                $("#info-box").css("visibility","hidden");
                
            }
            $scope.clickSearch = function(){
                searchGate();
            }
            $scope.keypress = function(event){
                $("#info-box").css("visibility","hidden");
                if(event.which === 13){
                    searchGate();
                }
            }

            var markerarr;
            var label;
            var lineList;
            var map;
            var widthDivisor;
            //pointNames, destinations use the same index
            var pointNames = [];
            var destinations = new Array(); // all lines with same src point
            var topTenLines = [];
            var topTenSrcRelatedLines = [];
            var shownLines = [];
            var shownPoints = [];
            var points = [];
            var defaultLineWidth = 1;
            var selectedLineWidth = 3;

            getCarMovemnetData(1, 10, "alarmType");
            function getCarMovemnetData(pageIndex, requestNum, alarmType) {
                $(".dataTables_scrollBody").append(commonService.loading);
                if (pageIndex && requestNum && alarmType) {
                    var params = {
                        offset: pageIndex,
                        count: requestNum,
                        alarmType: alarmType
                    };

                    var promise = fakeCarService.getCarMovementData(params);
                    promise.then(function(data) {
                            commonService.loading.remove();
                            // ===== 上海地名 → 贵阳地名+真实坐标 =====
                            var NAME_MAP = {
                                "上海": ["贵阳", 106.713, 26.583],
                                "浦江饭店": ["喷水池", 106.713, 26.583],
                                "有利大楼": ["大十字", 106.712, 26.578],
                                "外滩中心": ["甲秀楼", 106.718, 26.567],
                                "金茂大厦": ["花果园", 106.695, 26.568],
                                "明天广场": ["贵阳北站", 106.675, 26.615],
                                "璞麗酒店": ["观山湖公园", 106.635, 26.620],
                                "上海大厦": ["黔灵山公园", 106.695, 26.605],
                                "淀山湖": ["花溪公园", 106.670, 26.430],
                                "摩与会堂": ["青岩古镇", 106.570, 26.430],
                                "人民广场": ["紫林庵", 106.703, 26.585],
                                "南京路": ["中华中路", 106.715, 26.580],
                                "陆家嘴": ["世纪城", 106.645, 26.605],
                                "徐家汇": ["小河", 106.690, 26.545],
                                "静安寺": ["喷水池", 106.713, 26.583]
                            };
                            data.highTrafficAreas.forEach(function(item) {
                                [item.srcLocation, item.destLocation].forEach(function(loc) {
                                    if (loc && loc.name && NAME_MAP[loc.name]) {
                                        var mapped = NAME_MAP[loc.name];
                                        loc.name = mapped[0];
                                        loc.longitude = mapped[1];
                                        loc.latitude = mapped[2];
                                    }
                                });
                                // 重建路径名：贵阳 - 喷水池
                                item.srcDestName = item.srcLocation.name + " - " + item.destLocation.name;
                            });
                            $scope.warningListTable.data = data.highTrafficAreas;
                            $scope.warningListTable.totalRecords = data.highTrafficAreas.length;
                            $scope.warningListTable.time = data.time;
                            $scope.max = Math.max.apply(Math, $scope.warningListTable.data.map(function(o) {
                                return o.throughPut;
                            }));
                            $scope.min = Math.min.apply(Math, $scope.warningListTable.data.map(function(o) {
                                return o.throughPut;
                            }));
                            //alert($scope.warningListTable.data[0].srcLocation.name);
                            //Baidu Map
                            if (map == undefined) {
                                map=addMap("carMovemntMapContainer");
                            }
                            //alert($scope.min);
                            lineList = new Array($scope.warningListTable.data.length);
                            //alert($scope.warningListTable.data[0].throughPut);
                            var numPoint = 0;
                            var markers = [];
                            var topTenSrcPointNames = [];
                            for (var i = 0; i < $scope.warningListTable.data.length; i++) {
                                var max = $scope.warningListTable.data.length - 1;
                                lineList[max - i] = new Array(8);
                                lineList[max - i][0] = $scope.warningListTable.data[max - i].srcLocation.name;
                                lineList[max - i][1] = $scope.warningListTable.data[max - i].srcLocation.latitude;
                                lineList[max - i][2] = $scope.warningListTable.data[max - i].srcLocation.longitude;
                                lineList[max - i][3] = $scope.warningListTable.data[max - i].destLocation.name;
                                lineList[max - i][4] = $scope.warningListTable.data[max - i].destLocation.latitude;
                                lineList[max - i][5] = $scope.warningListTable.data[max - i].destLocation.longitude;
                                lineList[max - i][6] = $scope.warningListTable.data[max - i].level;
                                lineList[max - i][7] = $scope.warningListTable.data[max - i].throughPut;
                                if(max-i<10){
                                    //shownLines.push(makeLine(lineList[max-i]));
                                    topTenLines.push(makeLine(lineList[max-i],selectedLineWidth));
                                    topTenSrcPointNames.push(lineList[max-i][0]);
                                }
                                var gateIndex = pointNames.indexOf(lineList[max - i][0]);
                                if(gateIndex == -1){
                                    numPoint += 1;
                                    pointNames.push(lineList[max - i][0]);
                                    var intialPoint = new BMap.Point(Number(lineList[max - i][2]),Number(lineList[max - i][1]));
                                    markers.push(makeMarker(intialPoint,lineList[max - i][0],0));
                                    points.push(intialPoint);
                                    destinations[numPoint - 1] = new Array();
                                    destinations[numPoint - 1][0] = lineList[max - i];
                                }else{
                                    destinations[gateIndex].push(lineList[max - i]);
                                }
                            }
                            for(var i = 0; i<topTenSrcPointNames.length; i++){
                                findAllRelatedLines(topTenSrcPointNames[i]);
                            }
                            topTenSrcRelatedLines = shownLines.slice(0);
                            addMarkers(markers);
                            addLines(shownLines);
                            setZoom(points);
                        },
                        function(data) {
                            if (data.status == 200) {
                                commonService.loading.remove();
                                //时间转换
                                for (var i = 0; i < result.length; i++) {
                                    result[i].datetimeString = timeService.fn.milliseconds2LocalTime(result[i].timestamp * 1);
                                }
                                $scope.warningListTable.data = result;
                                $scope.warningListTable.totalRecords = data.total;


                                //动态修改下拉搜索框数据
                                /*$scope.errorNum=0 , $scope.warningNum=0 , $scope.passiveNum=0;
                                for(var i=0;i<result.length;i++){
                                    switch (result[i].alarmType) {
                                        case 'ERROR':
                                            $scope.errorNum++;
                                            break;
                                        case 'WARNING':
                                            $scope.warningNum++;
                                            break;
                                        case 'PASSIVE':
                                            $scope.passiveNum++;
                                            break;
                                    }
                                }
                                $scope.levelSelect.values[0].label=i18n.dps_alarm_list_search_all+"("+$scope.warningListTable.totalRecords+")";
                                $scope.levelSelect.values[1].label=i18n.dps_alarm_list_search_critical+"("+$scope.errorNum+")";
                                $scope.levelSelect.values[2].label=i18n.dps_alarm_list_search_warning+"("+$scope.warningNum+")";
                                $scope.levelSelect.values[3].label=i18n.dps_alarm_list_search_remind+"("+$scope.passiveNum+")";*/
                            } else {
                                commonService.loading.remove();
                                var message = i18n.alarmList;
                                commonService.netErrorTip(i18n, data, message);
                            }
                        });

                    clearTimeout(refreshST);
                    refreshST = setTimeout(function() {}, commonService.WAIT_TIME);
                }
            }

            function callfocusMarker(tlist,resetZoom) {
                var isShown = false;
                var path;
                var lineInfoList = new Array(8);
                lineInfoList[0] = tlist.srcLocation.name;
                lineInfoList[1] = tlist.srcLocation.latitude;
                lineInfoList[2] = tlist.srcLocation.longitude;
                lineInfoList[3] = tlist.destLocation.name;
                lineInfoList[4] = tlist.destLocation.latitude;
                lineInfoList[5] = tlist.destLocation.longitude;
                lineInfoList[6] = tlist.level;
                lineInfoList[7] = tlist.throughPut;
                for(var i = 0; i < shownLines.length; i++){
                    path = shownLines[i].getPath();
                    if(lineInfoList[2] == path[0].lng && lineInfoList[1] == path[0].lat && lineInfoList[5] == path[1].lng && lineInfoList[4] == path[1].lat){
                        isShown = true;
                        break;
                    }
                }
                if(!isShown){
                    var newLine = makeLine(lineInfoList,selectedLineWidth);
                    if(resetZoom == true){
                        shownLines.push(newLine);
                    }
                    map.addOverlay(newLine);
                }
                clickLine(lineInfoList,undefined,resetZoom);
            }

            // ************Map***************
            function makeMarker(myPoint,name,type){
            //type 0: initial point that cannot be removed
            //type 1: source point
            //type 2: destination point
                var myIcon;
                if(type == 0){
                    myIcon = new BMap.Icon("images/green0_4.png", new BMap.Size(13, 13));
                } else if(type == 1){
                    myIcon = new BMap.Icon("images/red.png", new BMap.Size(13, 13));
                } else if(type == 2){
                    myIcon = new BMap.Icon("images/green.png", new BMap.Size(13, 13));
                }
                var myMarker = new BMap.Marker(myPoint, {
                    icon: myIcon
                });
                if(type == 0){
                    myMarker.disableMassClear();
                }
                myMarker.setTitle(name);
                myMarker.addEventListener('click',function(){
                    //remove previous actions
                    var tempMarker = myMarker;
                    clickPoint(tempMarker);
                });
                return myMarker;
            }

            function addMarkers(markerAry){
                for(var i = 0; i<markerAry.length;i++){
                    map.addOverlay(markerAry[i]);
                }
            }

            function makeLine(lineInfo,minLineWidth){
                var color;
                var lineOpacity;
                var img;
                if (lineInfo[6] == "high") {
                    color = "#ff4040";
                    lineOpacity = 0.8;
                } else if (lineInfo[6] == "medium") {
                    color = "#ff9e21";
                    lineOpacity = 0.6;
                } else if (lineInfo[6] == "low") {
                    color = "#40ef9e";
                    lineOpacity = 0.5;
                }
                widthDivisor = $scope.max/7;
                //alert(widthDivisor)
                var linewidth = lineInfo[7] / widthDivisor;
                if(linewidth<minLineWidth)
                    linewidth = minLineWidth
                var srcPoint = new BMap.Point(lineInfo[2], lineInfo[1]);
                var destPoint = new BMap.Point(lineInfo[5], lineInfo[4]);
                var myLine = new BMapLib.CurveLine([
                    srcPoint,
                    destPoint,
                ], {
                    strokeColor: color,
                    strokeWeight: linewidth,
                    strokeOpacity: lineOpacity
                })
                //console.log(myLine);
                myLine.addEventListener("click", function(e){
                    var location = e.point;
                    clickLine(lineInfo,location,true);
                })
                myLine.addEventListener("mouseover",function(e){
                    var location = e.point;
                    showInfoBox(lineInfo,location);
                })
                myLine.addEventListener("mouseout",function(){
                    removeInfoBox();
                })
                return myLine;
            }

            function addLines(lineAry){
                for(var i = 0; i<lineAry.length;i++){
                    map.addOverlay(lineAry[i]);
                }
            }

            function clickLine(lineInfo,clickLoc,resetZoom){
                var srcPoint = new BMap.Point(Number(lineInfo[2]),Number(lineInfo[1]));
                var destPoint = new BMap.Point(Number(lineInfo[5]),Number(lineInfo[4]));
                var endpoints = new Array(srcPoint,destPoint);
                if(clickLoc === undefined){
                    clickLoc = srcPoint;
                }
                showInfoBox(lineInfo,clickLoc);
                if(resetZoom == true){
                    setZoom(endpoints);
                }
            }

            function showInfoBox(lineInfo,pointBox){
                var name = i18n.carmovement_from+" "+lineInfo[0]+" "+i18n.carmovement_to+" "+lineInfo[3];
                var infoBox = new ComplexCustomOverlay(pointBox, lineInfo[6], lineInfo[7], name);
                removeInfoBox();
                map.addOverlay(makeLine(lineInfo, selectedLineWidth));
                map.addOverlay(infoBox);
            }

            function removeInfoBox(){
                lockLines(shownLines);
                lockPoints(shownPoints);
                map.clearOverlays();
            }

            function clickPoint(tempMarker){
                clearMap();
                var all_lat_lng = [];
                //add lines and all destination points
                var index = pointNames.indexOf(tempMarker.getTitle());
                if(index != -1){
                    var relatedLines = destinations[index];
                    for(var i = 0; i<relatedLines.length; i++){
                        shownLines.push(makeLine(relatedLines[i],selectedLineWidth));
                        var destPoint = new BMap.Point(Number(relatedLines[i][5]),Number(relatedLines[i][4]));
                        shownPoints.push(makeMarker(destPoint,relatedLines[i][3],2));
                        all_lat_lng.push(destPoint);
                    }
                    addLines(shownLines);
                }
                //turn the selected point to red
                var position = tempMarker.getPosition();
                shownPoints.push(makeMarker(position,tempMarker.getTitle(),1));
                addMarkers(shownPoints);
                all_lat_lng.push(new BMap.Point(position.lng,position.lat));
                setZoom(all_lat_lng);
            }

            function findAllRelatedLines(pointName){
                var index = pointNames.indexOf(pointName);
                if(index != -1){
                    var relatedLines = destinations[index];
                    for(var i = 0; i<relatedLines.length; i++){
                        shownLines.push(makeLine(relatedLines[i],defaultLineWidth));
                        var myMarker = makeMarker(new BMap.Point(Number(relatedLines[i][5]),Number(relatedLines[i][4])),relatedLines[i][3],0);
                        map.addOverlay(myMarker);
                    }
                }
            }

            function lockLines(lineAry){
                for(var i = 0; i < lineAry.length; i++){
                    lineAry[i].disableMassClear();
                }
            }

            function unlockLines(lineAry){
                for(var i = 0; i <lineAry.length; i++){
                    lineAry[i].enableMassClear();
                }
            }

            function lockPoints(pointAry){
                for(var i = 0; i < pointAry.length; i++){
                    pointAry[i].disableMassClear();
                }
            }

            function unlockPoints(pointAry){
                for(var i = 0; i <pointAry.length; i++){
                    pointAry[i].enableMassClear();
                }
            }

            function setZoom(points){
                var viewPort = map.getViewport(points);
                var zoomLevel = viewPort.zoom;
                if(points.length <= 3){
                    zoomLevel -= 1;
                }
                map.centerAndZoom(viewPort.center,zoomLevel);
                //console.log(map.getBounds());
            }

            function clearMap(){
                unlockLines(shownLines);
                unlockPoints(shownPoints);
                map.clearOverlays();
                shownLines = [];
                shownPoints = [];
            }
            function searchGate(){
                var content = $("#search-box").val();
                var index = pointNames.indexOf(content);
                if(index != -1){
                    var tempPoint = new BMap.Point(Number(destinations[index][0][2]),Number(destinations[index][0][1]));
                    var tempIcon = new BMap.Icon("images/red.png", new BMap.Size(13, 13));
                    var tempMarker = new BMap.Marker(tempPoint,tempIcon);
                    tempMarker.setTitle(content);
                    clickPoint(tempMarker);
                } else{
                    $("#info-box").css("visibility","visible");
                }
            }

            // function setZoom(points){//points: 2-D array
            //     if(pointNames.length>0 && !isNaN(pointNames[0][0])){
            //         var maxLng = pointNames[0][1]
            //         var minLng = pointNames[0][1];
            //         var maxLat = pointNames[0][0];
            //         var minLat = pointNames[0][0];
            //         var res;
            //         for (var i = 0; i < pointNames.length; i++) {
            //             res = pointNames[i];
            //             if(res[1] > maxLng) maxLng = res[1];
            //             if(res[1] < minLng) minLng = res[1];
            //             if(res[0] > maxLat) maxLat = res[0];
            //             if(res[0] < minLat) minLat = res[0];
            //         };
            //         var cenLng = (maxLng + minLng)/2;
            //         var cenLat = (maxLat + minLat)/2;
            //         var zoom = getZoom(maxLng, minLng, maxLat, minLat);
            //         map.centerAndZoom(new BMap.Point(cenLng,cenLat), zoom);  
            //     }
            // }

            // function getZoom (maxLng, minLng, maxLat, minLat) {
            //     var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000"]//level from 18 to 7, limits in shanghai。
            //     var pointA = new BMap.Point(maxLng,maxLat);
            //     var pointB = new BMap.Point(minLng,minLat);
            //     var distance = map.getDistance(pointA,pointB).toFixed(1);
            //     for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {
            //         if(zoom[i] - distance > 0){
            //             var level = 18-i+2;
            //             if(level > 7){
            //                 return level;
            //             } else{
            //                 return 7;
            //             }
            //         }
            //     };
            // }

            //************** InfoBox**************
            function ComplexCustomOverlay(point, level, throughput, name) {
                this._point = point;
                this._junction = name;
                this._throughput = throughput;
                //this._time = tempMarker[6];
                var arrowcolor;
                if (level == "high")
                    arrowcolor = '#ff4040';
                else if (level == "medium")
                    arrowcolor = '#f4a435';
                else if (level == "low")
                    arrowcolor = '#50ffd0';
                this._acolor = arrowcolor;
            }
            ComplexCustomOverlay.prototype = new BMap.Overlay();
            ComplexCustomOverlay.prototype.initialize = function(map) {
                this._map = map;
                var that = this;
                var div = this._div = document.createElement("div");
                div.style.position = "absolute";
                div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                div.style.backgroundColor = "rgba(2,10,27,0.80)";
                div.style.border = "1px solid #002156";
                div.style.color = "rgba(14,47,64,0.60)";
                div.style.height = "90px";
                div.style.width = "270px";
                div.style.padding = "15px";
                div.style.lineHeight = "18px";
                div.style.MozUserSelect = "none";
                div.style.fontSize = "12px"
                div.style.borderBottom = "1px solid";
                div.style.borderBottomColor = that._acolor;
                div.style.boxShadow = "0 0 15px 1px"


                var span = this._span = document.createElement("span");

                span.innerHTML = "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:50px'><b>"+i18n.carmovement_junction+": </b></div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#d4d4d4;line-height:22px;text-align:left;padding-left:15px'> " + that._junction + "</div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:120px'><b>"+i18n.carmovement_throughput+": </b></div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#d4d4d4;line-height:22px;text-align:left; padding-left:15px'> " + that._throughput + "</div>";
                div.appendChild(span);
                var that = this;

                var arrow = this._arrow = document.createElement("div");
                arrow.innerHTML = "<style>" +
                    "#tooltip:before, #tooltip:after {" +
                    "content: '';" +
                    "position: absolute;" +
                    "border-left: 10px solid transparent;" +
                    "border-right: 10px solid transparent;" +
                    "top: 25px;" +
                    "left: 60px;" +
                    "margin-left: -10px;" +
                    "}" +
                    "#tooltip:after{" +
                    "border-top: 10px solid " + that._acolor + ";" +
                    "margin-top: -2px;" +
                    "z-index: 1;" +
                    "}" +
                    "</style>";

                arrow.setAttribute("id", "tooltip");
                //arrow.style.background = "url(https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_play_arrow_48px-48.png) no-repeat";
                arrow.style.position = "absolute";
                arrow.style.top = "65px";
                arrow.style.left = "60px";

                div.appendChild(arrow);
                map.getPanes().labelPane.appendChild(div);

                return div;
            }
            ComplexCustomOverlay.prototype.draw = function() {
                var map = this._map;
                var pixel = map.pointToOverlayPixel(this._point);
                this._div.style.left = pixel.x - parseInt(this._arrow.style.left) - 66 + "px";
                this._div.style.top = pixel.y - 120 + "px";
            }

            $scope.i18n = i18n;
        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('carMovement.ctrl', carMovemnet);
        return dataAccessModule;
    });