define(['language/dataAccess', "app-remote/services/tipMsgService", 'src/app/common/commonInfo'],
    function (i18n, tipMsgService, commonInfo) {
        "use strict";

        var toolbarCtrl = function ($rootScope, $scope, $state, $stateParams, $location, $compile, camel, mask, commonService, canvasService, instanceListService, processManager, activityManager, timeService,parserManager, processTypeManager) {
            $scope.i18n = i18n;
            var computeResourceArrayPromise = [];
            var tipMessageService = new tipMsgService();
            $scope.defaultNumber = 0;
            //获取状态对象
            $scope.statusObj = processManager.getProcessStatistics();
            //获取group的id
            var groupId_ = commonService.getGroupID();
            /*$scope.groupObj.pipelineId=groupId_;*/
            var pipelineName = commonService.getPipelineName();
            $scope.groupId = groupId_;
            $scope.groupName = pipelineName;
            $rootScope.editorPipelineName = pipelineName;
            $scope.groupObj = null;
            $scope.groupId = groupId_;
            $scope.groupName = null;
            $scope.backLink = '?locale=' + (urlParams.lang) + '#/manage/pipelineList';

            //[BEGIN ADD  FOR 获取computeResource列表， 2016-12-20]
            canvasService.getComputeResoucesPromise().then(function(response){
                computeResourceArrayPromise = response.resouces;
            }, function (data) {
                if (data.status == 200) {
                    computeResourceArrayPromise = data.resouces;
                } else {
                    $rootScope.$broadcast('getComputeFromRemote', data);
                }
            });

            var win;
            //“运行”或者“停止”状态
            $scope.group_play_end_status = null;


            //根据id获取group对象
            function getProcessGroupById(groupId_) {

                if (groupId_) {
                    commonService.getProcessGroupPromise(groupId_).then(function (response) {
                        var groupList = response;
                        $rootScope.schedule = response.schedule;
                        if (groupList) {
                            $rootScope.groupObj = groupList;
                            $scope.groupId = $scope.groupObj.pipelineId;
                            $scope.groupName = $scope.groupObj.name;
                            $rootScope.editorPipelineName = $scope.groupObj.name;
                        }
                    }, function (data) {
                        commonService.netErrorTip(i18n, data);
                    })

                }

            }

            /*
             *find actions at canvasPage
             */
            $scope.templateShow = true;
            $rootScope.$on('processArray', function (event, data) {
                if (data.length < 1) {
                    //$scope.$apply(function(){
                    $scope.templateShow = false;
                    //})
                }
            });
            $rootScope.$on('templateDragDrop', function (event, data) {
                $scope.templateShow = data;
            });
            var canvasProcessor = processManager.getProcessArray();
            $scope.checkData = processManager;
            $scope.submitFlag = false;
            $scope.$watch('checkData.getSaveFlag()', function (newVal) {
                $scope.saveFlag = processManager.getSaveFlag();
                if ($scope.saveFlag) {
                    // $scope.$apply(function(){
                    $scope.templateShow = false;
                    // })
                }
            });
            $scope.submitBtn = {
                "id": "submitButton",
                "text": i18n.dps_canvas_toolbar_submit_title,
                "disable": false,
                "click": function () {

                }
            };
            $scope.scheduleBtn = {
                "id": "scheduleButton",
                "text": i18n.dps_canvas_toolbar_schedule_title,
                "disable": false,
                "click": function () {

                }
            };
            $scope.monitorBtn = {
                "id": "monitorButton",
                "text": i18n.dps_canvas_toolbar_view_title,
                "disable": false,
                "click": function () {

                }
            };
            $scope.runBtn = {
                "id": "runButton",
                "text": i18n.dps_canvas_toolbar_run_title,
                "disable": false,
                "click": function () {

                }
            };
            $scope.editBtn = {
                "id": "editButton",
                "text": i18n.dps_canvas_toolbar_edit_title,
                "disable": false,
                "click": function () {

                }
            };
            function checkRepeat(current, unCheckedArray) {
                var repeatedArray = [];
                _.forEach(unCheckedArray, function (value) {
                    if (current.id !== value.id && current.toCheck === value.toCheck) {
                        repeatedArray.push({ id: value.id, name: value.name });
                    }
                });
                return repeatedArray;
            }

            function isRepeat(arr) {
                var hash = {};
                for (var i in arr) {
                    if (hash[arr[i]])
                        return true;//true is repeat
                    hash[arr[i]] = true;
                }
                return false;
            }


            /*
             *新版本按钮事件
             * */
            $scope.toolbar_button = {
                "submit": function () {
                    //验证算子输入是否合法
                    $scope.process = processManager.getSelectedProcess();
                    activityManager.emptyCanvasMsgs();
                    /*processManager.setSelectedProcess($scope.process);*/
                    if ($scope.process.config) {
                        if (tinyWidget.UnifyValid.FormValid($("#processConfigurationForm"))) {
                            processManager.setSaveFlag(true);
                            var processor = processManager.getProcessArray();

                            // refresh validators
                            processManager.refreshProcessListValidationErrorsFromCurrent(processor, $scope.process);

                            //added  fo check the dupicate in the processorname
                            var jobNameArr = [], processNameArr = [];
                            /*
                            if (processor.length > 1) {
                                for (var i = 0; i < processor.length; i++) {
                                    if (processor[i].name != undefined && processor[i].name != null) {
                                        processNameArr.push(processor[i].name);
                                    }
                                    if (processor[i].config.properties['Job Name'] != undefined && processor[i].config.properties['Job Name'] != null) {
                                        jobNameArr.push(processor[i].config.properties['Job Name']);
                                    }
                                }
                            }

                            //check process name is exist
                            if (processNameArr.length > 0 && isRepeat(processNameArr)) {
                                $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_dpsValidationforSameProcessName);
                                return;
                            }
                            //check job name is exist
                            if (jobNameArr.length > 0 && isRepeat(jobNameArr)) {
                                $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_dpsValidationforSameProcessJobName);
                                return;
                            }
                            */
                            if (processor.length > 1) {
                                for (var i = 0; i < processor.length; i++) {
                                    if (processor[i].name != undefined && processor[i].name != null) {
                                        processNameArr.push({ name: processor[i].name, id: processor[i].id, toCheck: processor[i].name });
                                    }
                                    if (processor[i].config.properties['Job Name'] != undefined && processor[i].config.properties['Job Name'] != null) {
                                        jobNameArr.push({ name: processor[i].name, toCheck: processor[i].config.properties['Job Name'], id: processor[i].id });
                                    }
                                }
                            }

                            //check process name is exist
                            var repeatedNameArray = checkRepeat({ id: $scope.process.id, name: $scope.process.name, toCheck: $scope.process.name }, processNameArr);
                            if (repeatedNameArray.length > 0) {
                                activityManager.pushCanvasMsg({
                                    level: "ERROR",
                                    time: timeService.fn.milliseconds2LocalTime(+new Date),
                                    processors: repeatedNameArray,
                                    text: i18n.dps_canvas_configuration_dpsValidationforSameProcessName
                                });
                                $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_dpsValidationforSameProcessName);
                                return;
                            }
                            //check job name is exist
                            var repeatedJobNameArray = checkRepeat({ id: $scope.process.id, name: $scope.process.name, toCheck: $scope.process.config.properties['Job Name'] }, jobNameArr);
                            if (repeatedJobNameArray.length > 0) {
                                activityManager.pushCanvasMsg({
                                    level: "ERROR",
                                    time: timeService.fn.milliseconds2LocalTime(+new Date),
                                    processors: repeatedJobNameArray,
                                    text: i18n.dps_canvas_configuration_dpsValidationforSameProcessJobName
                                });
                                $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_dpsValidationforSameProcessJobName);
                                return;
                            }

                            if ($scope.process.type == "com.huawei.datacraft.processactivity.ExecuteScript" || $scope.process.type == "ExecuteScript") {
                                if ($scope.process.config.properties['Log Backup'] == 'True' && !$scope.process.config.properties['Destination Log Path']) {
                                    activityManager.pushCanvasMsg({
                                        level: "ERROR",
                                        time: timeService.fn.milliseconds2LocalTime(+new Date),
                                        processors: [{ id: $scope.process.id, name: $scope.process.name }],
                                        text: i18n.dps_canvas_configuration_destinationRequired
                                    });
                                    $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_destinationRequired);
                                    return;
                                }
                            }

                            $scope.process.config.autoTerminatedRelationships = [];
                            var currentProcessor = processManager.getProcessByID($scope.process.id);
                            if (currentProcessor) {

                                //[BEGIN ADD FOR 保存processor属性修改， 2016-12-17]
                                if ($scope.process.processorType === "PROCESS_ACTIVITY") {
                                    var id = $scope.process.config.properties.computeResource[0];
                                    for (var i = 0; i < computeResourceArrayPromise.length; i++) {
                                        if (id === computeResourceArrayPromise[i].nodeId) {
                                            currentProcessor.computeResource[0] = computeResourceArrayPromise[i].nodeId;
                                        }
                                    }
                                }
                                if($scope.process.config.properties.computeResource){
                                    $scope.process.config.properties.computeResource = $scope.process.config.properties.computeResource[0];
                                }

                                var configTemp = $.extend(true, {}, $scope.process.config);
                                /*delete configTemp.properties.computeResource;*/
                                currentProcessor.config = $.extend(true, {}, configTemp);
                                currentProcessor.name = $scope.process.name;

                                //[END ADD  FOR 保存processor属性修改 ， 2016-12-17]
                                var legalFlags = activityManager.getLegalFlags();
                                for (var key in legalFlags) {
                                    if (key == $scope.process.id) {
                                        legalFlags[key] = true;
                                        break;
                                    }
                                }
                                processManager.refreshLocalProcess(currentProcessor);
                            }
                        } else {
                            $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_dpsconfigvalidationMessage);
                            return;
                        }
                    }


                    activityManager.setProcessors(processManager.getProcessArray());
                    activityManager.setConnections(processManager.getConnections());
                    var activityStatus = activityManager.getActivityArray();
                    var getActivityArrayLength = activityManager.getActivityArrayLength();

                    var confirmButton = {
                        key: "btnId1",
                        label: i18n.dps_canvas_hint_confirm,
                        handler: function (event) {
                        }
                    };
                    var str;
                    if (activityStatus.status === 0) {
                        activityManager.pushCanvasMsg({
                            level: "WARN",
                            time: timeService.fn.milliseconds2LocalTime(+new Date),
                            processors: [],
                            text: i18n.dps_canvas_hint_noProcessor
                        });
                        $rootScope.$broadcast('beforeSubmitCheckout', i18n.dps_canvas_hint_noProcessor);
                        return;
                    } else if (activityStatus.status === 1) {
                        var info = i18n.dps_canvas_hint_onlyOneDataSources;
                        activityManager.pushCanvasMsg({
                            level: "ERROR",
                            time: timeService.fn.milliseconds2LocalTime(+new Date),
                            processors: [],
                            text: info
                        });
                        $rootScope.$broadcast('beforeSubmitCheckout', info);
                        return;
                    } else if (activityStatus.status === 2) {
                        var info = i18n.dps_canvas_hint_onlyActivity;
                        activityManager.pushCanvasMsg({
                            level: "ERROR",
                            time: timeService.fn.milliseconds2LocalTime(+new Date),
                            processors: [{ id: activityStatus.content.id, name: activityStatus.content.name }],
                            text: info
                        });
                        $rootScope.$broadcast('beforeSubmitCheckout', info);
                        return;
                    } else if (activityStatus.status === 3) {
                        var info = i18n.dps_canvas_hint_hasIsolatedProcessor;
                        activityManager.pushCanvasMsg({
                            level: "ERROR",
                            time: timeService.fn.milliseconds2LocalTime(+new Date),
                            processors: [],
                            text: info
                        });
                        $rootScope.$broadcast('beforeSubmitCheckout', info);
                        return;
                    } else if (activityStatus.status === 4) {
                        var str = i18n.dps_canvas_hint_forbiddenInputData;
                        var info = str.replace("{0}", '');
                        activityManager.pushCanvasMsg({
                            level: "ERROR",
                            time: timeService.fn.milliseconds2LocalTime(+new Date),
                            processors: [{ id: activityStatus.content.id, name: activityStatus.content.name }],
                            text: info
                        });
                        $rootScope.$broadcast('beforeSubmitCheckout', str.replace("{0}", activityStatus.content.name));
                        return;
                    } else if (activityStatus.status === 5) {
                        var str = i18n.dps_canvas_hint_requiredInputData;
                        var info = str.replace("{0}", '');
                        activityManager.pushCanvasMsg({
                            level: "ERROR",
                            time: timeService.fn.milliseconds2LocalTime(+new Date),
                            processors: [{ id: activityStatus.content.id, name: activityStatus.content.name }],
                            text: info
                        });
                        $rootScope.$broadcast('beforeSubmitCheckout', str.replace("{0}", activityStatus.content.name));
                        return;
                    } else if (activityStatus.status === 6) {
                        var str = i18n.dps_canvas_hint_forbiddenOutputData;
                        var info = str.replace("{0}", '');
                        activityManager.pushCanvasMsg({
                            level: "ERROR",
                            time: timeService.fn.milliseconds2LocalTime(+new Date),
                            processors: [{ id: activityStatus.content.id, name: activityStatus.content.name }],
                            text: info
                        });
                        $rootScope.$broadcast('beforeSubmitCheckout', str.replace("{0}", activityStatus.content.name));
                        return;
                    } else if (activityStatus.status === 7) {
                        var str = i18n.dps_canvas_hint_requiredOutputData;
                        var info = str.replace("{0}", '');
                        activityManager.pushCanvasMsg({
                            level: "ERROR",
                            time: timeService.fn.milliseconds2LocalTime(+new Date),
                            processors: [{ id: activityStatus.content.id, name: activityStatus.content.name }],
                            text: info
                        });
                        $rootScope.$broadcast('beforeSubmitCheckout', str.replace("{0}", activityStatus.content.name));
                        return;
                    } else if (activityStatus.status === 8) {
                        var str = i18n.dps_canvas_hint_requiredComputeResource;
                        var info = str.replace("{0}", '');
                        activityManager.pushCanvasMsg({
                            level: "ERROR",
                            time: timeService.fn.milliseconds2LocalTime(+new Date),
                            processors: [{ id: activityStatus.content.id, name: activityStatus.content.name }],
                            text: info
                        });
                        $rootScope.$broadcast('beforeSubmitCheckout', str.replace("{0}", activityStatus.content.name));
                    } else if (activityStatus.status === 9) {
                        var info = i18n.dps_canvas_hint_existLoop;
                        activityManager.pushCanvasMsg({
                            level: "ERROR",
                            time: timeService.fn.milliseconds2LocalTime(+new Date),
                            processors: [],
                            text: info
                        });
                        $rootScope.$broadcast('beforeSubmitCheckout', info);
                    } else if (activityStatus.status === 10) {
                        var str = i18n.dps_canvas_hint_dps_submit_check_attr;
                        var info = str.replace("{0}", '');
                        activityManager.pushCanvasMsg({
                            level: "ERROR",
                            time: timeService.fn.milliseconds2LocalTime(+new Date),
                            processors: [{ id: activityStatus.content.id, name: activityStatus.content.name }],
                            text: info
                        });
                        $rootScope.$broadcast('beforeSubmitCheckout', str.replace("{0}", activityStatus.content.name));
                    } else if (activityStatus.status === 200) {
                        //[BEGIN ADD  FOR 判断submit提交是否成功， 2016-12-20]
                        //统计算子数量，算子数量超过32个，则不能提交
                        if (getActivityArrayLength.length > 32) {
                            var str = i18n.dps_canvas_hint_NoBiggerThan32;
                            var info = str.replace("{0}", 32);
                            $rootScope.$broadcast('beforeSubmitCheckout', info);
                            $scope.submitFlag = true;
                            activityManager.pushCanvasMsg({
                                level: "WARN",
                                time: timeService.fn.milliseconds2LocalTime(+new Date),
                                processors: [],
                                text: info
                            });
                            return;
                        }
                        if (getActivityArrayLength.length == 0) {
                            activityManager.pushCanvasMsg({
                                level: "WARN",
                                time: timeService.fn.milliseconds2LocalTime(+new Date),
                                processors: [],
                                text: i18n.dps_canvas_hint_noProcessor
                            });
                            $rootScope.$broadcast('beforeSubmitCheckout', i18n.dps_canvas_hint_noProcessor);
                            return;
                        }
                        var msgsList = activityManager.getCanvasMsgs;
                        if (msgsList && msgsList.length > 0) {
                            return;
                        }
                        var confirmButtonSUB = {
                            key: "btnId1",
                            label: i18n.dps_canvas_hint_confirm,
                            handler: function (event) {
                                var Promise = activityManager.submitPromise(groupId_);
                                processManager.setSaveFlag(false);
                                $scope.templateShow = true;
                                var datas = { 'pipelineName': $scope.editorPipelineName, 'Promise': Promise };
                                $rootScope.$broadcast('activitiesChanged', datas);
                            }
                        };

                        var cancelButton = {
                            key: "btnId1",
                            label: i18n.dps_canvas_hint_confirmCancel,
                            handler: function (event) {
                            }
                        };
                        commonService.message(i18n.dps_canvas_hint_ifSubmit, {
                            type: "warn",
                            buttons: [confirmButtonSUB, cancelButton]
                        });
                        //[END ADD  FOR 判断submit提交是否成功。， 2016-12-20]
                    }

                },
                //[BEGIN ADD  FOR 添加视图页面， 2016-12-18]
                "view": function () {
                    var urlHash = window.location.hash;
                    var urlParams = window.urlParams || {};
                    commonService.safeOpenURL(commonService.webRoot + "/?locale=" + (urlParams.lang) + "&groupId=" + groupId_ + "&#/viewCanvas");
                },
                //[END ADD  FOR 添加视图页面， 2016-12-18]

                //[BEGIN ADD  FOR view跳转到编排页面 ， 2016-12-18]
                "edit": function () {
                    var urlHash = window.location.hash;
                    var groupId = commonService.getGroupID();
                    var urlParams = window.urlParams || {};
                    commonService.safeOpenURL(commonService.webRoot + "/?locale=" + (urlParams.lang) + "&groupId=" + groupId_ + "&#/editCanvas");
                },
                "run": function () {
                    var urlHash = window.location.hash;
                    var groupId = commonService.getGroupID();
                    var promise = startpipelineonce(groupId);
                    $rootScope.$broadcast('startpipelineonce', promise);
                },
                //[END ADD  FOR 由view页面跳转到编排页面， 2016-12-18]
                "timer": function () {
                    getProcessGroupById(groupId_);
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
                                if (startTmp == "") {
                                    tipMessageService.clearErrorMessages();
                                    tipMessageService.alert("error", i18n.dps_canvas_toolbar_startTime, '0px');
                                    return;
                                }
                                var startTmpResult = new Date(startTmp).toISOString();
                                var startTimeResult = startTmpResult.substring(0, startTmpResult.indexOf('.')) + startTmpResult.charAt(startTmpResult.length - 1)
                                var startTime_ = new Date(startTmp).getTime();


                                var endTmp = $("#" + endTime.id).widget().getDateTime();
                                if (endTmp == "") {
                                    tipMessageService.clearErrorMessages();
                                    tipMessageService.alert("error", i18n.dps_canvas_toolbar_endTime, '0px');
                                    return;
                                }
                                var endTmpResult = new Date(endTmp.replace("-", "/").replace("-", "/")).toISOString();
                                var endTimeResult = endTmpResult.substring(0, endTmpResult.indexOf('.')) + endTmpResult.charAt(endTmpResult.length - 1)
                                var endTime_ = new Date(endTmp).getTime();
                                $scope.availableId = $("#" + scheduleInfoWindow.endRadioGroup.id).widget().opChecked("checked");
                                if (startTime_ && endTime_ && timeResultAnother && $scope.availableId == "1") {
                                    /*if (startTime_ && endTime_ && timeResultAnother) {*/
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
                                    "id": $scope.groupId,
                                    "type": "SCHEDULE",
                                    "scheduleType": "TIMER",
                                    "startTime": startTimeResult,
                                    "endTime": endTimeResult,
                                    "interval": timeResult
                                };*/

                                $rootScope.schedule = {
                                    "id": $scope.groupId,
                                    "type": "SCHEDULE",
                                    "scheduleType": "TIMER",
                                    "startTime": startTimeResult,
                                    "interval": timeResult
                                };

                                if ($scope.availableId == "1") {
                                    $rootScope.schedule.endTime = endTimeResult;
                                }
                                var finaldata = {
                                    /*"schedule": schedule,*/
                                    "schedule": $rootScope.schedule,
                                    "pipelineId": $scope.groupId,
                                    "pipelineObjects": $rootScope.groupObj.pipelineObjects
                                };
                                var url = "rest/api/v1/datacraft/controller/pipeline/root/editPipeline";
                                /*var param = JSON.stringify(finaldata);*/
                                var promise = camel.post({
                                    url: url,
                                    params: finaldata,
                                    timeout: 12000
                                });
                                promise.then(function () {
                                    commonService.successTip(i18n.dps_pipeline_table_schedule_save_success);
                                    win.destroy();
                                }, function (data) {
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
            $rootScope.$on('createTemplate', function (event, data) {
                var Promise = data;
                Promise.then(function (response) {
                    $rootScope.$broadcast('submitTemplateSuccess', response);//提交成功，错误提示
                    win.destroy();
                }, function (data) {
                    if (data.status == 200) {
                        $rootScope.$broadcast('submitTemplateSuccess', response);//提交成功，错误提示
                        win.destroy();
                    } else {
                        $rootScope.$broadcast('submitTemplateFailed', data);//提交失败，错误提示
                    }
                });
            });

            function startpipelineonce(data) {
                if (data) {
                    return instanceListService.startpipelineonce(data);
                }
            }

        };
        var dataCraftModule = angular.module('dataAccess.config');
        dataCraftModule.tinyController('toolbar.ctrl', toolbarCtrl);
        return dataCraftModule;
    });
