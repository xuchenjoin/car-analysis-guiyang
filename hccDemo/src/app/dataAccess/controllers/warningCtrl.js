/**
 * 告警页面控制器
 * Created  on 2015/3/10.
 */

define(['language/dataAccess','src/app/common/commonInfo'],
function(i18n, commonInfo) {
	"use strict";

	var warningCtrl = ["$rootScope", "exception", "warningService", "commonService", "$scope", "$compile", "$state", "$q", "camel", "exception", "storage", "$stateParams", "mask","timeService",
	function($rootScope, exceptionServiceIns, warningService, commonService, $scope, $compile, $state, $q, camel, exception, storage, $stateParams, mask, timeService) {
		$scope.commonInfo = commonInfo;
		$scope.i18n = i18n;
        var requestNum = 10;
        var alarmType = 'ALL';

		var refreshST;
		$scope.warningList = []; //告警信息存储数组
		$scope.serviceList = []; //已购买服务名称存储列表
		// 获取初始化信息
		$scope.$on("$viewContentLoaded",function() {});

		//停止自动刷新
		$scope.$on('$destroy',
		function(event, newUrl, oldUrl) {

		});
		// 刷新VM表格的事件
		$scope.$on("refreshVmTableEvent",function listener(event) {});
		
		// refresh table
        $scope.refreshBtn = {
            "click":function(){
            	refreshWarningList($stateParams.page, requestNum, alarmType);
            }
        }

		$scope.warningListTable = {
			"id": "warningListTable",
			"enablePagination": "auto",
			"lengthChange": true,
           	        "lengthMenu":[10,20,50],
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
				"sTitle": i18n.dps_alarm_list_table_level_title,
				"mData": "alarmType",
				"bSortable": false,
				"sWidth": "10%"
			},
			{
				"sTitle": i18n.dps_alarm_list_table_service_title,
				"mData": "sourceName",
				"bSortable": false,
				"sWidth": "10%"
			},
			
			{
				"sTitle": i18n.dps_alarm_list_table_time_title,
				"mData": "datetimeString",
				"bSortable": false,
				"sWidth": "220px"
			},
			{
				"sTitle": i18n.dps_alarm_list_table_descript_title,
				"mData": "message",
				"bSortable": false,
				"sWidth": "60%"
			}],
			
			"changeSelect": function(evtObj) {
				$scope.warningListTable.displayLength = evtObj.displayLength;
				$stateParams['results-per-page'] = evtObj.displayLength;
				requestNum = evtObj.displayLength;
				$stateParams.page = 1;
                refreshWarningList($stateParams.page, requestNum, alarmType);
			},
			"callback": function(evtObj) {
				$stateParams.page = evtObj.currentPage;

				refreshWarningList($stateParams.page, requestNum, alarmType);
			},
			"renderRow": function(nRow, aData, iDataIndex) {
				/* 自定义状态列 */
				
				var criticalStr = "<div  class='pull-left alarm-danger-icon'></div>"+"<div class='pull-left'>"+i18n.dps_alarm_list_search_critical+"</div>";
				var warningStr = "<div  class='pull-left alarm-warning-icon'></div>"+"<div class='pull-left'>"+i18n.dps_alarm_list_search_warning+"</div>";
				var infoStr = "<div  class='pull-left alarm-caution-icon'></div>"+"<div class='pull-left'>"+i18n.dps_alarm_list_search_remind+"</div>";

				var statusStr = "";
				if (aData.alarmType === 'ERROR') {
					statusStr = criticalStr;
				} else if (aData.alarmType === 'WARNING') {
					statusStr = warningStr;
				} else {
					statusStr = infoStr;
				}
				var statusLink = $compile(statusStr);
				var statusScope = $scope.$new();
				var statusNode = statusLink(statusScope);
				$("td:eq(0)", nRow).html(statusNode);
			}
		};

		refreshWarningList(1, 10, alarmType);
        //动态修改下拉搜索框数据,当后台数据量较大时不会一次返回所有数据，故下拉搜索框与告警列表显示表不能共用一个接口
        function getLevelSelect(){
            var promise=warningService.getLevelSelectValue();
            $(".dataTables_scrollBody").append(commonService.loading);
            promise.then(function(data){
            	commonService.loading.remove();
                if(data){
                    $scope.levelSelect.values[0].label=i18n.dps_alarm_list_search_all+"("+data.alarmTypeAll+")";
                    $scope.levelSelect.values[1].label=i18n.dps_alarm_list_search_critical+"("+data.alarmTypeError+")";
                    $scope.levelSelect.values[2].label=i18n.dps_alarm_list_search_warning+"("+data.alarmTypeWarning+")";
                    $scope.levelSelect.values[3].label=i18n.dps_alarm_list_search_remind+"("+data.alarmTypePassive+")";
                }
            },function(data){
                if(data.status == 200){
                    commonService.loading.remove();
                    $scope.levelSelect.values[0].label=i18n.dps_alarm_list_search_all+"("+data.alarmTypeAll+")";
                    $scope.levelSelect.values[1].label=i18n.dps_alarm_list_search_critical+"("+data.alarmTypeError+")";
                    $scope.levelSelect.values[2].label=i18n.dps_alarm_list_search_warning+"("+data.alarmTypeWarning+")";
                    $scope.levelSelect.values[3].label=i18n.dps_alarm_list_search_remind+"("+data.alarmTypePassive+")";
                }else{
                    commonService.loading.remove();
                    $scope.levelSelect.values[0].label=i18n.dps_alarm_list_search_all+"("+'0'+")";
                    $scope.levelSelect.values[1].label=i18n.dps_alarm_list_search_critical+"("+'0'+")";
                    $scope.levelSelect.values[2].label=i18n.dps_alarm_list_search_warning+"("+'0'+")";
                    $scope.levelSelect.values[3].label=i18n.dps_alarm_list_search_remind+"("+'0'+")";
                    var message = i18n.alarmList;
                    commonService.netErrorTip(i18n,  data, message)
                }
            })
        }
		//计算告警数量
		function refreshWarningList(pageIndex, requestNum, alarmType) {
            $(".dataTables_scrollBody").append(commonService.loading);
            if(pageIndex && requestNum && alarmType){
                var params = {
                    offset: pageIndex,
                    count: requestNum,
                    alarmType : alarmType
                };


			var promise = warningService.getWarningList(params);
			promise.then(function(data) {
                commonService.loading.remove();
				var result = commonService.htmlEncode(data.alarms);
				$scope.warningList = result;
				//时间转换
				for(var i=0;i<result.length;i++){
                    result[i].datetimeString = timeService.fn.milliseconds2LocalTime(result[i].timestamp * 1);
                   /* var str=result[i].message.match(/([^\[\]]+)(?=\])/g);
                    result[i].id=str[0].split("=")[1];*/
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

			},
			function(data){
				if(data.status == 200){
                    commonService.loading.remove();
					var result = commonService.htmlEncode(data.alarms);
					$scope.warningList = result;
					//时间转换
					for(var i=0;i<result.length;i++){
						result[i].datetimeString = timeService.fn.milliseconds2LocalTime(result[i].timestamp*1);
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
			    }else{
                    commonService.loading.remove();
                    var message = i18n.alarmList;
                    commonService.netErrorTip(i18n,  data, message);
                }
			});

                clearTimeout(refreshST);
                refreshST = setTimeout(function() {}, commonService.WAIT_TIME);
            }
            getLevelSelect();
		}

        // 警告级别选择框
        $scope.levelSelect = {
            "id": "levelSelect",
            "values": [{
                "selectId": "00",
                // 下拉选项的id值，必须唯一
                "label": i18n.dps_alarm_list_search_all,
                // 下拉选项中文本设置   全部
                "checked": true // 下拉选项选中状态设置
            },
                {
                    "selectId": "01",
                    "label": i18n.dps_alarm_list_search_critical //严重
                },
                {
                    "selectId": "02",
                    "label": i18n.dps_alarm_list_search_warning //警告
                },
                {
                    "selectId": "03",
                    "label": i18n.dps_alarm_list_search_remind //提醒
                }],
            "width": 400,
            "display": true,
            "change": function() {
                var selectId = $("#levelSelect").widget().getSelectedId();
                var selectLevel = 'ALL';
                var selectedWarningList = [];
                switch (selectId) {
                    case '01':
                        selectLevel = 'ERROR';
                        break;
                    case '02':
                        selectLevel = 'WARNING';
                        break;
                    case '03':
                        selectLevel = 'PASSIVE';
                        break;
                    default:
                        selectLevel = 'ALL';
                }
                if (selectLevel == 'ALL') {
                    alarmType = 'ALL';
                    refreshWarningList(1, requestNum, alarmType);
                    $scope.warningListTable.tableLanguage={"sEmptyTable":i18n.dps_table_no_data_record};
                } else {
                    alarmType = selectLevel;
                    refreshWarningList(1, requestNum, alarmType);
                    $scope.warningListTable.tableLanguage={"sEmptyTable":i18n.dps_table_no_data_record};
                }
            }
        };
	}];

	var dataAccessModule = angular.module('dataAccess.config');
	dataAccessModule.tinyController('warning.ctrl', warningCtrl);
	return dataAccessModule;
});