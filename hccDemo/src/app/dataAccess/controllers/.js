define(
    ['language/dataAccess', "app-remote/services/tipMsgService", 'src/app/common/commonInfo', 'app/dataAccess/controllers/windows/pipelineDetailsCtrl'],
    function (i18n, tipMsgService, commonInfo) {
        "use strict";
        var instanceListCtrl = function ($rootScope, $scope, $state, $stateParams, $compile, mask, instanceListService, commonService, timeService, storage, camel) {
            $scope.commonInfo = commonInfo;
            $scope.i18n = i18n;
            //将$scope.searchString初始值赋值为空，是解决初始化时搜索框没有值，pipelineName值为undefined，此时向后台发送请求无法获取到工作流列表的值
            $scope.searchString = "";
            var tipMessageService = new tipMsgService();
            var requestNum = 10; // number of instances for request
            var refreshST; // refresh loop execute id
            var win;//createPipeline windows
            var ListParam = 'All';
            var PIPELINE_DELETED = "1";
            var ENVIRONMENT_FLag = commonService.getEnvironmentFlag();  //true for hws environment and false for tlf environment
            /*西电和HEC版本了解更多链接拼接方式不同*/
            if(ENVIRONMENT_FLag){
                $scope.LearnMoreLink=commonInfo.dpsPipelineListPageUrl.hws.helpPagePath;
            }else{
                $scope.LearnMoreLink=commonInfo.dpsPipelineListPageUrl.tef.helpPagePath;
            }

            var urlHostName = commonService.urlHostName;
            var hostname;
            for(var i = 0;i < urlHostName.length; i++){
                if(window.location.hostname === urlHostName[i].hostname){
                    hostname = urlHostName[i]._hostnamePay;
                }
            }
            $scope.applyMoreQuotaPage = "https://" + hostname + commonInfo.applyMoreQuotaPage;

            //te_admin权限用户才能创建pipeline
            $scope.checkUserRole = function () {
                if ($.inArray("te_admin", $rootScope.userRoles) == -1) {
                    commonService.failTip(i18n.dps_pipeline_te_admin);
                    return false;
                }
                return true;
            };
            //检查用户是否欠费
            $scope.isRestricted = false;
            $scope.checkIsRestricted = function () {
                if ($.inArray("op_restricted", $rootScope.userRoles) != -1) {
                    commonService.failTip(i18n.dps_pipeline_op_restricted);
                    $scope.isRestricted = true;
                    return false;
                }
                return true;
            };

            //get user quotas
            $scope.deferShow = false;
            $scope.getQuotaSuccess = true;
            $scope.getUserQuotas = function () {
                instanceListService.getQuotas($rootScope.projectId).then(function (data) {
                    $scope.deferShow = true;
                    $scope.quotas = data.quotas.resources[0].quota;//total quotas
                    $scope.usedQuotas = data.quotas.resources[0].used;//used quotas
                    $scope.residueQuotas = $scope.quotas - $scope.usedQuotas;//residue quotas
                    if ($scope.residueQuotas <= 0) {
                        $scope.getQuotaSuccess = false;
                        $scope.createNewButton.disable = true;
                    } else {
                        $scope.getQuotaSuccess = true;
                        if ($scope.checkIsRestricted() && $scope.checkUserRole()) {
                            $scope.createNewButton.disable = false;
                        } else {
                            $scope.createNewButton.disable = true;
                        }
                    }
                }, function (data) {
                    if (data.status == 200) {
                        $scope.deferShow = true;
                        $scope.quotas = data.quotas.resources[0].quota;//total quotas
                        $scope.usedQuotas = data.quotas.resources[0].used;//used quotas
                        $scope.residueQuotas = $scope.quotas - $scope.usedQuotas;//residue quotas
                        if ($scope.residueQuotas <= 0) {
                            $scope.getQuotaSuccess = false;
                            $scope.createNewButton.disable = true;
                        } else {
                            $scope.getQuotaSuccess = true;
                            if ($scope.checkIsRestricted() && $scope.checkUserRole()) {
                                $scope.createNewButton.disable = false;
                            } else {
                                $scope.createNewButton.disable = true;
                            }
                        }
                    } else {
                        $scope.deferShow = false;
                        $scope.createNewButton.disable = true;
                        $scope.getQuotaSuccess = false;
                        commonService.failTip(i18n.dps_pipeline_get_quotas_failed);
                    }
                });

            };
            //工作流状态下拉选择框
            var pipelineStatusValues=[{
                "selectId": "00",
                // 下拉选项的id值，必须唯一
                "label": i18n.dps_alarm_list_search_all,
                //"全部", // 下拉选项中文本设置
                "checked": true // 下拉选项选中状态设置
            },{
                "selectId": "01",
                "label": i18n.dps_pipeline_table_state_start
            },{
                "selectId": "02",
                "label": i18n.dps_pipeline_table_state_stop
            },{
                "selectId": "04",
                "label": i18n.dps_pipeline_table_state_deactivating
            },{
                "selectId": "05",
                "label": i18n.dps_pipeline_table_state_pausing
            },{
                "selectId": "06",
                "label": i18n.dps_pipeline_table_state_paused
            }];
            if(ENVIRONMENT_FLag){
                var item = {
                    "selectId": "03",
                    "label": i18n.dps_pipeline_table_state_deleted
                }
                pipelineStatusValues.push(item)
            }
            $scope.pipelineStateSelect={
                "id":"pipelineStateSelect",
                "values": pipelineStatusValues,
                "width":"200",
                "display":true,
                "change": function() {
                    var selectId = $("#pipelineStateSelect").widget().getSelectedId();
                    var PipelineStatus="All";
                    var selectedPipelineStatus = [];
                    switch (selectId){
                        case '01':
                            PipelineStatus = 'on-scheduled';
                            break;
                        case '02':
                            PipelineStatus = 'inactive';
                            break;
                        case '03':
                            PipelineStatus = 'deleted';
                            break;
                        case '04':
                            PipelineStatus = 'deactivating';
                            break;
                        case '05':
                            PipelineStatus = 'pausing';
                            break;
                        case '06':
                            PipelineStatus = 'paused';
                            break;
                        default:
                            PipelineStatus = 'All';
                    }
                    if (PipelineStatus == 'All'){
                        ListParam = 'All';
                        refreshInstanceList(1, requestNum,$scope.searchString);
                        $scope.instanceListTable.tableLanguage={"sEmptyTable":i18n.dps_table_no_data_record};
                    }else{
                        ListParam = PipelineStatus;
                        refreshInstanceList(1, requestNum,$scope.searchString);
                        $scope.instanceListTable.tableLanguage={"sEmptyTable":i18n.dps_table_no_data_record};
                    }
                    $stateParams.page = 1;
                    $scope.instanceListTable.currentPage = {
                        "pageIndex": 1
                    };
                }
            }
            // button model which is used to apply for new instance
            $scope.createNewButton = {
                "id": "createNewButton",
                "text": i18n.dps_pipeline_apply_new_instance_btn, // 初始数据为空
                "disable": false,
                "iconsClass": {"left": "apply-btn-icon"},
                "click": function () {
                    if(ENVIRONMENT_FLag){
                        /* TODO:go to apply for new instance page */
                        storage.add("infoObj", "");
                         storage.add("period", "1");
                         storage.add("feeInfo", "85.00");
                         var createPipelineUrl = $rootScope.genHWSHref(commonService.webRoot + "/?locale=" + (urlParams.lang) + "#/createOrder/createOrderConfig");
                         commonService.safeOpenURL(createPipelineUrl);
                    }else{
                        var options = {
                            title: i18n.dps_pipeline_apply_new_instance_btn,
                            height: "auto",
                            width: "400px",
                            "content-type": 'url',
                            content: "src/app/dataAccess/views/windows/createInstance.html",
                            resizable: false,
                            maximizable: false,
                            minimizable: false,
                            beforeClose: function () {
                            },
                            buttons: [{
                                key: "btnOK",
                                label: i18n.confirm1,
                                focused: true,//默认焦点
                                handler: function (event) {

                                    /*var createInstanceScope = angular.element('#createInstanceContainer').scope();
                                     var promise = createInstanceScope.confirmCreatePipelineButton.click();
                                     if (tinyWidget.UnifyValid.FormValid($("#createPipelineForm"))) {
                                     storage.add("infoObj", "");
                                     storage.add("period", "1");
                                     storage.add("feeInfo", "85.00");
                                     $state.go("manage.createOrder.createOrderConfig");
                                     }*/

                                    //下面的注释不要删
                                    $scope.searchString = "";
                                    if (tinyWidget.UnifyValid.FormValid($("#createPipelineForm"))) {
                                        commonService.showSuccess($scope, i18n.dps_pipeline_creating);
                                    }
                                    var createInstanceScope = angular.element('#createInstanceContainer').scope();
                                    var promise = createInstanceScope.confirmCreatePipelineButton.click(ENVIRONMENT_FLag);
                                    promise.then(function (data) {
                                        if (data == "No Content") {
                                            win.destroy();
                                            refreshInstanceList($stateParams.page, requestNum);
                                            setTimeout(function () {
                                                commonService.showWarn($scope, i18n.dps_pipeline_fail);
                                                $scope.$apply();
                                            }, 1000);
                                        } else {
                                            win.destroy();
                                            refreshInstanceList($stateParams.page, requestNum);
                                            setTimeout(function () {
                                                commonService.showSuccess($scope, i18n.dps_canvas_hint_sucessCode);
                                                $scope.$apply();
                                            }, 1000);
                                        }
                                    }, function (data) {
                                        if (data.status == 200) {
                                            win.destroy();
                                            refreshInstanceList($stateParams.page, requestNum);
                                            setTimeout(function () {
                                                commonService.showSuccess($scope, i18n.dps_canvas_hint_sucessCode);
                                                $scope.$apply();

                                            }, 1000);
                                        } else {
                                            commonService.showNetError($scope, i18n, data);
                                        }
                                    })
                                }
                            }, {
                                key: "btnCancel",
                                label: i18n.cancel,
                                focused: false,
                                handler: function (event) {
                                    win.destroy();
                                }
                            }]
                        };
                        win = new tinyWidget.Window(options);
                        win.show();
                    }


                }
            };

            //te_admin权限用户才能创建pipeline
            if($.inArray("te_admin",$rootScope.userRoles) != -1){
                $scope.createNewButton.disable = false;
            }else{
                $scope.createNewButton.disable = true;
            }

            /*验证pipelineName是否合法*/
            function validSerchInput(searchString) {
                if (searchString) {
                    if (!/^([A-Za-z0-9_-]+)$/.test(searchString)) {
                        commonService.failTip(i18n.validate_pipeline_search_special_char_warning);
                        return false;
                    }
                    return true;
                }
            }

            $scope.instanceListSearchBox = {
                "id": "instanceListSearchBox",
                "display": true,
                "width": 250,
                "placeholder": i18n.dps_pipeline_search_placeholder,
                "suggestSize": "10",
                "maxLength": 100,
                "search": function (searchString) {
                    if (searchString) {
                        if (!validSerchInput(searchString)) {
                            return false;
                        }
                    }
                    $scope.searchString = searchString;
                    refreshInstanceList(1, requestNum, searchString);
                    $scope.instanceListTable.tableLanguage = {"sEmptyTable": i18n.dps_table_no_data_record};
                    /*当工作流列表切换到第二页时，如果搜索结果显示多页，也从搜索结果的第一页开始显示*/
                    $stateParams.page = 1;
                    $scope.instanceListTable.currentPage = {
                        "pageIndex": 1
                    };
                },
                "suggest": function (content) {

                },
                "clearCallback": function (event) {
                    $scope.searchString="";
                    refreshInstanceList($stateParams.page, requestNum,$scope.searchString);
                }
            };

            // refresh table
            $scope.refreshBtn = {
                "click": function () {
                    refreshInstanceList($stateParams.page, requestNum);
                }
            };
            // The table to show instance list information
            $scope.instanceListTable = {
                "id": "instanceListTable",
                "enablePagination": "auto",
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "displayLength": $stateParams['results-per-page'],
                "currentPage": {
                    pageIndex: $stateParams.page
                },
                "totalRecords": 0,
                "draggable": true,
                /*"sorting":[[0,'asc'],[1,'desc']],*/
                "data": [],
                "value": null,
                "curRow": null,
                "checkbox": false,
                "paginationStyle": "full_numbers",
                "tableLanguage": {
                    "sEmptyTable": i18n.dps_table_no_data_show
                },
                "showDetails": true,
                "columns": [{
                    "sTitle": "",
                    "mData": "",
                    "bSortable": false,
                    "sWidth": "3%"
                },
                    {
                        "sTitle": i18n.pipelineNameTabletitle,
                        "mData": "pipelineName",
                        "bSortable": false,
                        "sWidth": "12%"
                    },
                    {
                        "sTitle": i18n.dps_pipeline_table_state_title,
                        "mData": "",
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": i18n.dps_pipeline_table_schedule_interval_title,
                        "mData": "",
                        "bSortable": false,
                        "sWidth": "14%"
                    },
                    {
                        "sTitle": i18n.dps_pipeline_table_schedule_start_title,
                        "mData": "schedule.startTime",
                        "bSortable": false,
                        "sWidth": "22%"
                    },
                    {
                        "sTitle": i18n.dps_pipeline_table_schedule_end_title,
                        "mData": "schedule.endTime",
                        "bSortable": false,
                        "sWidth": "22%"
                    },
                    {
                        "sTitle": i18n.dps_pipeline_table_operation_title,
                        "mData": "",
                        "bSortable": false,
                        "sWidth": ""
                    }],
                "changeSelect": function (evtObj) {
                    $scope.instanceListTable.displayLength = evtObj.displayLength;
                    $stateParams['results-per-page'] = evtObj.displayLength;
                    requestNum = evtObj.displayLength;
                    $stateParams.page = 1;
                    /** TODO:refresh table* */
                    refreshInstanceList($stateParams.page, requestNum);
                },
                "callback": function (evtObj) {
                    $stateParams.page = evtObj.currentPage;
                    /** TODO:refresh table* */
                    refreshInstanceList($stateParams.page, requestNum, $scope.searchString);
                },
                "cellClickActive": function (event, trData) {
                    $scope.instanceListTable.value = trData;
                    $scope.instanceListTable.curRow = event.currentTarget
                },
                "tHeadCheckboxFn": function (isAllChecked, event) {
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    /** TODO:render row* */
                    var optScope = $scope.$new();
                    //删除工作流
                    optScope.deleteBtn = {
                        "text": i18n.dps_pipeline_table_delete,
                        "click": function () {
                            var str = i18n.dps_pipeline_delete_stream_msg;
                            var message = str.replace("{0}", aData.pipelineName);
                            var confirmButton = [{
                                key: "btnId1",
                                label: i18n.confirmDelete,
                                handler: function (event) {
                                    // no need to notify user for such instantly task, just tell them the result.
                                    var deleteFlag = 1;

                                    var promise = deletePipeline(aData.pipelineId, deleteFlag);

                                    promise.then(function (data) {
                                        if (data == "No Content") {
                                            commonService.failTip(i18n.dps_pipeline_delete_fail);
                                        } else {
                                            if ($scope.instanceListTable.totalRecords > requestNum && $scope.instanceListTable.totalRecords % requestNum === 1 && $stateParams.page > 1) {
                                                refreshInstanceList($stateParams.page - 1, requestNum);
                                            } else {
                                                refreshInstanceList($stateParams.page, requestNum);
                                            }
                                            commonService.successTip(i18n.dps_pipeline_delete_stream_success_msg.replace("{0}", aData.pipelineName));
                                        }
                                    }, function (data) {
                                        if (data.status === 200) {
                                            if ($scope.instanceListTable.totalRecords > requestNum && $scope.instanceListTable.totalRecords % requestNum === 1 && $stateParams.page > 1) {
                                                refreshInstanceList($stateParams.page - 1, requestNum);
                                            } else {
                                                refreshInstanceList($stateParams.page, requestNum);
                                            }
                                            commonService.successTip(i18n.dps_pipeline_delete_stream_success_msg.replace("{0}", aData.pipelineName));
                                        } else {
                                            commonService.netErrorTip(i18n, data, i18n.dps_pipeline_delete_stream_failed_msg.replace("{0}", aData.pipelineName));
                                        }
                                    });
                                }
                            },
                                {
                                    key: "btnId2",
                                    label: i18n.dps_canvas_hint_confirmCancel,
                                    focused: true,
                                    accessKey: '3',
                                    handler: function (event) {
                                    }
                                }];
                            commonService.message(message, {type: "warn", buttons: confirmButton});
                        }
                    };

                    // click this button to edit pipeline
                    optScope.scheduleBtn = {
                        "text": i18n.dps_canvas_toolbar_pipelineschedule,
                        "click": function (event) {
                            $rootScope.pipelineId = aData.pipelineId;
                            var options = {
                                width: "500px",
                                height: "420px",
                                "content-type": "url",
                                content: "src/app/dataAccess/views/deployScheduleInfo.html",
                                title: i18n.dps_canvas_toolbar_schedule_title,
                                buttons: [{
                                    key: "btnOK",
                                    label: i18n.confirm1,
                                    focused: true,
                                    handler: function (event) {
                                        $scope.exchangToMillSecondsAnother = function (type, value) {
                                            switch (type) {
                                                case "1":
                                                    return value * 60 * 1000;
                                                    break;
                                                case "2":
                                                    return value * 60 * 60 * 1000;
                                                    break;
                                                case "3":
                                                    return value * 24 * 60 * 60 * 1000;
                                                    break;
                                                case "4":
                                                    return value * 7 * 24 * 60 * 60 * 1000;
                                            }

                                        };

                                        $scope.exchangToMillSeconds = function (type, value) {
                                            switch (type) {
                                                case "1":
                                                    return value + " minutes";
                                                    break;
                                                case "2":
                                                    return value + " hours";
                                                    break;
                                                case "3":
                                                    return value + " days";
                                                    break;
                                                case "4":
                                                    return value + " weeks";
                                            }

                                        };
                                        var scheduleInfoWindow = angular.element('#scheduleInfoWindow').scope();
                                        var timeType = $("#selectType").widget().getSelectedId();
                                        var timeValue = $("#selectTime").widget().getSelectedLabel();
                                        var timeResult = $scope.exchangToMillSeconds(timeType, timeValue);
                                        var timeResultAnother = $scope.exchangToMillSecondsAnother(timeType, timeValue);

                                        var startTmp = $("#" + startTime.id).widget().getDateTime();
                                        if(startTmp==""){
                                            tipMessageService.clearErrorMessages();
                                            tipMessageService.alert("error", i18n.dps_canvas_toolbar_startTime, '0px');
                                            return;
                                        }
                                        var startTmpResult = new Date(startTmp.replace("-","/").replace("-","/")).toISOString();
                                        var startTimeResult = startTmpResult.substring(0, startTmpResult.indexOf('.')) + startTmpResult.charAt(startTmpResult.length - 1)
                                        var startTime_ = new Date(startTmp).getTime();


                                        var endTmp = $("#" + endTime.id).widget().getDateTime();
                                        if(endTmp==""){
                                            tipMessageService.clearErrorMessages();
                                            tipMessageService.alert("error", i18n.dps_canvas_toolbar_endTime, '0px');
                                            return;
                                        }
                                        var endTmpResult = new Date(endTmp.replace("-","/").replace("-","/")).toISOString();
                                        var endTimeResult = endTmpResult.substring(0, endTmpResult.indexOf('.')) + endTmpResult.charAt(endTmpResult.length - 1)
                                        var endTime_ = new Date(endTmp).getTime();
                                        $scope.availableId = $("#" + scheduleInfoWindow.endRadioGroup.id).widget().opChecked("checked");
                                        if (startTime_ && endTime_ && timeResultAnother && $scope.availableId == "1") {
                                        /*if (startTime_ && endTime_ && timeResultAnother) {*/
                                            var newdata=new Date().getTime()
                                            if (endTime_ < new Date().getTime()) {
                                                tipMessageService.clearErrorMessages();
                                                tipMessageService.alert("error", i18n.dps_canvas_toolbar_nowTest, '0px');
                                                return;
                                            } else if (endTime_ < startTime_) {
                                                tipMessageService.clearErrorMessages();
                                                tipMessageService.alert("error", i18n.dps_canvas_toolbar_timeName, '0px');
                                                return;
                                            } else if (endTime_ - startTime_ < timeResultAnother) {
                                                tipMessageService.clearErrorMessages();
                                                tipMessageService.alert("error", i18n.dps_canvas_toolbar_notOver, '0px')
                                                return;
                                            }
                                        }
                                        /*var schedule = {
                                            "id": aData.pipelineId,
                                            "type": "SCHEDULE",
                                            "scheduleType": "TIMER",
                                            "startTime": startTimeResult,
                                            "endTime": endTimeResult,
                                            "interval": timeResult
                                        };*/
                                        var schedule = {
                                            "id": aData.pipelineId,
                                            "type": "SCHEDULE",
                                            "scheduleType": "TIMER",
                                            "startTime": startTimeResult,
                                            "interval": timeResult
                                        };
                                        if($scope.availableId == "1"){
                                            schedule.endTime = endTimeResult;
                                        }
                                        commonService.getProcessGroupPromise(aData.pipelineId).then(function (response) {
                                            var groupList = response;
                                            if (groupList) {
                                                $scope.groupObj = groupList;
                                                var finaldata = {
                                                    "schedule": schedule,
                                                    "pipelineId": aData.pipelineId,
                                                    "pipelineObjects": $scope.groupObj.pipelineObjects
                                                };
                                                var url = "rest/api/v1/datacraft/controller/pipeline/root/editPipeline";
                                                var param = JSON.stringify(finaldata);
                                                console.log(param);
                                                var promise = camel.post({
                                                    url: url,
                                                    params: param,
                                                    timeout: 12000
                                                });
                                                promise.then(function () {
                                                    win.destroy();
                                                    commonService.successTip(i18n.dps_pipeline_table_schedule_save_success);
                                                    refreshInstanceList($stateParams.page, requestNum);
                                                },function(data){
                                                    commonService.netErrorTip(i18n, data);
                                                })
                                            }
                                        },function(data){
                                            commonService.netErrorTip(i18n, data);
                                        })


                                    }
                                }, {
                                    key: "btnCancel",
                                    label: i18n.cancel,
                                    focused: false,
                                    handler: function (event) {
                                        win.destroy();
                                    }
                                }]
                            };
                            var win = new tinyWidget.Window(options);
                            win.show();
                        }
                    };
                    optScope.editBtn = {
                        "text": i18n.dps_pipeline_table_edit,
                        "click": function () {
                            commonService.safeOpenURL(commonService.webRoot + "/#/canvas?groupId=" + aData.pipelineId);
                        }
                    };

                    //运行/暂停调度任务
                    optScope.stateBtn = {
                        //"text": aData.status == "on-scheduled" ? i18n.pauseSchedule : i18n.dps_pipeline_table_operation,
                        "text": aData.status == "on-scheduled" ? i18n.pauseSchedule : (aData.status == "paused" || aData.status == "pausing" ? i18n.continueSchedule : i18n.dps_pipeline_table_operation),
                        "click": function (data) {
                            if (aData.status == "on-scheduled") {
                                var promise = instanceListService.unschedulePipelineJob(aData.pipelineId);
                                promise.then(function (data) {
                                        if (data == undefined) {
                                            commonService.failTip(i18n.dps_pipeline_schedule_stop_failed_msg.replace("{0}", aData.pipelineName));
                                        } else {
                                            refreshInstanceList($stateParams.page, requestNum);
                                            commonService.successTip(i18n.dps_pipeline_schedule_stop_success_msg.replace("{0}", aData.pipelineName));
                                        }
                                    },
                                    function (data) {
                                        if (data.status == "200") {
                                            refreshInstanceList($stateParams.page, requestNum);
                                            commonService.successTip(i18n.dps_pipeline_schedule_stop_success_msg.replace("{0}", aData.pipelineName));
                                        } else {
                                            commonService.netErrorTip(i18n, data, i18n.dps_pipeline_schedule_stop_failed_msg.replace("{0}", aData.pipelineName));
                                        }
                                    }
                                );
                            }
                            if (aData.status == "inactive" || aData.status == "paused") {
                                var promise = startpipelineonce(aData.pipelineId);
                                promise.then(function (data) {
                                        if (data == undefined) {
                                            commonService.failTip(i18n.dps_pipeline_schedule_start_failed_msg.replace("{0}", aData.pipelineName));
                                        } else {
                                            refreshInstanceList($stateParams.page, requestNum);
                                            commonService.successTip(i18n.dps_pipeline_state_start.replace("{0}", aData.pipelineName));
                                        }
                                    },
                                    function (data) {
                                        if (data.status == 200) {
                                            refreshInstanceList($stateParams.page, requestNum);
                                            commonService.successTip(i18n.dps_pipeline_state_start.replace("{0}", aData.pipelineName));
                                        } else {
                                            commonService.netErrorTip(i18n, data, i18n.pipelineStartOnce.replace("{0}", aData.pipelineName));
                                        }
                                    }
                                )
                            }
                        }
                    };

                    //终止调度任务
                    optScope.deleteScheduleButton = {
                        "text": i18n.dps_pipeline_table_stop,
                        "click": function (data) {
                            var str = i18n.dps_pipeline_schedule_delete_msg;
                            var message = str.replace("{0}", aData.pipelineName);
                            var confirmButton = [{
                                key: "btnId1",
                                label: i18n.confirmYes,
                                handler: function (event) {
                                    var promise = deleteschedulePipeline(aData.pipelineId);
                                    promise.then(
                                        function (data) {
                                            refreshInstanceList($stateParams.page, requestNum);
                                            commonService.successTip(i18n.dps_pipeline_schedule_delete_success_msg.replace("{0}", aData.pipelineName));
                                        }, function (data) {
                                            if (data.status == "200") {
                                                refreshInstanceList($stateParams.page, requestNum);
                                                commonService.successTip(i18n.dps_pipeline_schedule_delete_success_msg.replace("{0}", aData.pipelineName));
                                            } else {
                                                commonService.netErrorTip(i18n, data, i18n.dps_pipeline_schedule_delete_failed_msg.replace("{0}", aData.pipelineName));
                                            }
                                        });
                                }
                            },
                                {
                                    key: "btnId2",
                                    label: i18n.dps_canvas_hint_confirmCancel,
                                    focused: true,
                                    accessKey: '3',
                                    handler: function (event) {
                                    }
                                }];
                            commonService.message(message, {type: "warn", buttons: confirmButton});
                        }
                    };

                    //click this button to restore pipeline
                    optScope.restorePipelineButton = {
                        "text": i18n.dps_pipeline_table_restore,
                        "click": function (data) {
                            var str = i18n.dps_pipeline_list_restore_msg;
                            var message = str.replace("{0}", aData.pipelineName);
                            var confirmButton = [{
                                key: "btnId1",
                                label: i18n.confirmYes,
                                focused: true,
                                handler: function (event) {
                                    var promise = restorePipeline(aData.pipelineId);
                                    promise.then(
                                        function (data) {
                                            refreshInstanceList($stateParams.page, requestNum);
                                            commonService.successTip(i18n.dps_pipeline_list_restore_success_msg.replace("{0}", aData.pipelineName));
                                        }, function (data) {
                                            if (data.status == "200") {
                                                refreshInstanceList($stateParams.page, requestNum);
                                                commonService.successTip(i18n.dps_pipeline_list_restore_success_msg.replace("{0}", aData.pipelineName));
                                            } else {
                                                commonService.netErrorTip(i18n, data, i18n.dps_pipeline_list_restore_failed_msg.replace("{0}", aData.pipelineName));
                                            }
                                        });
                                }
                            },
                                {
                                    key: "btnId2",
                                    label: i18n.dps_canvas_hint_confirmCancel,
                                    accessKey: '3',
                                    handler: function (event) {
                                    }
                                }];
                            commonService.message(message, {type: "prompt", buttons: confirmButton});
                        }
                    };

                    $("td:eq(2)", nRow).html(buildStatusCell(nRow, aData, iDataIndex));
                    $("td:eq(3)", nRow).html(buildScheduleIntervalCell(nRow, aData, iDataIndex));
                    $("td:eq(6)", nRow).html(buildOperationCell(nRow, aData, iDataIndex, optScope));
                }
            };

            function isInvalidScheduleInterval(interval) {
                return [null, undefined, NaN, '', '0'].indexOf(interval) != -1;
            }

            function buildScheduleStatusCell(nRow, aData, iDataIndex) {
                if (aData) {
                    return isInvalidScheduleInterval(aData.scheduleDTO.interval) ? '' : aData.status;
                }
            }

            function buildScheduleIntervalCell(nRow, aData, iDataIndex) {
                if (isInvalidScheduleInterval(aData.schedule.interval)) {
                    return '--';
                }
                else {
                    return aData.schedule.interval;
                }
            }

            function buildStatusCell(nRow, aData, iDataIndex) {
                if (aData) {
                    if (aData.isDeleted > 0) {
                        // Status: Deleted
                        return "<div  class='pull-left pipeline-delete-icon'></div>" + "<div class='pull-left'>" + i18n.dps_pipeline_table_state_deleted + "</div>";
                    } else if (aData.status == "inactive" /*|| aData.status == "paused" */) {
                        // Status: Stoped
                        return "<div  class='pull-left status-icon status-deleted-icon'></div>" + "<div class='pull-left'>" + i18n.dps_pipeline_table_state_stop + "</div>";
                    }else if(aData.status == "paused"){
                        //Status: paused
                        return "<div  class='pull-left status-icon status-paused-icon'></div>" + "<div class='pull-left'>" + i18n.dps_pipeline_table_state_paused + "</div>";
                    }else if(aData.status == "pausing"){
                        //Status: pausing
                        return "<div  class='pull-left status-icon status-paused-icon'></div>" + "<div class='pull-left'>" + i18n.dps_pipeline_table_state_pausing + "</div>";
                    }else if(aData.status == "deactivating"){
                        //Status: deactivating
                        return "<div  class='pull-left pipeline-deactivating-icon'></div>" + "<div class='pull-left'>" + i18n.dps_pipeline_table_state_deactivating + "</div>";
                    } else {
                        // Status: Running
                        return "<div  class='pull-left status-icon status-running-icon'></div>" + "<div class='pull-left'>" + i18n.dps_pipeline_table_state_start + "</div>";
                    }
                }
            }

            function buildOperationCell(nRow, aData, iDataIndex, optScope) {
                if (aData && optScope) {
                    var urlParams = window.urlParams || {};
                    var operation = {};
                    operation.template = '<tiny-action-menu items="model.items" max-width="model.maxWidth" max-visible-num="model.maxVisibleNum"></tiny-action-menu>';
                    operation.linker = $compile(operation.template);
                    operation.scope = $scope.$new();
                    /*已停止或暂停中的工作流，终止按钮应该置灰*/
                    if (aData.status == "inactive" || aData.status == "pausing") {
                        operation.scope.cannotSetupPolicy = true;
                    } else {
                        operation.scope.cannotSetupPolicy = false;
                    }
                    var cannotStart = false;
                    /*if((aData.hasOwnProperty("scheduleDTO") && aData.scheduleDTO.hasOwnProperty("interval") && aData.scheduleDTO.interval > 0)){
                     cannotStart = true;
                     }*/
                    if (aData.isDeleted > 0) {
                        operation.scope.model = {
                            items: [{
                                text: i18n.dps_pipeline_table_restore,
                                click: optScope.restorePipelineButton.click
                            }],
                            maxWidth: "280px",
                            maxVisibleNum: 1
                        };
                    } else {
                        operation.scope.model = {
                            items: [{
                                text: i18n.dps_pipeline_table_edit,
                                click: function (event, item, itemthis) {
                                    commonService.safeOpenURL(commonService.webRoot + "/?locale=" + (urlParams.lang) + "&groupId=" + aData.pipelineId + "&pipelineName=" + aData.pipelineName + "&#/editCanvas");
                                }
                            }, {
                                text: optScope.stateBtn.text,
                                click: optScope.stateBtn.click
                            }, {
                                text: i18n.dps_pipeline_table_monitor,
                                click: function (event, item, itemthis) {
                                    //commonService.safeOpenURL(commonService.webRoot +"/?locale="+(urlParams.lang)+"&groupId=" + aData.pipelineId+"/#/manage/pipelineMonitor");
                                    window.location.href = $rootScope.genHWSHref(commonService.webRoot + "/?locale=" + (urlParams.lang) + "&groupId=" + aData.pipelineId +"&pipelineName=" + aData.pipelineName+ "&#/manage/pipelineMonitor");
                                }
                            }, {
                                text: i18n.dps_pipeline_table_delete,
                                click: optScope.deleteBtn.click
                            }, {
                                text: i18n.dps_pipeline_table_schedule,
                                click: optScope.scheduleBtn.click
                            }, {
                                /*置灰时利用title属性显示不能操作的原因*/
                                text: '<span title="' + i18n.dps_pipeline_stop_title + '">' + i18n.dps_pipeline_table_stop + '</span>',
                                disable: operation.scope.cannotSetupPolicy,
                                click: optScope.deleteScheduleButton.click
                            }],
                            maxWidth: "280px",
                            maxVisibleNum: 2
                        };
                    }

                    var operationHTML = operation.linker(operation.scope);
                    return operationHTML;
                }
            }


            function deletePipeline(deleteId) {
                if (deleteId) {
                    var params = {
                        "pipelineId": deleteId
                    };
                    return instanceListService.deletePipelineTest(params);
                }
            }

            function startpipelineonce(data) {
                if (data) {
                    return instanceListService.startpipelineonce(data);
                }
            }

            function stopschedulePipeline(id) {
                if (id) {
                    return instanceListService.stopschedulePipelineTest(id);
                }
            }

            function deleteschedulePipeline(id) {
                if (id) {
                    return instanceListService.deletescheduleTest(id);
                }
            }

            function restorePipeline(id) {
                if (id) {
                    return instanceListService.restorePipeline(id);
                }
            }

            function editschedulePipeline(id) {
                if (id) {
                    return instanceListService.editchedulePipelineTest(id);
                }
            }

            function refreshInstanceList(pageIndex, requestNum, searchString) {
                //get quotas
                $scope.getUserQuotas();
                if (pageIndex && requestNum) {
                    searchString = [{
                        "fieldName": "pipelineName",
                        "value": $scope.searchString
                    },/*{
                        "fieldName": "pipelineId",
                        "value": searchString
                    },*/{
                        "fieldName": "status",
                        "value": ListParam
                    }];
                    /*if(pageIndex && requestNum){
                        if(angular.isUndefined(searchString)){
                            searchString = [];
                        }else{
                            searchString = [{
                                "fieldName": "pipelineName",
                                "value": searchString
                            }, {
                                "fieldName": "pipelineId",
                                "value": searchString
                            },{
                                "fieldName": "status",
                                "value": searchString
                            }];
                        }
                    }*/
                    var params = {
                        "limit": requestNum,
                        "offset": pageIndex,
                        "query": {
                            "selectors": searchString
                        }
                    };
                    $(".dataTables_scrollBody").append(commonService.loading);
                    var promise = instanceListService.getInstanceList(params);
                    promise.then(function (data) {
                        commonService.loading.remove();
                        var year = "", month = "", day = "", hour = "", minuter = "", second = "";
                        var data_ = commonService.htmlEncode(data.pipelineIdList);

                        angular.forEach(data_, function (val) {
                            if (val.schedule && val.schedule.startTime != undefined ) {
                                var startTimeTmp = val.schedule.startTime+ ":00"; // for the fucking no-standard format time from back-end !!!!
                                var startTime = new Date(startTimeTmp).getTime();
                                val.schedule.startTime = timeService.fn.milliseconds2LocalTime(startTime * 1);
                                if (isInvalidScheduleInterval(val.schedule.startTime)) {
                                    val.schedule.startTime = '--';
                                }

                                if(val.schedule.hasOwnProperty("endTime")){
                                    var endTimeTmp = val.schedule.endTime + ":00";
                                    var endTime = new Date(endTimeTmp).getTime();
                                    val.schedule.endTime = timeService.fn.milliseconds2LocalTime(endTime * 1);
                                    if (isInvalidScheduleInterval(val.schedule.endTime)) {
                                        val.schedule.endTime = '--';
                                    }
                                }else{
                                    val.schedule.endTime = '--';//end type is never
                                }


                            }else{
                                val.schedule.startTime = '--';
                                val.schedule.endTime = '--';
                            }

                        })

                        $scope.instanceListTable.data = data_;

                        data_ && _.each(data_, function (item, index) {
                            item.detail = {
                                "contentType": "url",
                                "content": "src/app/dataAccess/views/windows/pipelineDetails.html",
                                "show": true
                            }

                            if (item.isDeleted === PIPELINE_DELETED) {
                                item.detail.show = false;
                            }
                        });
                        //列表数据总条数
                        /*if (angular.isArray($scope.instanceListTable.data)) {
                         angular.forEach($scope.instanceListTable.data, function (obj, index) {
                         obj.scheduleDTO.startTimeString = angular.isDefined(obj.scheduleDTO.startTime) ? timeService.fn.milliseconds2LocalTime(obj.scheduleDTO.startTime * 1) : '--';
                         obj.scheduleDTO.endTimeString = angular.isDefined(obj.scheduleDTO.endTime) ? timeService.fn.milliseconds2LocalTime(obj.scheduleDTO.endTime * 1) : '--';
                         });
                         }*/
                        $scope.instanceListTable.totalRecords = data.total;
                    }, function (data) {
                        $scope.errorDescriptionShow = false;
                        commonService.loading.remove();
                        if (data.status == 200) {
                            var year = "", month = "", day = "", hour = "", minuter = "", second = "";
                            var data_ = commonService.htmlEncode(data.pipelineIdList);
                            $scope.instanceListTable.data = data_;
                            //列表数据总条数
                            /*for (var i = 0; i < $scope.instanceListTable.data.length; i++) {
                             if ($scope.instanceListTable.data[i].scheduleDTO.startTime == undefined) {
                             var startTime = new Date(new Date(parseInt($scope.instanceListTable.data[i].scheduleDTO.startTime)));
                             year = startTime.getFullYear();
                             month = startTime.getMonth() + 1;
                             if (month <= 9) {
                             month = "0" + month
                             }
                             day = startTime.getDate();
                             if (day <= 9) {
                             day = "0" + day
                             }
                             hour = startTime.getHours();
                             if (hour <= 9) {
                             hour = "0" + hour
                             }
                             minuter = startTime.getMinutes();
                             if (minuter <= 9) {
                             minuter = "0" + minuter
                             }
                             second = startTime.getSeconds();
                             if (second <= 9) {
                             second = "0" + second
                             }
                             $scope.instanceListTable.data[i].scheduleDTO.startTime = year + "-" + month + "-" + day + " " + hour + ":" + minuter + ":" + second;
                             }
                             if ($scope.instanceListTable.data[i].scheduleDTO.endTime == undefined) {
                             var endTime = new Date(new Date(parseInt($scope.instanceListTable.data[i].scheduleDTO.endTime)));
                             year = endTime.getFullYear();

                             month = endTime.getMonth() + 1;
                             if (month <= 9) {
                             month = "0" + month
                             }
                             day = endTime.getDate();
                             if (day <= 9) {
                             day = "0" + day
                             }
                             hour = endTime.getHours();
                             if (hour <= 9) {
                             hour = "0" + hour
                             }
                             minuter = endTime.getMinutes();
                             if (minuter <= 9) {
                             minuter = "0" + minuter
                             }
                             second = endTime.getSeconds();
                             if (second <= 9) {
                             second = "0" + second
                             }
                             $scope.instanceListTable.data[i].scheduleDTO.endTime = year + "-" + month + "-" + day + " " + hour + ":" + minuter + ":" + second;
                             }
                             $scope.instanceListTable.data[i].createdTime = commonService.FormatDate($scope.instanceListTable.data[i].createdTime);
                             }*/
                            $scope.instanceListTable.totalRecords = data.total;
                        } else {
                            commonService.loading.remove();
                            commonService.netErrorTip(i18n, data, i18n.pipelineListInit);
                        }
                    });

                    clearTimeout(refreshST);
                    refreshST = setTimeout(function () {
                    }, commonService.WAIT_TIME);
                }
            }

            if (!$stateParams.page) {
                $stateParams.page = 1;
            }

            //initial pipeline list
            refreshInstanceList($stateParams.page, requestNum);

            window.onresize = function () {
                $("#instanceErrorShow").css("width", (document.documentElement.offsetWidth - 300) + "px");
            };
        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('instanceList.ctrl', instanceListCtrl);
        return dataAccessModule;
    });
