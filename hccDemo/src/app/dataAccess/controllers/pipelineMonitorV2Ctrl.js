define(
    ['language/dataAccess', 'src/app/common/commonInfo'], function (i18n, commonInfo) {
        "use strict";
        var pipelineMonitorCtrl = function ($rootScope, $scope, $state, $stateParams, $compile, mask, commonService, monitorService, $timeout, timeService, instanceListService, showLogDetailService,storage) {
            // i18n, translate text by i18n
            $scope.i18n = i18n;

            // the link URL back to pipeline instance list
            $scope.backLink = '?locale=' + (urlParams.lang) + '#/manage/pipelineList';

            $scope.currentPipelineName = commonService.getPipelineName();

            // default configuration
            var requestNum = 10;
            $stateParams['results-per-page'] = requestNum;
            var pipelineInstanceId;
            var requestNumActivity = 10;
            // when the history list was refreshed , user wants to keep the last selected item
            var currentSelectedHistoryItemValue = '';
            // define the response callback for service query
            var fn = {
                // query data of history list
                refreshHistoryList: function (pageIndex, requestNum, flag) {
                    if (pageIndex && requestNum) {
                        var searchString = $scope.historyList.searchString;
                        var params = {
                            offset: pageIndex,
                            count: requestNum
                        };
                        $("#historyList").append(commonService.loading);
                        var promise = monitorService.getHistoryListPromise(params);
                        promise.then(function (data) {
                            commonService.loading.remove();
                            //window.location.href = commonService.instanceListPage;
                            $scope.panels.showHistoryListContent = true;
                            $scope.panels.showActivitiesListContent = false;
                            $scope.panels.showDataProvenanceListContent = false;

                            $scope.historyList.data = commonService.htmlEncode(data.pipelineInstances);
                            $scope.historyList.totalRecords = data.total;

                            // if total of history records is zero, then hide table head of history and hide activity list block
                            if (data.total === 0) {
                                $('#' + $scope.historyList.id).find('tr:first').hide();
                                $('#activitiesListBlock').hide();
                            } else {
                                $('#' + $scope.historyList.id).find('tr:first').show();
                                $('#activitiesListBlock').show();
                                $scope.panels.showActivitiesListContent = true;
                            }
                            if (!flag) {
                                commonService.successTip(i18n.dps_canvas_hint_sucessCode);
                            }
                            $timeout(function () {
                                if (currentSelectedHistoryItemValue !== '') {
                                    $('[name="historyListRadio"][value="' + currentSelectedHistoryItemValue + '"]').click();
                                } else {
                                    $('[name="historyListRadio"]:first').click();
                                }
                            }, 100);
                        }, function (data) {
                            if (data.status == 200) {
                                commonService.loading.remove();
                                $scope.panels.showHistoryListContent = true;
                                $scope.panels.showActivitiesListContent = false;
                                $scope.panels.showDataProvenanceListContent = false;

                                $scope.historyList.data = commonService.htmlEncode(data.pipelineInstances);
                                $scope.historyList.totalRecords = data.total;
                                commonService.successTip(i18n.dps_canvas_hint_sucessCode);
                                if (!flag) {
                                    commonService.successTip(i18n.dps_canvas_hint_sucessCode);
                                }
                            } else {
                                commonService.loading.remove();
                                commonService.netErrorTip(i18n, data);
                            }
                        });
                    }
                },

                // query data of activity list
                refreshActivitiesList: function (pageIndex, requestNum, pipelineInstanceId) {
                    var searchString = $scope.viewActivitiesList.searchString;

                    var params = {
                        offset: pageIndex,
                        count: requestNumActivity,
                        pipelineInstanceId: pipelineInstanceId
                    };

                    var promise = monitorService.getActivitiesListPromise(params);
                    promise.then(function (data) {
                        $scope.panels.showActivitiesListContent = data.total > 0 ? true : false;
                        $scope.panels.showDataProvenanceListContent = false;
                        $scope.viewActivitiesList.data = commonService.htmlEncode(data.flowInstances);
                        $scope.viewActivitiesList.totalRecords = data.total;
                    },
                        function (data) {
                            if (data.status == 200) {
                                $scope.panels.showActivitiesListContent = true;
                                $scope.panels.showDataProvenanceListContent = false;
                                $scope.viewActivitiesList.totalRecords = data.flowInstances.length;
                                $scope.viewActivitiesList.data = commonService.htmlEncode(data.flowInstances);
                            } else {
                                commonService.netErrorTip(i18n, data);
                            }
                        });
                },
                // query data of data provenance list
                refreshDataProvenanceList: function (pageIndex, requestNum) {
                    if (pageIndex && requestNum) {
                        var searchString = $scope.viewDataProvenanceList.searchString;
                        var params = {
                            offset: pageIndex,
                            count: requestNum,
                            filterParam: searchString
                        };

                        var promise = monitorService.getDataProvenanceListPromise(params);
                        promise.then(function (data) {
                            $scope.panels.showDataProvenanceListContent = true;
                            $scope.viewDataProvenanceList.data = commonService.htmlEncode(data);
                            $scope.viewDataProvenanceList.totalRecords = data.total;
                        });
                    }

                }
            };

            // init function will invoke at the end of definitions
            function init() {
                fn.refreshHistoryList(1, requestNum, true);
            }

            // historyListSearch
            $scope.historyListSearch = {
                id: 'historyListSearch',
                values: [{
                    selectId: 'all',
                    label: 'All'
                }, {
                    selectId: 'running',
                    label: 'running'
                }, {
                    selectId: 'stopped',
                    label: 'stopped'
                }],
                defaultSelectid: 'all',
                width: 100,
                height: 'auto',
                display: true,
                disable: false,
                showTip: false,
                textWidth: '',
                textType: '',
                textOptions: [],
                change: function () {
                },
                click: function () {
                }
            };

            // define the select search widget
            var wSearch = new tinyWidget.SelectSearchbox({
                id: $scope.historyListSearch.id,
                'is-searchbox': true
            });

            // define menu button functions
            var menuButtonFn = {
                clickExportDOC: function (evt, item, widgetThis) {
                },
                clickExportPDF: function () {
                }
            };

            // configure menu button options
            $scope.menuButton = {
                id: "menuButtonId",
                dropbtn: true,
                content: [{
                    title: "Export DOC file",
                    click: menuButtonFn.clickExportDOC
                }, {
                    title: "Export PDF file",
                    click: menuButtonFn.clickExportPDF
                }],
                text: "Export",
                btnIcon: "non-icon",
                type: "button"
            };

            // panels toggle function
            $scope.panels = {
                showHistoryListContent: false,
                showActivitiesListContent: false,
                showDataProvenanceListContent: false,
                toggleDisplay: function (varName) {
                    if (typeof $scope.panels[varName] === "undefined") {
                        return false;
                    }
                    if (varName === 'showActivitiesListContent') {
                        $scope.panels[varName] = !$scope.panels[varName];
                    }
                    $scope.$evalAsync();
                    return true;
                }
            };

            //
            //  View History List Definitions
            //
            fn.transformHistoryResult = function (strData) {
                if (strData) {
                    if (strData === 'SUCCEED') {
                        return i18n.dps_pipeline_monitor_table_ResultSucceed;
                    } else if (strData === 'FAILED' || strData === 'STOPPED' || strData === 'TIMEOUT') {
                        return i18n.dps_pipeline_monitor_table_ResultFailed;
                    } else if (strData === 'INPROGRESS' || strData === 'RUNNING') {
                        return '';
                    }else if (strData === 'PAUSED') {
                        return i18n.dps_pipeline_monitor_table_ResultPaused;
                    }
                    return strData;
                }
            };

            fn.transformHistoryStatus = function (strData) {
                if (strData) {
                    if (strData === 'INPROGRESS' || strData === 'RUNNING') {
                        return "<div  class='pull-left status-icon status-running-icon'></div>"+"<div class='pull-left'>"+i18n.dps_pipeline_monitor_table_running_status;+"</div>";
                    } else if (strData === 'SUCCEED' || strData === 'FAILED') {
                        return "<div  class='pull-left status-icon status-finised-icon'></div>"+"<div class='pull-left'>"+i18n.dpsMonitorValueStatusSucceed;+"</div>";
                    } else if (strData === 'STOPPED') {
                        return "<div  class='pull-left status-icon status-deleted-icon'></div>"+"<div class='pull-left'>"+i18n.dps_pipeline_monitor_table_stop_status;+"</div>";
                    } else if (strData === 'TIMEOUT') {
                        return "<div  class='pull-left status-icon status-timeout-icon'></div>"+"<div class='pull-left'>"+i18n.dpsMonitorValueStatusTimeout;+"</div>";
                    }else if (strData === 'PAUSED') {
                        return "<div  class='pull-left status-icon status-paused-icon'></div>"+"<div class='pull-left'>"+i18n.dps_pipeline_monitor_table_paused_status;+"</div>";
                    }
                    return strData;
                }
            };

            fn.transformActivityStatus = fn.transformHistoryStatus;
            fn.transformActivityResult = fn.transformHistoryResult;
            fn.transformHistoryInstanceId = function (strId) {
                if (strId) {
                    return strId.replace(/.*_([^_]+)$/, '$1');
                }
            };

            fn.trimDatetime = function (timestamp) {
                if (timestamp) {
                    if (parseInt(timestamp) === 0) {
                        return '';
                    }
                    return timestamp;
                }
            }

            fn.historyList = {
                callback: function (evtObj) {
                    currentSelectedHistoryItemValue = '';
                    $stateParams.page = evtObj.currentPage;
                    /** TODO:refresh table* */
                    fn.refreshHistoryList($stateParams.page, requestNum);
                },
                renderRow: function (nRow, aData, iDataIndex) {
                    var link = $compile('<tiny-radio name="radioBtn.name" value="radioBtn.value" click="radioBtn.click()"></tiny-radio>');
                    var radioScope = $scope.$new();
                    radioScope.radioBtn = {
                        "value": aData.pipelineInstanceId,
                        "name": "historyListRadio"
                    };
                    var node = link(radioScope);

                    $("td[tdname='0']", nRow).html(node);
                    $("td[tdname='1']", nRow).html(fn.transformHistoryInstanceId(aData.pipelineInstanceId));
                    $("td[tdname='2']", nRow).html(fn.transformHistoryStatus(aData.pipelineStatus));
                    $("td[tdname='3']", nRow).html(fn.transformHistoryResult(aData.pipelineStatus));
                    $("td[tdname='4']", nRow).html(commonService.durationTime(aData.startTime / 1000, aData.endTime / 1000, 'min', 1));
                    $("td[tdname='5']", nRow).html(aData.startTime ? timeService.fn.milliseconds2LocalTime(aData.startTime * 1) : '');
                    $("td[tdname='6']", nRow).html(aData.endTime ? timeService.fn.milliseconds2LocalTime(aData.endTime * 1) : '');
                },
                cellClickActive: function (event, trData) {
                    // set radio to checked
                    var target = event.target || event.srcElement;
                    if (target.className !== "tiny-radio-mark") { // prevent event bubbling cycle
                        $timeout(function () {
                            $('[tiny-radio-id="' + trData.pipelineInstanceId + '"]').click();
                        }, 0);
                    }

                    // refresh data of activities list
                    pipelineInstanceId = trData.pipelineInstanceId;
                    currentSelectedHistoryItemValue = pipelineInstanceId;
                    fn.refreshActivitiesList(1, requestNumActivity, pipelineInstanceId);
                },
                tHeadCheckboxFn: function (isAllChecked, event) { },
                changeSelect: function (evtObj) {
                    $scope.historyList.displayLength = evtObj.displayLength;
                    $stateParams['results-per-page'] = evtObj.displayLength;
                    requestNum = evtObj.displayLength;
                    $stateParams.page = 1;
                    /** TODO:refresh table* */
                    fn.refreshHistoryList($stateParams.page, requestNum);
                }
            };

            // setting configuration for history list
            // options for tiny-table widget
            $scope.historyList = {
                id: "historyList",
                data: [],
                columns: [{
                    sTitle: "",
                    sWidth: "5%",
                    mData: "",
                    bSortable: false,
                    sClass: "center"
                }, {
                    sTitle: "ID",
                    sWidth: "auto",
                    mData: "pipelineInstanceId",
                    bSortable: false
                }, {
                    sTitle: i18n.dps_pipeline_monitor_table_state,
                    sWidth: "auto",
                    mData: "pipelineStatus",
                    sClass: "left",
                    bSortable: false
                }, {
                    sTitle: i18n.dps_pipeline_monitor_table_result,
                    sWidth: "auto",
                    mData: "",
                    sClass: "left",
                    bSortable: false
                }, {
                    sTitle: i18n.dps_pipeline_monitor_table_running_time + "&nbsp;" + "(min)",
                    sWidth: "auto",
                    mData: "totalRunTime",
                    sClass: "right duration",
                    bSortable: false
                }, {
                    sTitle: i18n.dps_pipeline_monitor_table_start_time,
                    sWidth: "210px",
                    mData: "startTime",
                    sClass: "time",
                    bSortable: false
                }, {
                    sTitle: i18n.dps_pipeline_monitor_table_end_time,
                    sWidth: "210px",
                    mData: "endTime",
                    sClass: "time",
                    bSortable: false
                }],
                lengthMenu: [10, 20, 50],
                enablePagination: "auto",
                paginationStyle: 'full_numbers',
                lengthChange: true,
                displayLength: $stateParams['results-per-page'],
                totalRecords: 0,
                draggable: true,
                "currentPage": {
                    pageIndex: $stateParams.page
                },
                "tableLanguage": {
                    "sEmptyTable": i18n.dps_table_no_data_show
                },
                checkbox: false,
                showDetails: false,
                callback: fn.historyList.callback,
                renderRow: fn.historyList.renderRow,
                cellClickActive: fn.historyList.cellClickActive,
                tHeadCheckboxFn: fn.historyList.tHeadCheckboxFn,
                changeSelect: fn.historyList.changeSelect,
                searchString: ''
            };
            //  View Activities List Definitions

            fn.viewActivitiesList = {
                callback: function (evtObj) {
                    $stateParams.page = evtObj.currentPage;
                    /** TODO:refresh table* */
                    fn.refreshActivitiesList($stateParams.page, requestNumActivity, pipelineInstanceId);
                },
                renderRow: function (nRow, aData, iDataIndex) {
                    var logLinkTemp=$compile("<a class='a-cursor' ng-click='showLogDetails.click()'>"+aData.executionLog+"</a>");
                    var _logScope=$scope.$new();
                    _logScope.showLogDetails={
                        "click":function(){
                            showLogDetailService.setLogPath(aData.executionLog);
                            storage.add("logPath",aData.executionLog)
                            $state.go("manage.showLogDetail");
                        }
                    };
                    var _logLink=logLinkTemp(_logScope)
                    $("td[tdname='2']", nRow).html(fn.transformActivityStatus(aData.flowStatus));
                    $("td[tdname='3']", nRow).html(fn.transformActivityResult(aData.flowStatus));
                    $("td[tdname='4']", nRow).html(commonService.durationTime(aData.startTime / 1000, aData.endTime / 1000, 'min', 1));
                    $("td[tdname='5']", nRow).html(aData.startTime ? timeService.fn.milliseconds2LocalTime(aData.startTime * 1) : '');
                    $("td[tdname='6']", nRow).html(aData.endTime ? timeService.fn.milliseconds2LocalTime(aData.endTime * 1) : '');
                    $("td[tdname='7']", nRow).html(_logLink);
                },
                cellClickActive: function (event, trData) {
                    // nothing to do
                },
                tHeadCheckboxFn: function (isAllChecked, event) { },
                changeSelect: function (evtObj) {
                    $scope.viewActivitiesList.displayLength = evtObj.displayLength;
                    $stateParams['results-per-page'] = evtObj.displayLength;
                    requestNumActivity = evtObj.displayLength;
                    $stateParams.page = 1;
                    /** TODO:refresh table* */
                    fn.refreshActivitiesList(1, requestNumActivity, pipelineInstanceId);
                }
            };
            $scope.viewActivitiesList = {
                id: 'viewActivitiesList',
                columns: [{
                    sTitle: i18n.dps_pipeline_monitor_table_name,
                    "mData": "flowName",
                    "sWidth": "auto",
                    "bSortable": false
                }, {
                    sTitle: i18n.dps_pipeline_monitor_table_type,
                    "mData": "type",
                    "sWidth": "auto",
                    "bSortable": false
                }, {
                    sTitle: i18n.dps_pipeline_monitor_table_state,
                    "mData": "flowStatus",
                    "sWidth": "auto",
                    "bSortable": false
                }, {
                    sTitle: i18n.dps_pipeline_monitor_table_result,
                    sWidth: "auto",
                    mData: "",
                    bSortable: false,
                    sClass: "left"
                }, {
                    sTitle: i18n.dps_pipeline_monitor_table_running_time + "&nbsp;" + "(min)",
                    "mData": "",
                    "sWidth": "150px",
                    "bSortable": false,
                    "sClass": "right duration"
                }, {
                    sTitle: i18n.dps_pipeline_monitor_table_start_time,
                    "mData": "startTime",
                    "sWidth": "210px",
                    "bSortable": false,
                    "sClass": "time"
                }, {
                    sTitle: i18n.dps_pipeline_monitor_table_end_time,
                    "mData": "endTime",
                    "sWidth": "210px",
                    "bSortable": false,
                    "sClass": "time"
                }, {
                    sTitle: i18n.dps_pipeline_monitor_table_execution_log,
                    "mData": "executionLog",
                    "sWidth": "180px",
                    "bSortable": false
                }],

                lengthMenu: [10, 20, 50],
                enablePagination: "auto",
                paginationStyle: 'full_numbers',
                lengthChange: true,
                displayLength: $stateParams['results-per-page'],
                "currentPage": {
                    pageIndex: $stateParams.page
                },
                totalRecords: 0,
                draggable: true,
                checkbox: false,
                showDetails: false,
                "tableLanguage": {
                    "sEmptyTable": i18n.dps_table_no_data_show
                },
                callback: fn.viewActivitiesList.callback,
                renderRow: fn.viewActivitiesList.renderRow,
                cellClickActive: fn.viewActivitiesList.cellClickActive,
                tHeadCheckboxFn: fn.viewActivitiesList.tHeadCheckboxFn,
                changeSelect: fn.viewActivitiesList.changeSelect,
                searchString: ''
            };

            //
            //  View Data Provenance List Definitions
            //
            fn.viewDataProvenanceList = {
                callback: function (evtObj) { },
                renderRow: function (nRow, aData, iDataIndex) {
                },
                cellClickActive: function (event, trData) { },
                tHeadCheckboxFn: function (isAllChecked, event) { },
                changeSelect: function (evtObj) { }
            };

            $scope.viewDataProvenanceList = {
                id: "viewDataProvenanceList",
                data: [],
                columns: [{
                    sTitle: "ID",
                    sWidth: "auto",
                    mData: "id"
                }, {
                    sTitle: "ActivityHistoryId",
                    sWidth: "auto",
                    mData: "activityHistoryId"
                }, {
                    sTitle: "FlowFile Uuid",
                    sWidth: "auto",
                    mData: "flowFileUUID"
                }, {
                    sTitle: "Size",
                    sWidth: "auto",
                    mData: "size"
                }, {
                    sTitle: "Activity Name",
                    sWidth: "auto",
                    mData: "processorName"
                }, {
                    sTitle: "Activity Type",
                    sWidth: "auto",
                    mData: "processorType"
                }, {
                    sTitle: "Operation",
                    sWidth: "auto",
                    mData: ""
                }],
                enablePagination: false,
                displayLength: false,
                totalRecords: 0,
                draggable: true,
                currentPage: {
                    pageIndex: $stateParams.page
                },
                checkbox: false,
                showDetails: false,
                callback: fn.viewDataProvenanceList.callback,
                renderRow: fn.viewDataProvenanceList.renderRow,
                cellClickActive: fn.viewDataProvenanceList.cellClickActive,
                tHeadCheckboxFn: fn.viewDataProvenanceList.tHeadCheckboxFn,
                paginationStyle: false,
                changeSelect: fn.viewDataProvenanceList.changeSelect,
                searchString: ''
            };
            /*如果监控列表显示数据不足一页，刷新时$stateParams.page为空，操作无效*/
            if (!$stateParams.page) {
                $stateParams.page = 1;
            }
            // this function to response refresh button click
            $scope.refreshHistoryList = function () {
                fn.refreshHistoryList($stateParams.page, requestNum);
            };
            init();
        };

        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('pipelineMonitorV2.ctrl', pipelineMonitorCtrl);
        return dataAccessModule;
    }
);