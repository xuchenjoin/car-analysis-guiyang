define(['language/dataAccess', 'src/app/common/commonInfo','baidu'],
    function(i18n, commonInfo,baidu) {
        "use strict";
        var highTrafficCtrl = function($rootScope, $scope, $state, $stateParams, $compile, mask, showLogDetailService, commonService, timeService, storage, fakeCarService) {
            $scope.i18n = i18n;
            $scope.commonInfo = commonInfo;
            $rootScope.currentPage = "highTraffic"
            $scope.warningListTable = {
                "id": "fakeCarTable",
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
                        "sTitle": "Junction",
                        "mData": "junction",
                        "bSortable": false,
                        "sWidth": "35%"
                    },
                    {
                        "sTitle": "Throughput",
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

                    getFakeCarData($stateParams.page, requestNum, alarmType);
                },
                "renderRow": function(nRow, aData, iDataIndex) {}

            };

            //Mouse Event
            $scope.go = function(tlist) {
                callfocusMarker(tlist);
            }
            $scope.removeMarker = function(tlist) {
                callmouseOutMarker(tlist);
            }
            $scope.clickMarker = function(tlist) {
                callfocusMarker(tlist);
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


            //***********Map***************
            var markerarr;
            var pointName = [];
            var label;
            var map;
            var redIcon = new BMap.Icon("images/red.png", new BMap.Size(16, 16));
            var orangeIcon = new BMap.Icon("images/orange.png", new BMap.Size(16, 16));
            var greenIcon = new BMap.Icon("images/green.png", new BMap.Size(16, 16));
            function addMarker(tempMarker) {
                var point = new BMap.Point(tempMarker[2], tempMarker[3]);
                var myIcon
                if (tempMarker[7] == "high")
                	myIcon=redIcon;
                else if (tempMarker[7] == "medium")
                	myIcon=orangeIcon;
                else if (tempMarker[7] == "low")
                	myIcon=greenIcon;
                
                tempMarker[4] = new BMap.Marker(point, {
                    icon: myIcon
                });
                map.addOverlay(tempMarker[4]);
                tempMarker[4].addEventListener('mouseover', function() {
                    focusMarker(tempMarker);
                });
                tempMarker[4].addEventListener('mouseout', function() {
                    mouseOutMarker(tempMarker);
                });


            }

            var redIconH = new BMap.Icon("images/redH.png", new BMap.Size(18,18));
            var orangeIconH = new BMap.Icon("images/orangeH.png", new BMap.Size(18,18));
            var greenIconH = new BMap.Icon("images/greenH2.png", new BMap.Size(18,18));
            function focusMarker(tempMarker) {
                var myIcon;
                var point = tempMarker[4].getPosition();
                if (tempMarker[7] == "high")
                	myIcon=redIconH;
                else if (tempMarker[7] == "medium")
                	myIcon=orangeIconH;
                else if (tempMarker[7] == "low")
                	myIcon=greenIconH;
                
                tempMarker[4].setIcon(myIcon);
                tempMarker[5] = new ComplexCustomOverlay(point, tempMarker);
                map.addOverlay(tempMarker[5]);
                tempMarker[4].addEventListener('mouseout', function() {
                    tempMarker[5].remove();
                    map.removeOverlay(tempMarker[5]);
                    mouseOutMarker(tempMarker);
                });
            }

            function mouseOutMarker(tempMarker) {

                tempMarker[5].remove();
                var point = tempMarker[4].getPosition();
                var myIcon
                if (tempMarker[7] == "high")
                	myIcon=redIcon;
                else if (tempMarker[7] == "medium")
                	myIcon=orangeIcon;
                else if (tempMarker[7] == "low")
                	myIcon=greenIcon;
                tempMarker[4].setIcon(myIcon);
            }

            function callfocusMarker(tlist) {
                //alert(tlist)
                for (var i = 0; i < markerarr.length; i++) {
                    if (markerarr[i][0] == tlist.junction && markerarr[i][3] == tlist.location.latitude &&
                        markerarr[i][2] == tlist.location.longitude) {

                        focusMarker(markerarr[i]);
                    }
                }
            }

            function callmouseOutMarker(tlist) {
                map.clearOverlays();
                for (var i = 0; i < markerarr.length; i++) {
                    addMarker(markerarr[i]);
                }
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
                this._throughput = tempMarker[6];
                //this._time = tempMarker[6];
                var arrowcolor;
                if (tempMarker[7] == "high")
                    arrowcolor = '#ff4040';
                else if (tempMarker[7] == "medium")
                    arrowcolor = '#f4a435';
                else if (tempMarker[7] == "low")
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
                div.style.width = "250px";
                div.style.padding = "15px";
                div.style.lineHeight = "18px";
                div.style.MozUserSelect = "none";
                div.style.fontSize = "12px"
                div.style.borderBottom = "1px solid";
                div.style.borderBottomColor = that._acolor;
                div.style.boxShadow = "0 0 15px 1px"

                var span = this._span = document.createElement("span");
                span.innerHTML = "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:120px'><b>"+i18n.hightraffic_junction+":</b></div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#d4d4d4;line-height:22px;text-align:left;padding-left:15px'> " + that._junction + "</div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:120px'><b>"+i18n.hightraffic_throughput+":</b></div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#d4d4d4;line-height:22px;text-align:left; padding-left:15px'> " + that._throughput + "</div>";
                
                div.appendChild(span);

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

            function scheduleFnCall() {
                if ($rootScope.currentPage == "highTraffic") {
                    setTimeout(getHighTrafficData, 3000);
                }
            }
            function updateTime() {
                if ($rootScope.currentPage == "highTraffic") {
                var currentTime = new Date();
                var hours = currentTime.getHours();
                var minutes = currentTime.getMinutes();
                var seconds = currentTime.getSeconds();
                if (minutes < 10){
                    minutes = "0" + minutes;
                }
                if (seconds < 10){
                    seconds = "0" + seconds;
                }
                var v = hours + ":" + minutes + ":" + seconds;
                try{
                	document.getElementById('highTrafficTime').innerHTML=v;
                }
                catch(e){console.log(e);}
                setTimeout(updateTime,1000);
                }
            }
            updateTime();
            
            //************** InfoBox**************
            function customInfobox(point, content, flag) {
                this._point = point;
                this._content = content;
                var arrowcolor;
                if(flag == false)
                	arrowcolor = '#909296';
                this._acolor = arrowcolor;
            }


            customInfobox.prototype = new BMap.Overlay();
            customInfobox.prototype.initialize = function(map) {
                this._map = map;
                var that = this;
                var div = this._div = document.createElement("div");
                div.style.position = "absolute";
                div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                div.style.backgroundColor = "rgba(2,10,27,0.80)";
                div.style.border = "1px solid #002156";
                div.style.color = "rgba(14,47,64,0.60)";
                div.style.height = "50px";
                div.style.width = "215px";
                div.style.paddingTop = "15px";
                div.style.paddingLeft = "15px";
                div.style.lineHeight = "18px";
                div.style.MozUserSelect = "none";
                div.style.fontSize = "12px"
                div.style.borderBottom = "1px solid";
                div.style.borderBottomColor = that._acolor;
                div.style.boxShadow = "0 0 15px 1px"

                var span = this._span = document.createElement("span");
                span.innerHTML = that._content;
                div.appendChild(span);

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
                arrow.style.position = "absolute";
                arrow.style.top = "25px";
                arrow.style.left = "45px";
                div.appendChild(arrow);
                map.getPanes().labelPane.appendChild(div);

                return div;
            }
            customInfobox.prototype.draw = function() {
                var map = this._map;
                var pixel = map.pointToOverlayPixel(this._point);
                this._div.style.left = pixel.x - parseInt(this._arrow.style.left) - 60 + "px";
                this._div.style.top = pixel.y - 70 + "px";
            }
            
            //initial call
            getHighTrafficData();

            function getHighTrafficData() {
                $(".dataTables_scrollBody").append(commonService.loading);
                var params = {}
                var promise = fakeCarService.getHightTrafficData(params);
                promise.then(function(data) {
                        commonService.loading.remove();

                        $scope.warningListTable.data = data.highTrafficAreas;
                        $scope.warningListTable.totalRecords = data.highTrafficAreas.length;
                        $scope.warningListTable.time = data.time;
                        $scope.max = Math.max.apply(Math, $scope.warningListTable.data.map(function(o) {
                            return o.throughPut;
                        }));


                        //**********Baidu Map***********
                        if (map == undefined) {
                        	map=addMap("highTrafficMapContainer");
                        }                        
                        map.clearOverlays();
                        markerarr = new Array($scope.warningListTable.data.length);
                        for (var i = 0; i < $scope.warningListTable.data.length; i++) {
                            markerarr[i] = new Array(8);
                            markerarr[i][0] = $scope.warningListTable.data[i].junction;
                            markerarr[i][1] = $scope.warningListTable.data[i].location.name;
                            markerarr[i][2] = $scope.warningListTable.data[i].location.longitude;
                            markerarr[i][3] = $scope.warningListTable.data[i].location.latitude;
                            markerarr[i][6] = $scope.warningListTable.data[i].throughPut;
                            markerarr[i][7] = $scope.warningListTable.data[i].level;
                            addMarker(markerarr[i]);
                            pointName.push(markerarr[i][1]);
                        }
                        scheduleFnCall();
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
                            scheduleFnCall();


                        } else {
                            commonService.loading.remove();
                            var message = i18n.dataFailure;
                            commonService.netWarningTip(message,true);
                            scheduleFnCall();
                        }
                    });
            }
        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('highTraffic.ctrl', highTrafficCtrl);
        return dataAccessModule;

    });