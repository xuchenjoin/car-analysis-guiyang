define(['language/dataAccess','src/app/common/commonInfo'],
function(i18n, commonInfo) {
	"use strict";
	var operationLogsCtrl = function($rootScope, $scope, $state, $stateParams, $compile, mask, operationLogsService, commonService, timeService) {
		$scope.commonInfo = commonInfo;
		$scope.i18n = i18n;
		var deleteClientId, deleteVersion;
		var requestNum = 10; // number of instances for request
        var endTime_ = commonService.FormatDate((new Date())/1000, true);
        var startTime_ = String((parseInt(endTime_.substring(0, 4)) - 3)) + endTime_.substring(4, endTime_.length);

        $scope.startTime = "";
		$scope.endTime = "";
		$scope.timeRange = {
			"label": i18n.common_term_operationDate_label + ":",
			"startTime": {
				"id": "startTime",
				"width": 154,
				"type": "datetime",
				"timeFormat": "hh:mm:ss",
				"dateFormat": "yy-mm-dd",
                "minDate": startTime_,
                "maxDate": endTime_,
				"ampm": false,
				"firstDay": 1,
				"on-close": close,
				"close": function(date) {
					var startTime_ = $("#" + startTime.id).widget().getDateTime();
					var endTime_ = $("#" + endTime.id).widget().getDateTime();
					//如果结束时间和开始时间都不为空
					if (startTime_ && endTime_) {
						//判断结束时间是否大于开始时间
						if (startTime_ > endTime_) {
                            commonService.failTip(i18n.datacraft_general_log_select_time_alert_label);
                            return;
						}
					}
					
					if(startTime_){
						$scope.startTime = commonService.FormatDate4(startTime_);
					}else{
						$scope.startTime = "";
					}
					if(endTime_){
						$scope.endTime = commonService.FormatDate4(endTime_);
                        console.log($scope.endTime);
					}else{
						$scope.endTime = "";
					}
					refreshOperationLogs(1, requestNum);
                    $scope.operationLogsTable.tableLanguage={"sEmptyTable":i18n.dps_table_no_data_record};
				}
			},
			"endTime": {
				"id": "endTime",
				"width": 154,
				"type": "datetime",
				"timeFormat": "hh:mm:ss",
				"dateFormat": "yy-mm-dd",
				"ampm": false,
				"firstDay": 1,
                "minDate": startTime_,
                "maxDate": endTime_,
				"on-close": close,
				"close": function(date) {
					var startTime_ = $("#" + startTime.id).widget().getDateTime();
					var endTime_ = $("#" + endTime.id).widget().getDateTime();
					//如果结束时间和开始时间都不为空
					if (startTime_ && endTime_) {
						//判断开始时间是否小于结束时间
						if (startTime_ > endTime_) {
                            commonService.failTip(i18n.datacraft_general_log_select_time_alert_label);
							return;
						}
					}
					
					if(startTime_){
                       $scope.startTime = commonService.FormatDate4(startTime_);
                    }else{
                    	$scope.startTime = "";
                    }
					if(endTime_){
						$scope.endTime = commonService.FormatDate4(endTime_);
					}else{
						$scope.endTime = "";
					}
					refreshOperationLogs(1, requestNum);
                    $scope.operationLogsTable.tableLanguage={"sEmptyTable":i18n.dps_table_no_data_record};
				}
			}
		};
        // The table to show operation logs list information
		$scope.operationLogsTable = {
			"id": "operationLogsTable",
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
				"sTitle": "<div class='title-padding'>" + i18n.dps_operation_logs_table_pipleline_name + "</div>",
				// operationType
				"mData": "sourceName",
				"sWidth": "25%",
				"bSortable": false
			},{
				"sTitle": "<div class='title-padding'>" + i18n.dps_operation_logs_table_operate_type + "</div>",
				// operationType
				"mData": "operation",
				"sWidth": "20%",
				"bSortable": false
			},{
				"sTitle": "<div class='title-padding'>" + i18n.dps_operation_logs_table_operate_state + "</div>",
				// operationDescription
				"mData": "status",
				"sWidth": "20%",
				"bSortable": false
			}, {
                "sTitle": "<div class='title-padding'>" + i18n.dps_operation_logs_table_user_ip + "</div>",
                // operationDescription
                "mData": "userIp",
                "sWidth": "15%",
                "bSortable": false
            },
			{
				"sTitle": "<div class='title-padding'>" + i18n.dps_operation_logs_table_create_time + "</div>",
				"mData": "startTime",
				"sWidth": "20%",
				"bSortable": false
			}],
			"changeSelect": function(evtObj) {
				$scope.operationLogsTable.displayLength = evtObj.displayLength;
				$stateParams['results-per-page'] = evtObj.displayLength;
				requestNum = evtObj.displayLength;
				$stateParams.page = 1;
				refreshOperationLogs($stateParams.page, requestNum);
			},
			"callback": function(evtObj) {
				$stateParams.page = evtObj.currentPage;
				refreshOperationLogs($stateParams.page, requestNum);
			},
			'cellClickActive': function(event, trData) {},
			"tHeadCheckboxFn": function(isAllChecked, event) {},
			"renderRow": function(nRow, aData, iDataIndex) {
			}
		};
		
		// refresh table
        $scope.refreshBtn = {
            "click":function(){
            	refreshOperationLogs($stateParams.page, requestNum);
            }
        }
		
		function refreshOperationLogs(pageIndex, requestNum) {
			var startTime = $scope.startTime;
			var endTime = $scope.endTime;
			var params = {
				offset: pageIndex,
				count: requestNum,
				startDate: startTime,
				endDate: endTime
			};
			operationLogs(params);
		}

		function operationLogs(params) {
			var promise = operationLogsService.getOperationLogs(params);
			$(".dataTables_scrollBody").append(commonService.loading);
			promise.then(function(data) {
				commonService.loading.remove();
				var result=data;
                for(var i = 0; i < result.auditLog.operations.length; i++){
                    result.auditLog.operations[i].startTime = commonService.formatDate5(result.auditLog.operations[i].startTime);
                }
				var data_ = commonService.htmlEncode(result.auditLog.operations);
				$scope.operationLogsTable.data = data_;
				$scope.operationLogsTable.totalRecords = result.auditLog.total;
			},
			function(data){
				if(data.status == 200){
                    commonService.loading.remove();
                    var result=data;
                    for(var i = 0; i < result.auditLog.operations.length; i++){
                        result.auditLog.operations[i].startTime = commonService.formatDate5(result.auditLog.operations[i].startTime);
                    }
                    var data_ = commonService.htmlEncode(result.auditLog.operations);
                    $scope.operationLogsTable.data = data_;
                    $scope.operationLogsTable.totalRecords = result.auditLog.total;
			    }else{
                    commonService.loading.remove();
                    var message = i18n.operationLogs;
					commonService.netErrorTip(i18n,  data, message);
                }
			});
		}

		refreshOperationLogs(1, requestNum);
	};
	var dataAccessModule = angular.module('dataAccess.config');
	dataAccessModule.tinyController('operationLogs.ctrl', operationLogsCtrl);
	return dataAccessModule;
});