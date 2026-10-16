define(
    ['language/dataAccess', 'src/app/common/commonInfo', 'echarts', 'baidu', 'lushu'],
    function(i18n, commonInfo, echarts, baidu,lushu) {
        "use strict";
        var uQueryCtrl = function($rootScope, $scope, $state, $stateParams,
            $compile, mask, showLogDetailService, commonService,
            timeService, storage, fakeCarService) {
        	 $scope.i18n = i18n;
            var refreshST;
            $rootScope.currentPage = "uQuery"
            var options1 = {
                "id": "Date",
                "type": "datetime",
                "timeFormat": 'hh:mm:ss',
                "defaultTime": '08:00:00',
                "dateFormat": 'yy-mm-dd',
                "defaultDate": '2017-09-04',
                "minDate": '1990-03-04',
                "maxDate": '2020-05-06',
                "firstDay": 1
            };
            var startDateTime = new tinyWidget.DateTime(options1);

            var options2 = {
                "id": "Date2",
                "type": "datetime",
                "timeFormat": 'hh:mm:ss',
                "defaultTime": '09:00:00',
                "dateFormat": 'yy-mm-dd',
                "defaultDate": '2017-09-04',
                "minDate": '1990-03-04',
                "maxDate": '2020-05-06',
                "firstDay": 1
            };
            var endDateTime = new tinyWidget.DateTime(options2);
            $scope.commonInfo = commonInfo;
            $scope.mapData = []
            $scope.warningListTable = {
                "id": "uQueryTable",
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
                }, {
                    "sTitle": "Number of Travels",
                    "mData": "throughPut",
                    "bSortable": false,
                    "sWidth": "65%"
                }],

                "changeSelect": function(evtObj) {
                    $scope.warningListTable.displayLength = evtObj.displayLength;
                    $stateParams['results-per-page'] = evtObj.displayLength;
                    requestNum = evtObj.displayLength;
                    $stateParams.page = 1;
                    refreshWarningList($stateParams.page, requestNum,
                        alarmType);
                },
                "callback": function(evtObj) {
                    $stateParams.page = evtObj.currentPage;

                    getUQueryData($stateParams.page, requestNum);
                },
                "renderRow": function(nRow, aData, iDataIndex) {

                }

            };

            // Mouse Event
            $scope.getData = function(carNumber) {                
                carNumber = document.getElementById("search").value;
                var Date1 = startDateTime.getDateTime()
                var Date2 = endDateTime.getDateTime()
               // alert(Date2)
                var d_dt = Date1.split(" ");
                var d2_dt = Date2.split(" ");
                var time = d_dt[1].split(":");
                var date1 = d_dt[0].split("-");
                var time1 = d2_dt[1].split(":");
                var date2 = d2_dt[0].split("-");
                var d1 = new Date();
                d1.setYear(date1[0]);
                d1.setMonth(date1[1]-1);
                d1.setDate(date1[2]);
                d1.setHours(time[0])
                d1.setMinutes(time[1])
                d1.setSeconds(time[2]) 
                console.log(d1)
                 var d2 = new Date();
                d2.setYear(date2[0]);
                d2.setMonth(date2[1]-1);
                d2.setDate(date2[2]);
                d2.setHours(time1[0])
                d2.setMinutes(time1[1])
                d2.setSeconds(time1[2]) 
                console.log(d2)
               if(d1>d2){
                	var message = i18n.startTimeWarning;
                    commonService.netWarningTip(message,true);
                    return;                    	
                }
                if(d2 > new Date()){
                	var message = i18n.EndTimeWarning;
                    commonService.netWarningTip(message,true);
                    return;
                }
                
                getUQueryData(1, 10, Date1, Date2, carNumber, "")
            }
            $scope.removeMarker = function(tlist) {
                callmouseOutMarker(tlist);
            }
            $scope.clickMarker = function(tlist) {
                clickRow(tlist);
            }

            // Baidu Map
            var markerarr;
            var map;
            function addMarker(tempMarker) {
                var point = new BMap.Point(tempMarker[1], tempMarker[2]);
                var img = "images/red.png";;
                if (tempMarker[10] == "high") {
                    img = "images/red.png";
                } else if (tempMarker[10] == "medium") {
                    img = "images/orange.png";
                } else if (tempMarker[10] == "low") {
                    img = "images/green.png";
                }
                var myIcon = new BMap.Icon(img, new BMap.Size(16, 16));
                tempMarker[6] = new BMap.Marker(point, {
                    icon: myIcon
                });
                map.addOverlay(tempMarker[6]);

                tempMarker[6].addEventListener('mouseover', function() {
                    focusMarker(tempMarker);
                });
                tempMarker[6].addEventListener('mouseout', function() {
                    mouseOutMarker(tempMarker);
                });
                tempMarker[6].addEventListener('click', function() {
                    clickEvent(tempMarker);
                });

            }

            function focusMarker(tempMarker) {
            	
                var img = "images/greenH2.png";;
                if (tempMarker[10] == "high") {
                    img = "images/redH.png";
                } else if (tempMarker[10] == "medium") {
                    img = "images/orangeH.png";
                } else if (tempMarker[10] == "low") {
                    img = "images/greenH2.png";
                }
                var myIcon = new BMap.Icon(img, new BMap.Size(18, 18));
                
                tempMarker[6].setIcon(myIcon);
                var point = tempMarker[6].getPosition();
                tempMarker[7] = new ComplexCustomOverlay(point, tempMarker);
                map.addOverlay(tempMarker[7]);
                tempMarker[6].addEventListener('mouseout', function() {
                    mouseOutMarker(tempMarker);
                });

            }

            function mouseOutMarker(tempMarker) {
                tempMarker[7].remove();
                var point = tempMarker[6].getPosition();
                var img = "images/red.png";;
                if (tempMarker[10] == "high") {
                    img = "images/red.png";
                } else if (tempMarker[10] == "medium") {
                    img = "images/orange.png";
                } else if (tempMarker[10] == "low") {
                    img = "images/green.png";
                }
                var myIcon = new BMap.Icon(img, new BMap.Size(16, 16));
                if (tempMarker[9] == true) {
                	img = "images/greenH2.png";;
                    if (tempMarker[10] == "high") {
                        img = "images/redH.png";
                    } else if (tempMarker[10] == "medium") {
                        img = "images/orangeH.png";
                    } else if (tempMarker[10] == "low") {
                        img = "images/greenH2.png";
                    }
                    myIcon = new BMap.Icon(img, new BMap.Size(20, 20));
                }
                tempMarker[6].setIcon(myIcon);
            }

            function callfocusMarker(tlist) {
                for (var i = 0; i < markerarr.length; i++) {
                    if (markerarr[i][0] == tlist.junction &&
                        markerarr[i][1] == tlist.location.longitude &&
                        markerarr[i][2] == tlist.location.latitude) {

                        focusMarker(markerarr[i]);
                    }
                }
            }

            function callmouseOutMarker(tlist) {
                for (var i = 0; i < markerarr.length; i++) {
                    map.clearOverlays();
                }
                for (var i = 0; i < markerarr.length; i++) {
                    addMarker(markerarr[i]);
                }
            }

            function clickRow(tlist) {
                for (var i = 0; i < markerarr.length; i++) {
                    if (markerarr[i][0] == tlist.junction &&
                        markerarr[i][1] == tlist.location.longitude &&
                        markerarr[i][2] == tlist.location.latitude) {
                        clickEvent(markerarr[i]);
                    }
                }
            }

            function clickEvent(tempMarker) {
                var params = {
                    startDate: startDateTime.getDateTime(),
                    endDate: endDateTime.getDateTime(),
                    carNumber: "",
                    monitId: tempMarker[4]
                };
                var promise = fakeCarService.getUQeueryData(params);
                promise
                    .then(
                        function(data) {
                            showPopup(tempMarker[4], data);
                        },
                        function(data) {
                            if (data.status == 200) {
                                commonService.loading.remove();
                                // 时间转换
                                for (var i = 0; i < result.length; i++) {
                                    result[i].datetimeString = timeService.fn
                                        .milliseconds2LocalTime(result[i].timestamp * 1);
                                }
                                $scope.warningListTable.data = result;
                                $scope.warningListTable.totalRecords = data.total;
                            } else {
                                commonService.loading.remove();
                                var message = i18n.alarmList;
                                commonService.netErrorTip(i18n,
                                    data, message);
                            }
                        });

            }

            function showPopup(monitId, data) {
                var detail = document.getElementById('details');
                var junction = document.getElementById('junction');
                var time = document.getElementById('carPasstime');
                var textContent = "";
                var timeContent = "";

                var tableHeading = document.getElementById('tableHeading');
                tableHeading.innerHTML = monitId + " " + $scope.i18n.uquery_querytable_title
                // only 20 records or less
                var count = data.junctionDetailData.length
                
                var addDotDot = false
                if (data.junctionDetailData.length > 10) {
                    count = 10
                    addDotDot = true
                }
                for (var i = 0; i < count; i++) {
                    textContent = textContent + (i + 1) + "." + "<span onclick='document.getElementById(\"search\").value=\"" + data.junctionDetailData[i].carNumber + "\"'>" + data.junctionDetailData[i].carNumber + "</span>:<br><br>";
                    timeContent = timeContent +
                        data.junctionDetailData[i].time + "<br><br>";

                }

                if (addDotDot) {
                    textContent = textContent + ".........<br>"
                }

                //detail.innerHTML = textContent;
                detail.innerHTML = data.startDateTime + " " + $scope.i18n.uquery_to + " " + data.endDateTime;
                junction.innerHTML = textContent;
                time.innerHTML = timeContent;
                var modal = document.getElementById('myModal');
                // Get the <span> element that closes the modal
                var span = document.getElementsByClassName("close")[0];
                // When the user clicks the button, open the modal
                modal.style.display = "block";
                // When the user clicks on <span> (x), close the modal
                span.onclick = function() {
                    modal.style.display = "none";
                }
                // When the user clicks anywhere outside of the modal, close
                // it
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
            }

            //**************Car Route*****************
            var ll;

            function addCarRoute(route) {
        
                var points = new Array(route.length);
                for (var i = 0; i < route.length; i++) {
                    points[i] = new BMap.Point(route[i].location.longitude, route[i].location.latitude);
                }
                var polyline = new BMap.Polyline(points, {
                    strokeColor: "#50ffd0",
                    strokeWeight: 2,
                    strokeOpacity: 1,
                    strokeStyle: "dashed"
                }); //创建折线
                map.addOverlay(polyline);
                map.setViewport(points);
                map.setZoom(12);
                //alert(points.length);
                startLushu(points);
                /*for (var i = 0; i < route.length-1; i++) 
                {
                	startLushu([points[i],points[i+1]]);
                }*/
                
                
                for (var i = 0; i < points.length; i++) {
                    for (var j = 0; j < ll; j++) {
                        if (markerarr[j][6].getPosition().equals(points[i])) {
                        	var img = "images/greenH2.png";;
                            if (markerarr[j][10] == "high") {
                                img = "images/redH.png";
                            } else if (markerarr[j][10] == "medium") {
                                img = "images/orangeH.png";
                            } else if (markerarr[j][10] == "low") {
                                img = "images/greenH2.png";
                            }
                            var myIcon = new BMap.Icon(img, new BMap.Size(20, 20));
                            markerarr[j][6].setIcon(myIcon);
                            markerarr[j][9] = true;
                        }
                    }
                }
            }
            function startLushu(points) {
            	try{ 
                	var lushu= new BMapLib.LuShu(map,points,{
                    defaultContent:"",
                    autoView:true,
                    icon  : new BMap.Icon('images/direction.png', new BMap.Size(24,24)),
                    speed: 10000,
                    enableRotation:true,
                    });     
                	lushu.start();
                	
                }catch (e) {
                	console.log();
					// TODO: handle exception
				}
			}
            
            //************** InfoBox**************
            function ComplexCustomOverlay(point, tempMarker) {
                this._point = point;
                this._junction = tempMarker[4];
                this._throughput = tempMarker[8];
                var arrowcolor;

                arrowcolor = '#ff4040';

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
                span.innerHTML = "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:120px'><b>Junction: </b></div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#d4d4d4;line-height:22px;text-align:left;padding-left:15px'> " + that._junction + "</div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:120px'><b>Number of Cars: </b></div>" +
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

            function getUQueryData(pageIndex, requestNum, startDate,
                endDate, carNumber, monitId) {
                $(".dataTables_scrollBody").append(commonService.loading);
                if (pageIndex && requestNum) {
                    var params = {
                        offset: pageIndex,
                        count: requestNum,
                        startDate: startDate,
                        endDate: endDate,
                        carNumber: carNumber,
                        monitId: monitId
                    };
                   
                    var promise = fakeCarService.getUQeueryData(params);
                    promise
                        .then(
                            function(data) {
                                commonService.loading.remove();
                                $scope.warningListTable.data = data.tableData;
                                $scope.warningListTable.totalRecords = data.tableData.length;
                                if($scope.warningListTable.totalRecords == 0){
                                    if(carNumber.length!=0){
                                    	var message = i18n.Records;
                                    	commonService.netWarningTip(message,true);                                    	
                                    	}
                                }
                                
                                $scope.mapData = data.mapData
                                // $scope.quantity = 10;

                                // Baidu map
                                if (map == undefined) {
                                	map=addMap("uQueryMapContainer");
                                }
                                map.clearOverlays();
                                markerarr = new Array(
                                    data.mapData.length);
                                ll = data.mapData.length;
                                for (var i = 0; i < data.mapData.length; i++) {
                                    markerarr[i] = new Array(11);
                                    markerarr[i][0] = data.mapData[i].carNumber;
                                    markerarr[i][1] = data.mapData[i].location.longitude;
                                    markerarr[i][2] = data.mapData[i].location.latitude;
                                    markerarr[i][3] = data.mapData[i].location.name;
                                    markerarr[i][4] = data.mapData[i].monitId;
                                    markerarr[i][5] = data.mapData[i].time;
                                    //index 6 has marker, 7 has tooltip
                                    markerarr[i][8] = data.mapData[i].carCount;
                                    markerarr[i][10] = data.mapData[i].level;
                                    addMarker(markerarr[i]);
                                }
                                if ($scope.warningListTable.data.length >= 1) {
                                    document.getElementById("routeDetails").style.display = "block";
                                    addCarRoute($scope.warningListTable.data);

                                }

                            },
                            function(data) {
                                if (data.status == 200) {
                                    commonService.loading.remove();
                                    // 时间转换
                                    for (var i = 0; i < result.length; i++) {
                                        result[i].datetimeString = timeService.fn
                                            .milliseconds2LocalTime(result[i].timestamp * 1);
                                    }
                                    $scope.warningListTable.data = result;
                                    $scope.warningListTable.totalRecords = data.total;

                                } else {
                                    commonService.loading.remove();
                                    var message = i18n.alarmList;
                                    commonService.netErrorTip(i18n,
                                        data, message);
                                }
                            });

                    clearTimeout(refreshST);
                    refreshST = setTimeout(function() {}, commonService.WAIT_TIME);
                }
            }
           
        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('uQuery.ctrl', uQueryCtrl);
        return dataAccessModule;
    });