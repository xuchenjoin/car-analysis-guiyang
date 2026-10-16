define(
    ['language/dataAccess', 'baidu'],
    function(i18n, baidu) {
        "use strict";

        var leftMenuCtrl = function($rootScope, $scope, $state, $stateParams, $compile, mask, commonService, fakeCarService) {
            $rootScope.currentPage = "fakeCar"
            $scope.i18n = i18n;
            $scope.map = "fakeCar.map";
            $scope.totalNumberOfCars = 0
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
                        "sTitle": "车牌号",
                        "mData": "licenceNumber",
                        "bSortable": false,
                        "sWidth": "35%"
                    },
                    {
                        "sTitle": "出现位置",
                        "mData": "locations",
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

                    getFakeCarData();
                },
                "renderRow": function(nRow, aData, iDataIndex) {
                    /* 自定义状态列 */

                    var infoStr = "<div class='pull-left'  ui-sref = {{map}} ng-mouseover='go(" + aData.licenceNumber + ")'>" + aData.licenceNumber + "</div>";
                    var colOne = "<div class='pull-left'  ng-mouseover='go(" + aData.licenceNumber + ")'>" + aData.locations + "</div>";
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

            $scope.i18n = i18n;
            $scope.plugins = {
                "text": i18n.dps_title_text
            };
            $scope.message = "Hello World"

            $scope.serviceList = [{
                iconClass: 'icon-dps-dps-left-menu-pipelines',
                title: i18n.dps_pipeline_list,
                state: "manage.pipelineList",
                params: {},
                hide: false
            }, {
                iconClass: 'icon-dps-dps-left-menu-warnings',
                title: i18n.dps_alarm_list_title,
                state: "manage.alarmList",
                params: {},
                hide: false
            }, {
                iconClass: 'icon-dps-dps-left-menu-logs',
                title: i18n.left_menu_opertaion_logs,
                state: "manage.operationLogs",
                params: {},
                hide: false
            }, {
                iconClass: 'icon-dps-editor-link',
                title: i18n.left_menu_Key_Generate_certificate,
                state: "manage.certificate",
                params: {},
                hide: false
            }];



            // 用于标志是否为点击 tiny-layout-head 所导致的stateChangeSuccess事件，此种情况下无需设置layout层级菜单激活状态
            var isheadClick = false;
            var lay;
            $scope.headClickFn = function() {
                isheadClick = true;
                setTimeout(function() {
                    setCurActive();
                }, 100);
            };

            function setCurActive() {
                try {
                    var currentName = $state.current.name;
                    lay.opActive($("a[ui-sref='" + currentName + "']").last());
                } catch (e) {}
            }

            /* function leftMenuResponse() {
                 var leftMenuDom = document.querySelector("#leftMenu"),
                     leftMenuHeight = leftMenuDom.offsetHeight;
                 var listHeight = document.querySelector("#leftMenu ul").offsetHeight;

                 if (leftMenuHeight < listHeight) {
                     leftMenuDom.style.overflow = null;
                     leftMenuDom.styleoverflowX = "hidden";
                 } else {
                     leftMenuDom.style.overflow = "visible";
                 }
             }

             $(window).resize(function () {
                 leftMenuResponse();
             });

             leftMenuResponse();*/

            $scope.$on("$viewContentLoaded", function() {
                if (navigator.userAgent.indexOf("Firefox") > -1) {
                    $("#dpsLogo").css("margin-top", "3px");
                }
                setTimeout(function() {
                    lay = new tinyWidget.Layout({
                        "id": "leftBar",
                        "subheight": 93,
                        "footerHeight": 34
                    });
                    setCurActive();
                }, 0);
                $('.dropdown-toggle').dropdown();

            });


            //Mouse Event
            $scope.go = function(tlist) {
                callfocusMarker(tlist);
            }
            $scope.removeMarker = function(tlist) {
                callmouseOutMarker(tlist);
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
                var tempMarker = junctionArray[lastSearchIndex];
                if(tempMarker != undefined){
                    tempMarker[4].remove();
                    tempMarker[3].setIcon(greenIcon);
                }
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


            // Map Functions*********************
            var markerarr;
            var label;
            var map;
            var pointName = [];
            var lastSearchIndex;
            var junctionArray;
            var redIcon = new BMap.Icon("images/nmark.png", new BMap.Size(48, 48));
            var redIconH = new BMap.Icon("images/hmark.png", new BMap.Size(80, 80));
            function addMarker(tempMarker,i) {
                var point = new BMap.Point(tempMarker[2], tempMarker[3]);
                tempMarker[4] = new BMap.Marker(point, {
                    icon: redIcon
                });
                map.addOverlay(tempMarker[4]);
                tempMarker[4].addEventListener('mouseover', function() {
                    focusAllMarker(markerarr[i]);
                });
            }

            function focusAllMarker(tempMarker) {
                focusMarker(tempMarker, 0);
	            focusMarker(tempMarker, 1);
            }

            function focusMarker(tempMarker, j) {
                tempMarker[j][4].remove();
                var point = new BMap.Point(tempMarker[j][2], tempMarker[j][3]);
                
                tempMarker[j][4] = new BMap.Marker(point, {
                    icon: redIconH
                });
                map.addOverlay(tempMarker[j][4]);

                tempMarker[j][5] = new ComplexCustomOverlay(point, tempMarker[j]);
                map.addOverlay(tempMarker[j][5]);

                tempMarker[j][4].addEventListener('mouseout', function() {
                	map.clearOverlays();
                    mouseOutAll();
                });
                tempMarker[j][4].addEventListener('click', function() {
                    clickEvent(tempMarker);
                });

            }

            function mouseOutAll() {
            	map.clearOverlays();
            	addAllMarkers(junctionData);
            	for (var i = 0; i < markerarr.length; i++) {
                    for (var j = 0; j < markerarr[i].length; j++) {
                        addMarker(markerarr[i][j],i);
                    }
                }
//                for (var j = 0; j < tmarker.length; j++) {
//                    mouseOutMarker(tmarker[j]);
//                }
            }

/*            function mouseOutMarker(tempMarker) {
            	tempMarker[5].remove();
                tempMarker[4].remove();
                
                var point = new BMap.Point(tempMarker[2], tempMarker[3]);
                var myIcon = new BMap.Icon("images/nmark.png", new BMap.Size(48, 48));
                tempMarker[4] = new BMap.Marker(point, {
                    icon: myIcon
                });
                map.addOverlay(tempMarker[4]);
                tempMarker[4].addEventListener('mouseover', function() {
                    focusAllMarker(tempMarker);
                });
            }*/

            function callfocusMarker(tlist) {
                //alert(tlist.carList[0].licenceNumber);//licenceNumber
                for (var i = 0; i < markerarr.length; i++) {
                    if (markerarr[i][0][0] == tlist.licenceNumber && ((markerarr[i][0][1]+"|"+markerarr[i][1][1]) == tlist.locations)) {

                        focusAllMarker(markerarr[i]);
                    }
                }
            }

            function callmouseOutMarker(tlist) {
                map.clearOverlays();
                addAllMarkers(junctionData);
                for (var i = 0; i < markerarr.length; i++) {
                    for (var j = 0; j < markerarr[i].length; j++) {
                        addMarker(markerarr[i][j],i);
                    }
                }
            }

            function clickRow(tlist) {

                var fakecarlength = markerarr.length;
                //alert(fakecarlength);
                for (var i = 0; i < fakecarlength; i++) {
                    for (var j = 0; j < markerarr[i].length; j++) {
                        if (markerarr[i][j][0] == tlist.licenceNumber && ((markerarr[i][0][1]+"|"+markerarr[i][1][1]) == tlist.locations)) {
                            clickEvent(markerarr[i]);
                        }
                    }
                }
            }

            function clickEvent(tempMarker) {
            	var title = document.getElementById('popUpTitle');
            	title.innerHTML = tempMarker[0][0];
            	var detail = document.getElementById('details');
            	var textContent = "";
            	for(var i =0;i<tempMarker.length;i++)
            		textContent = textContent +i18n.fakecars_location+": " + tempMarker[i][1] +
                    "<br>"+i18n.fakecars_pass_time+": " + tempMarker[i][6]+ "<br><br>";

                detail.innerHTML = textContent;
                var modal = document.getElementById('myModal');
                // Get the <span> element that closes the modal
                var span = document.getElementsByClassName("close")[0];
                // When the user clicks the button, open the modal 
                modal.style.display = "block";
                // When the user clicks on <span> (x), close the modal
                span.onclick = function() {
                    modal.style.display = "none";
                }
                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
            }
            function searchGate(){
                var content = $("#search-box").val();
                lastSearchIndex = pointName.indexOf(content);
                if(lastSearchIndex != -1){
                    var tempMarker = junctionArray[lastSearchIndex];
                    var point = new BMap.Point(tempMarker[1], tempMarker[2]);
                    tempMarker[3].setIcon(greenIconH);
                    var content = "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:120px'><b>Name: </b></div>" +
                     "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#d4d4d4;line-height:22px;text-align:left;padding-left:15px'> " + tempMarker[0] + "</div>";

                    tempMarker[4] = new customInfobox(point,content,false);
                    map.addOverlay(tempMarker[4]);
                } else{
                    $("#info-box").css("visibility","visible");
                }
            }

            //************** InfoBox**************
            function ComplexCustomOverlay(point, tempMarker) {
                this._point = point;
                this._number = tempMarker[0];
                this._location = tempMarker[1];
                this._time = tempMarker[6];
                var arrowcolor = '#ff4040';
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
                div.style.height = "100px";
                div.style.width = "300px";
                div.style.padding = "15px";
                div.style.lineHeight = "18px";
                div.style.MozUserSelect = "none";
                div.style.fontSize = "12px"
                div.style.borderBottom = "1px solid";
                div.style.borderBottomColor = that._acolor;
                div.style.boxShadow = "0 0 15px 1px"


                var span = this._span = document.createElement("span");
                span.innerHTML = "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:120px'><b>"+i18n.fakecars_carnumber+": </b></div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#d4d4d4;line-height:22px;text-align:left;padding-left:15px'> " + that._number + "</div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:120px'><b>"+i18n.fakecars_location+": </b></div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#d4d4d4;line-height:22px;text-align:left; padding-left:15px'> " + that._location + "</div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:120px'><b>"+ i18n.fakecars_time +": </b></div>" +
                    "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#d4d4d4;line-height:22px;text-align:left;'> " + that._time + "</div>";

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

                arrow.style.top = "75px";
                arrow.style.left = "60px";

                div.appendChild(arrow);
                map.getPanes().labelPane.appendChild(div);

                return div;
            }
            ComplexCustomOverlay.prototype.draw = function() {
                var map = this._map;
                var pixel = map.pointToOverlayPixel(this._point);
                this._div.style.left = pixel.x - parseInt(this._arrow.style.left) - 75 + "px";
                this._div.style.top = pixel.y - 150 + "px";
            }
            
          //************** InfoBox**************
            function customInfobox(point, content, flag) {
                this._point = point;
                this._content = content;
                var arrowcolor;
                if(flag == false)
                	arrowcolor = '#50ffd0';
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
            
            var greenIcon = new BMap.Icon("images/green.png", new BMap.Size(16, 16));
            var greenIconH = new BMap.Icon("images/greenH2.png", new BMap.Size(18, 18));
            function addPointMarker(tempMarker) {
            	var map1 = map;
            	//alert(tempMarker[0])
                var point = new BMap.Point(tempMarker[1], tempMarker[2]);
               /* if (tempMarker[0] == "high")
                    img = "images/red.png";
                else if (tempMarker[0] == "medium")
                    img = "images/orange.png";
                else if (tempMarker[0] == "low")
                    img = "images/green.png";*/
                tempMarker[3] = new BMap.Marker(point, {
                    icon: greenIcon
                });
                map1.addOverlay(tempMarker[3]);
                tempMarker[3].addEventListener('mouseover', function() {
                     tempMarker[3].setIcon(greenIconH);
                     //tempMarker[3].setTop();
                     var content = "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#9faaca;line-height:22px;text-align:left; float:left; width:120px'><b>"+i18n.fakecars_name+": </b></div>" +
                     "<div style='font-family:PingFangSC-Regular;font-size:14px;color:#d4d4d4;line-height:22px;text-align:left;padding-left:15px'> " + tempMarker[0] + "</div>";

                     tempMarker[4] = new customInfobox(point,content,false);
                     map1.addOverlay(tempMarker[4]);
                    //focusMarker(tempMarker);
                });
                tempMarker[3].addEventListener('mouseout', function() {
                    //mouseOutMarker(tempMarker);
                	tempMarker[4].remove();
                	tempMarker[3].setIcon(greenIcon);
                });


            }
            function addAllMarkers(data) 
            {
            	junctionArray = new Array(data.length);
                for (var i = 0; i < data.length; i++) {
                	junctionArray[i] = new Array(5);
                    junctionArray[i][0] = data[i].name;
                    junctionArray[i][1] = data[i].longitude;
                    junctionArray[i][2] = data[i].latitude;
                    addPointMarker(junctionArray[i]);
                    pointName.push(junctionArray[i][0]);
                }
			}
            function scheduleFnCall() {
                if ($rootScope.currentPage == "fakeCar") {
                    setTimeout(getFakeCarData, 3000);
                }
            }
            function updateTime() {
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
                	document.getElementById('time').innerHTML=v;
                }
                catch(e){}
                setTimeout(updateTime,1000);
            }
            updateTime();
       
			getJuctions();
			
			var junctionData;
			function getJuctions() {
				$(".dataTables_scrollBody").append(commonService.loading);
				var promise = fakeCarService.getJunctions();
				promise.then(function(data) {
					commonService.loading.remove();
					
					if (map == undefined) {
						map=addMap("fakeCarMapContainer");
                    }
					junctionData = data;
					addAllMarkers(data);
					getFakeCarData();
				}, function(data) {
					getFakeCarData();
				});
			}

            function getFakeCarData() {
                $(".dataTables_scrollBody").append(commonService.loading);
                var params = {}
                var promise = fakeCarService.getFakeCars(params);
                promise.then(function(data) {
                        commonService.loading.remove();
                        // ===== 上海地名 → 贵阳地名+真实坐标 =====
                        var GY = {
                            "上海科技馆": ["贵阳北站", 106.675, 26.615],
                            "中国商用飞机": ["龙洞堡机场", 106.780, 26.540],
                            "江南造船": ["小河", 106.690, 26.545],
                            "上海大厦": ["喷水池", 106.713, 26.583],
                            "淀山湖": ["花溪公园", 106.670, 26.430],
                            "璞麗酒店": ["观山湖公园", 106.635, 26.620],
                            "江湾体育中心": ["大营坡", 106.720, 26.605],
                            "Shanghai": ["贵阳", 106.713, 26.583],
                            "Hangzhou": ["金阳", 106.640, 26.610],
                            "上海": ["贵阳", 106.713, 26.583],
                            "陆家嘴": ["观山湖", 106.635, 26.620],
                            "外滩": ["甲秀楼", 106.718, 26.567],
                            "人民广场": ["紫林庵", 106.703, 26.585],
                            "南京路": ["大十字", 106.712, 26.578]
                        };
                        function fixLoc(loc) {
                            if (loc && loc.name && GY[loc.name]) {
                                var m = GY[loc.name];
                                loc.name = m[0];
                                loc.longitude = m[1];
                                loc.latitude = m[2];
                            }
                        }
                        if (data.fakeCars) {
                            data.fakeCars.forEach(function(fc) {
                                if (fc.locations) {
                                    fc.locations = fc.locations.map(function(n) {
                                        return GY[n] ? GY[n][0] : n;
                                    });
                                }
                                if (fc.carList) {
                                    fc.carList.forEach(function(c) { fixLoc(c.location); });
                                }
                            });
                        }
                        $scope.totalNumberOfCars = data.totalNumberOfCars

                        //时间转换
                        var fakeCars = [];
                        //alert(data.fakeCars);
                        for (var i = 0; i < data.fakeCars.length; i++) {
                            var fakeCarInstance = {}
                            fakeCarInstance.licenceNumber = data.fakeCars[i].licenceNumber
                            fakeCarInstance.locations = data.fakeCars[i].locations.join("|")
                            fakeCars.push(fakeCarInstance)
                        }
                        $scope.warningListTable.data = fakeCars;
                        $scope.warningListTable.totalRecords = fakeCars.length;
                        $scope.warningListTable.time = data.time;
                        // **** BaiduMap Code *******
                        //alert(data.fakeCars[0].carList[0].location.latitude);
                        var fakecarlength = data.fakeCars.length;
                        if (map == undefined) {
                        	map=addMap("fakeCarMapContainer");
                        }
                        //map.clearOverlays();
                        markerarr = new Array(fakecarlength);
                        for (var i = 0; i < fakecarlength; i++) {
                            markerarr[i] = new Array(data.fakeCars[i].carList.length);
                            for (var j = 0; j < data.fakeCars[i].carList.length; j++) {
                                markerarr[i][j] = new Array(7);
                                markerarr[i][j][0] = data.fakeCars[i].carList[j].licenceNumber;
                                markerarr[i][j][1] = data.fakeCars[i].carList[j].location.name;
                                markerarr[i][j][2] = data.fakeCars[i].carList[j].location.longitude;
                                markerarr[i][j][3] = data.fakeCars[i].carList[j].location.latitude;
                                markerarr[i][j][6] = data.fakeCars[i].carList[j].time;
                                addMarker(markerarr[i][j],i);
                            }
                        }
                        scheduleFnCall();
                    },

                    function(data) {
                        if (data.status == 200) {
                            commonService.loading.remove();
                            for (var i = 0; i < result.length; i++) {
                                result[i].datetimeString = timeService.fn.milliseconds2LocalTime(result[i].timestamp * 1);
                            }
                            $scope.warningListTable.data = result;
                            $scope.warningListTable.totalRecords = data.total;                            
                            
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
        dataAccessModule.tinyController('fakeCarCtrl.ctrl', leftMenuCtrl);
        return dataAccessModule;
    });