define(['language/dataAccess','src/app/common/commonInfo'],
    function(i18n, commonInfo) {
        "use strict";
        var carMovemnet = function($rootScope, $scope, $state, $stateParams, $compile, mask, showLogDetailService, commonService, timeService,storage, fakeCarService) {
        	var refreshST;
            $scope.commonInfo = commonInfo;
            $scope.warningListTable = {
        			"id": "trafficStaticsTable",
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
        				"sTitle": "Path",
        				"mData": "junction",
        				"bSortable": false,
        				"sWidth": "35%"
        			},
        			{
        				"sTitle": "Traffic (Vehicle/Day)",
        				"mData": "throughPut",
        				"bSortable": false,
        				"sWidth": "65%"
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

        				getCarMovemnetData($stateParams.page, requestNum, alarmType);
        			},
        			"renderRow": function(nRow, aData, iDataIndex) {        			
        			}
        			
        		};
            getCarMovemnetData(1, 10, "alarmType");
            function getCarMovemnetData(pageIndex, requestNum, alarmType) {
                $(".dataTables_scrollBody").append(commonService.loading);
                if(pageIndex && requestNum && alarmType){
                    var params = {
                        offset: pageIndex,
                        count: requestNum,
                        alarmType : alarmType
                    };

    			var promise = fakeCarService.getHightTrafficData(params);
    			promise.then(function(data) {
                    commonService.loading.remove();    				
    				$scope.warningListTable.data = data.highTrafficAreas;
    				$scope.warningListTable.totalRecords = data.highTrafficAreas.length;                 
    			},
    			function(data){
    				if(data.status == 200){
                        commonService.loading.remove();    					
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
    		}
            $scope.i18n = i18n;           
        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('trafficStatics.ctrl', carMovemnet);
        return dataAccessModule;
    });