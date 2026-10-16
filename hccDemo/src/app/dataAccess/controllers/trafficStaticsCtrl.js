define(['language/dataAccess', 'src/app/common/commonInfo', 'echarts', 'baidu'],
    function(i18n, commonInfo, echarts, baidu) {
        "use strict";
        var trafficStaticsCtrl = function($rootScope, $scope, $state, $stateParams, $compile, mask, showLogDetailService, commonService, timeService, storage, fakeCarService) {
            var refreshST;
            $rootScope.currentPage = "trafficStat"
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
                "renderRow": function(nRow, aData, iDataIndex) {

                    var infoStr = "<div class='pull-left'  ng-mouseover='go(" + aData.junction + ")'>" + aData.junction + "</div>";
                    var colOne = "<div class='pull-left'  ng-mouseover='go(" + aData.junction + ")'>" + aData.throughPut + "</div>";
                    var statusStr = infoStr;
                    var statusLink = $compile(statusStr);
                    var statusScope = $scope.$new();
                    var statusNode = statusLink(statusScope);
                    $("td:eq(0)", nRow).html(statusNode);

                    statusStr = colOne;
                    statusLink = $compile(statusStr);
                    statusScope = $scope.$new();
                    statusNode = statusLink(statusScope);
                    $("td:eq(1)", nRow).html(statusNode);
                }

            };

            //Mouse Event
            $scope.go = function(tlist) {
                callfocusMarker(tlist);
            }
            $scope.removeMarker = function(tlist) {
                callmouseOutMarker();
            }
            $scope.clickMarker = function(tlist) {
                clickRow(tlist);
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
                callmouseOutMarker();
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


            // Baidu Map 
            var markerarr;
            var map;
            var pointName = [];

            function addMarker(tempMarker) {
                var img;
                if (tempMarker[7] == "high")
                    img = "images/red.png";
                else if (tempMarker[7] == "medium")
                    img = "images/orange.png";
                else if (tempMarker[7] == "low")
                    img = "images/green.png";
                var point = new BMap.Point(tempMarker[1], tempMarker[2]);
                var myIcon = new BMap.Icon(img, new BMap.Size(16, 16));
                tempMarker[5] = new BMap.Marker(point, {
                    icon: myIcon
                });
                map.addOverlay(tempMarker[5]);

                tempMarker[5].addEventListener('mouseover', function() {
                    focusMarker(tempMarker);
                });
                tempMarker[5].addEventListener('mouseout', function() {
                    mouseOutMarker(tempMarker);
                });
                tempMarker[5].addEventListener('click', function() {
                    clickEvent(tempMarker);
                });



            }

            function focusMarker(tempMarker) {
                var img;
                if (tempMarker[7] == "high")
                    img = "images/redH.png";
                else if (tempMarker[7] == "medium")
                    img = "images/orangeH.png";
                else if (tempMarker[7] == "low")
                    img = "images/greenH2.png";
                var myIcon = new BMap.Icon(img, new BMap.Size(24, 24));
                tempMarker[5].setIcon(myIcon);
                var point = tempMarker[5].getPosition();
                tempMarker[6] = new ComplexCustomOverlay(point, tempMarker);
                map.addOverlay(tempMarker[6]);
                tempMarker[5].addEventListener('mouseout', function() {
                    mouseOutMarker(tempMarker);
                });

            }

            function mouseOutMarker(tempMarker) {
                tempMarker[6].remove();
                //tempMarker[5].remove();
                var point = tempMarker[5].getPosition();
                var img;
                if (tempMarker[7] == "high")
                    img = "images/red.png";
                else if (tempMarker[7] == "medium")
                    img = "images/orange.png";
                else if (tempMarker[7] == "low")
                    img = "images/green.png";
                var myIcon = new BMap.Icon(img, new BMap.Size(16, 16));
                tempMarker[5].setIcon(myIcon);

                /*
            	var point = new BMap.Point(tempMarker[2],tempMarker[3]);
            	var myIcon = new BMap.Icon("images/nmark.png", new BMap.Size(48,48));
            	tempMarker[4] = new BMap.Marker(point,{icon: myIcon});  
            	map.addOverlay(tempMarker[4]);
            	tempMarker[4].addEventListener('mouseover', function(){
            		focusAllMarker(tempMarker);
     			});*/
            }

            function callfocusMarker(tlist) {
                for (var i = 0; i < markerarr.length; i++) {
                    if (markerarr[i][0] == tlist.junction && markerarr[i][1] == tlist.location.longitude &&
                        markerarr[i][2] == tlist.location.latitude) {

                        focusMarker(markerarr[i]);
                    }
                }
            }

            function callmouseOutMarker() {
                for (var i = 0; i < markerarr.length; i++) {
                    map.clearOverlays();
                }
                for (var i = 0; i < markerarr.length; i++) {
                    addMarker(markerarr[i]);
                }
            }

            function showDailyDataChart(tempMarker, sData) {
                var tname = sData.location.name + ' ' + i18n.trafficstatistics_allday;
                //alert(sData.times.length);
                var modal = document.getElementById('myModal');
                // Get the button that opens the modal
                var btn = document.getElementById("myBtn");
                // Get the <span> element that closes the modal
                var span = document.getElementsByClassName("close")[0];
                modal.style.display = "block";
                span.onclick = function() {
                    modal.style.display = "none";
                }
                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }

                var dom = document.getElementById("chart");
                var myChart = echarts.init(dom);
                var app = {};
                var option = null;
                app.title = tname;
                var colors = ['#d14a61', '#675bba'];

                function arrayMin(arr) {
                    return arr.reduce(function(p, v) {
                        return (p < v ? p : v);
                    });
                }

                function arrayMax(arr) {
                    return arr.reduce(function(p, v) {
                        return (p > v ? p : v);
                    });
                }

                //alert(sData.values);
                var timeData = [
                    [0, sData.values[0]],
                    [1, sData.values[1]],
                    [2, sData.values[2]],
                    [3, sData.values[3]],
                    [4, sData.values[4]],
                    [5, sData.values[5]],
                    [6, sData.values[6]],
                    [7, sData.values[7]],
                    [8, sData.values[8]],
                    [9, sData.values[9]],
                    [10, sData.values[10]],
                    [11, sData.values[11]],
                    [12, sData.values[12]],
                    [13, sData.values[13]],
                    [14, sData.values[14]],
                    [15, sData.values[15]],
                    [16, sData.values[16]],
                    [17, sData.values[17]],
                    [18, sData.values[18]],
                    [19, sData.values[19]],
                    [20, sData.values[20]],
                    [21, sData.values[21]],
                    [22, sData.values[22]],
                    [23, sData.values[23]]
                ];
                var maxv = arrayMax(sData.values);
                var minv = arrayMin(sData.values);
                option = {
                    backgroundColor: '#0c2d4c',
                    title: {
                        text: tname + '                                                                                                                                                   ',

                        textStyle: {
                            color: '#eee',

                        },
                        backgroundColor: '#0d5977',
                    },
                    color: colors,

                    xAxis: [{
                        type: 'value',
                        gridIndex: [0, 5],
                        nameTextStyle: {
                            color: '#fff',
                            fontSize: 14
                        },
                        //boundaryGap: false,
                        splitNumber: 20,
                        //data:timeData,
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#eee'
                            }
                        },
                        axisLabel: {
                            formatter: '{value}:00'
                        },
                    }, ],
                    yAxis: {
                        type: 'value',
                        gridIndex: [-1, 0],
                        splitNumber: 5,
                        splitLine: {
                            lineStyle: {
                                color: '#5685ad'
                            }
                        },

                        nameTextStyle: {
                            color: '#fff',
                            fontSize: 14
                        },

                        axisLine: {
                            lineStyle: {
                                color: '#0c2d4c'
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            },
                        }

                    },
                    visualMap: {
                        min: minv,
                        max: maxv,
                        splitNumber: 3,
                        color: ['#ff4300', '#ff9000', '#00ffd8'],
                        text: 'null',
                        itemWidth: 0,

                    },
                    series: {
                        name: tname,
                        type: 'line',
                        smooth: true,
                        markPoint: {
                            symbolSize: 15,
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [{
                                    type: 'max',
                                    symbolOffset: [0, '-70%'],
                                    symbol: 'image://images/maxpoint.png',
                                },
                                {
                                    type: 'min',
                                    symbolRotate: 180,
                                    symbolOffset: [0, '70%'],
                                    symbol: 'image://images/minpoint.png',
                                }
                            ]
                        },
                        data: timeData //sData.values
                    }

                };;
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }

            }

            function clickRow(tlist) {
                for (var i = 0; i < markerarr.length; i++) {
                    if (markerarr[i][0] == tlist.junction && markerarr[i][1] == tlist.location.longitude &&
                        markerarr[i][2] == tlist.location.latitude) {
                        clickEvent(markerarr[i]);
                    }
                }
            }

            function clickEvent(tempMarker) {
                //alert(tempMarker[0])
                var params = {
                    monitId: tempMarker[0]
                };
                var promise = fakeCarService.getCarStaticsDailyData(params);
                promise.then(function(data) {
                        //alert(data)
                        showDailyDataChart(tempMarker, data)

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
                        } else {
                            commonService.loading.remove();
                            var message = i18n.alarmList;
                            commonService.netErrorTip(i18n, data, message);
                        }
                    });

            }
            function searchGate(){
                var content = $("#search-box").val();
                var index = pointName.indexOf(content);
                if(index != -1){
                    focusMarker(markerarr[index]);
                } else{
                    $("#info-box").css("visibility","visible");
                }
            }

            //************** InfoBox**************
            function ComplexCustomOverlay(point, tempMarker) {
                this._point = point;
                this._junction = tempMarker[0];
                this._throughput = tempMarker[4];
                var arrowcolor;
                if (tempMarker[7] == "high")
                    arrowcolor = '#ff4040';
                else if (tempMarker[7] == "medium")
                    arrowcolor = '#f4a435';
                else if (tempMarker[7] == "low")
                    arrowcolor = '#50ffd0';
                this._acolor = arrowcolor;
                //this._time = tempMarker[6];
            }
            ComplexCustomOverlay.prototype = new BMap.Overlay();
            ComplexCustomOverlay.prototype.initialize = function(map) {
                this._map = map;
                var that = this;
                var div = this._div = document.createElement("div");
                div.style.position = "absolute";
                div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                div.style.position = "absolute";
                div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                div.style.backgroundColor = "rgba(2,10,27,0.80)";
                div.style.border = "1px solid #002156";
                div.style.color = "rgba(14,47,64,0.60)";
                div.style.height = "90px";
                div.style.width = "250px";
                div.style.padding = "15px";
                div.style.lineHeight = "18px";
                div.style.MozUserSelect = "none";
                div.style.fontSize = "12px"
                div.style.borderBottom = "1px solid";
                div.style.borderBottomColor = that._acolor;
                div.style.boxShadow = "0 0 15px 1px"


                var span = this._span = document.createElement("span");
                span.innerHTML = "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:120px'><b>"+i18n.trafficstatistics_junction+": </b></div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#d4d4d4;line-height:22px;text-align:left;padding-left:15px'> " + that._junction + "</div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:120px'><b>"+i18n.trafficstatistics_throughput+": </b></div>" +
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

            getCarMovemnetData(1, 10, "alarmType");

            function getCarMovemnetData(pageIndex, requestNum, alarmType) {

                $(".dataTables_scrollBody").append(commonService.loading);
                if (pageIndex && requestNum && alarmType) {
                    var params = {
                        offset: pageIndex,
                        count: requestNum,
                        alarmType: alarmType
                    };

                    var promise = fakeCarService.getCarStaticsData(params);
                    promise.then(function(data) {
                            commonService.loading.remove();
                            $scope.warningListTable.data = data.highTrafficAreas;
                            $scope.warningListTable.totalRecords = data.highTrafficAreas.length;
                            $scope.warningListTable.time = data.time;
                            $scope.max = Math.max.apply(Math, $scope.warningListTable.data.map(function(o) {
                                return o.throughPut;
                            }));
                            $scope.quantity = 10;

                            //Baidu map
                            if (map == undefined) {
                            	map=addMap("trafficStatMapContainer");
                            }
                            //alert($scope.warningListTable.data[0].level);
                            markerarr = new Array($scope.warningListTable.data.length);
                            for (var i = 0; i < $scope.warningListTable.data.length; i++) {
                                markerarr[i] = new Array(8);
                                markerarr[i][0] = $scope.warningListTable.data[i].junction;
                                markerarr[i][1] = $scope.warningListTable.data[i].location.longitude;
                                markerarr[i][2] = $scope.warningListTable.data[i].location.latitude;
                                markerarr[i][3] = $scope.warningListTable.data[i].location.name;
                                markerarr[i][4] = $scope.warningListTable.data[i].throughPut;
                                markerarr[i][7] = $scope.warningListTable.data[i].level;
                                addMarker(markerarr[i]);
                                pointName.push(markerarr[i][3]);
                            }

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
            $scope.i18n = i18n;
        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('trafficStatics.ctrl', trafficStaticsCtrl);
        return dataAccessModule;
    });