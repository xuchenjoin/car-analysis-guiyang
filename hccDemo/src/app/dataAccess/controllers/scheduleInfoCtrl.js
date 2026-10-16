define(["language/dataAccess", "app-remote/services/tipMsgService"], function (i18n, tipMsgService) {
        "use strict";
        var scheduleInfoCtrl = ["$rootScope", "$scope", "$compile", "mask", "$state", "commonService", "instanceListService", "timeService",
            function ($rootScope, $scope, $compile, mask, $state, commonService, instanceListService, timeService) {
                $scope.i18n = i18n;
                $scope.endDateTime = true;
                var tipMessageService = new tipMsgService();
                //获取group的id
                var groupId_ = commonService.getGroupID() == null ? $rootScope.pipelineId : commonService.getGroupID();
                getProcessGroupById(groupId_);
                //根据id获取group对象
                Date.prototype.dpsToLocaleString1 = function () {
                    return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
                };
                Date.prototype.dpsToLocaleString2 = function () {
                    return this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
                };
                function getProcessGroupById(groupId_) {
                    if (groupId_) {

                        commonService.getProcessGroupPromise(groupId_).then(function (response) {
                            $scope.schedule = response.schedule;
                            if($scope.schedule.startTime && $scope.schedule.endTime == undefined){
                                $("#" + $scope.endRadioGroup.id).widget().opChecked("2","true");
                                $scope.endDateTime = false;
                            }
                            if ($scope.schedule.interval) {
                                $scope.timer = $scope.schedule.interval.split(" ");
                                //set default time type
                                $scope.timeType = $scope.timer[1];
                                angular.forEach($scope.selectType.values, function (val) {
                                    if (val.label == $scope.timeType) {
                                        $("[id^=selectType]>div").widget().opChecked(val.selectId);
                                    }
                                })


                                //set default time value
                                $scope.timeValue = $scope.timer[0];
                                angular.forEach($scope.selectTimeType, function (val) {
                                    if (val.label == $scope.timeType) {
                                        var num = val.selectId;
                                        switch (num) {
                                            case "1":
                                                $scope.selectTime.values = SelectTimeSpace.getMinutes();
                                                break;
                                            case "2":
                                                $scope.selectTime.values = SelectTimeSpace.getHours();
                                                break;
                                            case "3":
                                                $scope.selectTime.values = SelectTimeSpace.getDays();
                                                break;
                                            case "4":
                                                $scope.selectTime.values = SelectTimeSpace.getWeeks();
                                                break;
                                            case "5":
                                                $scope.selectTime.values = SelectTimeSpace.getMonths();
                                        }
                                    }


                                })
                                angular.forEach($scope.selectTime.values, function (val) {
                                    if (val.label == 1) {
                                        val.checked = false;
                                        /*$("[id^=selectTime]>div").widget().opChecked(val.selectId);*/
                                    }
                                    if (val.label == $scope.timeValue) {
                                        val.checked = true;
                                        /*$("[id^=selectTime]>div").widget().opChecked(val.selectId);*/
                                    }
                                })

                                //set schedule start time
                                $scope.scheduleStartTimeTmp1 = $scope.schedule.startTime + ":00";
                                var startTimeAll = timeService.fn.milliseconds2LocalTime(new Date($scope.scheduleStartTimeTmp1).getTime() * 1);
                                $scope.scheduleStartTime = new Date($scope.scheduleStartTimeTmp1.substring(0, $scope.scheduleStartTimeTmp1.indexOf("+"))).getTime();
                                $scope.timeRange.startTime.defaultDate = startTimeAll.split(" ")[0];
                                $scope.timeRange.startTime.defaultTime = startTimeAll.split(" ")[1];
                                /*
                                $scope.scheduleStartTimePart1 = new Date($scope.scheduleStartTime).dpsToLocaleString1();
                                $scope.scheduleStartTimePart2 = new Date($scope.scheduleStartTime).dpsToLocaleString2();

                                $scope.timeRange.startTime.defaultDate = $scope.scheduleStartTimePart1 ? $scope.scheduleStartTimePart1 : new Date();
                                $scope.timeRange.startTime.defaultTime = $scope.scheduleStartTimePart2 ? $scope.scheduleStartTimePart2 : new Date();
                                */

                                //set schedult end time
                                $scope.scheduleEndTimeTmp1 = $scope.schedule.endTime + ":00";
                                var endTimeAll = timeService.fn.milliseconds2LocalTime(new Date($scope.scheduleEndTimeTmp1).getTime() * 1);
                                $scope.timeRange.endTime.defaultDate = endTimeAll.split(" ")[0];
                                $scope.timeRange.endTime.defaultTime = endTimeAll.split(" ")[1];
                                /*
                                $scope.scheduleEndTimeTmp1 = $scope.schedule.endTime;
                                $scope.scheduleEndTime = new Date($scope.scheduleEndTimeTmp1.substring(0, $scope.scheduleEndTimeTmp1.indexOf("+"))).getTime();
                                

                                $scope.scheduleEndTimePart1 = new Date($scope.scheduleEndTime).dpsToLocaleString1();
                                $scope.scheduleEndTimePart2 = new Date($scope.scheduleEndTime).dpsToLocaleString2();

                                $scope.timeRange.endTime.defaultDate = $scope.scheduleEndTimePart1;
                                $scope.timeRange.endTime.defaultTime = $scope.scheduleEndTimePart2;
                                */
                            } else {
                                $scope.scheduleEndTime = new Date().getTime() + 15*60*1000;

                                $scope.scheduleEndTimePart1 = new Date($scope.scheduleEndTime).dpsToLocaleString1();
                                $scope.scheduleEndTimePart2 = new Date($scope.scheduleEndTime).dpsToLocaleString2();

                                $scope.timeRange.endTime.defaultDate = $scope.scheduleEndTimePart1;
                                $scope.timeRange.endTime.defaultTime = $scope.scheduleEndTimePart2;
                            }
                        },function(){
                            $scope.scheduleEndTime = new Date().getTime() + 15*60*1000;

                            $scope.scheduleEndTimePart1 = new Date($scope.scheduleEndTime).dpsToLocaleString1();
                            $scope.scheduleEndTimePart2 = new Date($scope.scheduleEndTime).dpsToLocaleString2();

                            $scope.timeRange.endTime.defaultDate = $scope.scheduleEndTimePart1;
                            $scope.timeRange.endTime.defaultTime = $scope.scheduleEndTimePart2;
                        })
                    }

                }


                //select ending type
                var endingType = [{
                    "key": "1",
                    "text": "after",
                    "checked": true,
                    "disable": false
                },{
                    "key": "2",
                    "text": "never",
                    "checked": false,
                    "disable": false
                }];
                $scope.endRadioGroup = {
                    "id": "endRadioGroup",
                    "layout": "horizon",
                    "values": endingType,
                    "change": function () {
                        $scope.availableId = $("#" + $scope.endRadioGroup.id).widget().opChecked("checked");
                        if($scope.availableId == "1"){
                            $scope.endDateTime = true;

                            $scope.scheduleEndTime = new Date().getTime() ;

                            $scope.scheduleEndTimePart1 = new Date($scope.scheduleEndTime).dpsToLocaleString1();
                            $scope.scheduleEndTimePart2 = new Date($scope.scheduleEndTime).dpsToLocaleString2();

                            $scope.timeRange.endTime.defaultDate = $scope.scheduleEndTimePart1;
                            $scope.timeRange.endTime.defaultTime = $scope.scheduleEndTimePart2;

                        }else if($scope.availableId == "2"){
                            $scope.endDateTime = false;
                        }
                    }
                };
                var SelectTimeSpace = {
                    "getMinutes": function () {
                        var minutesArr = [];
                        for (var i = 14; i < 59; i++) {
                            (function (arg) {
                                if (arg == 14) {
                                    minutesArr[arg - 14] = {
                                        selectId: arg - 13,
                                        label: arg + 1,
                                        checked: true
                                    }
                                } else {
                                    minutesArr[arg - 14] = {
                                        selectId: arg - 13,
                                        label: arg + 1
                                    }
                                }

                            })(i)
                        }
                        return minutesArr;
                    },
                    "getHours": function () {
                        var hoursArr = [];
                        for (var i = 1; i < 24; i++) {
                            (function (arg) {
                                if (arg == 1) {
                                    hoursArr[arg - 1] = {
                                        selectId: arg,
                                        label: arg,
                                        checked: true
                                    }
                                } else {
                                    hoursArr[arg - 1] = {
                                        selectId: arg,
                                        label: arg
                                    }
                                }

                            })(i)
                        }
                        return hoursArr;
                    },
                    "getDays": function () {
                        var daysArr = [];
                        var daysObject = {}
                        for (var i = 1; i < 7; i++) {
                            (function (arg) {
                                if (arg == 1) {
                                    daysArr[arg - 1] = {
                                        selectId: arg,
                                        label: arg,
                                        checked: true
                                    }
                                } else {
                                    daysArr[arg - 1] = {
                                        selectId: arg,
                                        label: arg
                                    }
                                }

                            })(i)
                        }
                        return daysArr;
                    },
                    "getWeeks": function () {
                        var weeksArr = [];
                        for (var i = 1; i < 4; i++) {
                            (function (arg) {
                                if (arg == 1) {
                                    weeksArr[arg - 1] = {
                                        selectId: arg,
                                        label: arg,
                                        checked: true
                                    }
                                } else {
                                    weeksArr[arg - 1] = {
                                        selectId: arg,
                                        label: arg
                                    }
                                }

                            })(i)
                        }
                        return weeksArr;
                    },
                    "getMonths": function () {
                        var monthsArr = [];
                        for (var i = 1; i < 13; i++) {
                            (function (arg) {
                                monthsArr[arg] = {
                                    selectId: arg,
                                    label: arg
                                }
                            })(i)
                        }
                        return monthsArr;
                    }
                };
                $scope.timeChangeAuto = SelectTimeSpace.getMinutes();
                $scope.selectTimeType = [{
                    selectId: '1',
                    label: 'minutes',
                    checked: true
                }, {
                    selectId: '2',
                    label: 'hours'
                }, {
                    selectId: '3',
                    label: 'days'
                }, {
                    selectId: '4',
                    label: 'weeks'
                }/*,{
                 selectId : '5',
                 label:'months'
                 }*/];

                $scope.changeEndTime = function (flag) {
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
                    Date.prototype.dpsToLocaleString1 = function () {
                        return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
                    };
                    Date.prototype.dpsToLocaleString2 = function () {
                        return this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
                    };
                    var timeType = $("#selectType").widget().getSelectedId();
                    var timeValue;
                    if (flag) {
                        switch (timeType) {
                            case "1":
                                timeValue = "15";
                                break;
                            case "2":
                                timeValue = "1";
                                break;
                            case "3":
                                timeValue = "1";
                                break;
                            case "4":
                                timeValue = "1";
                        }
                    } else {
                        timeValue = $("#selectTime").widget().getSelectedLabel();
                    }
                    var timeResultAnother = $scope.exchangToMillSecondsAnother(timeType, timeValue);
                    var startTime = $("#" + $scope.timeRange.startTime.id).widget().getDateTime();
                    var startTime_ = new Date(startTime.replace("-","/").replace("-","/")).getTime();
                    if (startTime_ < new Date().getTime()) {
                        startTime_ = new Date().getTime();
                    }

                    $scope.timeRange.startTime.defaultDate = new Date().dpsToLocaleString1();
                    $scope.timeRange.startTime.defaultTime = new Date().dpsToLocaleString2();


                    $scope.timeRange.endTime.defaultDate = new Date(startTime_ + timeResultAnother).dpsToLocaleString1();
                    $scope.timeRange.endTime.defaultTime = new Date(startTime_ + timeResultAnother).dpsToLocaleString2();
                };
                $scope.selectType = {
                    "id": "selectType",
                    "values": $scope.selectTimeType,
                    "width": 100,
                    "display": true,
                    'disable': false,
                    "select": function (selectId, label) {
                        var selectId = $("#selectType").widget().getSelectedId();
                        var typeFlag = true;
                        switch (selectId) {
                            case "1":
                                $scope.selectTime.values = SelectTimeSpace.getMinutes();
                                $scope.changeEndTime(typeFlag);
                                break;
                            case "2":
                                $scope.selectTime.values = SelectTimeSpace.getHours();
                                $scope.changeEndTime(typeFlag);
                                break;
                            case "3":
                                $scope.selectTime.values = SelectTimeSpace.getDays();
                                $scope.changeEndTime(typeFlag);
                                break;
                            case "4":
                                $scope.selectTime.values = SelectTimeSpace.getWeeks();
                                $scope.changeEndTime(typeFlag);
                                break;
                            case "5":
                                $scope.selectTime.values = SelectTimeSpace.getMonths();
                                $scope.changeEndTime(typeFlag);
                        }
                    }
                };


                $scope.selectTime = {
                    "id": "selectTime",
                    "values": $scope.timeChangeAuto,
                    "width": 100,
                    "height": 200,
                    "display": true,
                    'disable': false,
                    "select": function (selectId, label) {
                        $scope.changeEndTime();
                    }
                };

                $scope.exchangToMillSeconds = function (type, value) {
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
                $scope.timeRange = {
                    "label": i18n.common_term_operationDate_label + ":",
                    "startTime": {
                        "id": "startTime",
                        //不可变
                        "type": "datetime",
                        "disable": "false",
                        "defaultDate": new Date(),
                        "minDate": new Date(),
                        "ampm": false,
                        "firstDay": "1",
                        "width": 220,
                        "timeFormat": "hh:mm:ss",
                        "dateFormat": "yy-mm-dd",
                        "on-close": close,
                        "close": function (date) {
                            var startTmp = $("#" + startTime.id).widget().getDateTime();
                            var startTime_ = new Date(startTmp).getTime();
                            var endTmp = $("#" + endTime.id).widget().getDateTime();
                            var endTime_ = new Date(endTmp).getTime();
                            var timeType = $("#selectType").widget().getSelectedId();
                            var timeValue = $("#selectTime").widget().getSelectedLabel();
                            var timeResult = $scope.exchangToMillSeconds(timeType, timeValue);
                            if (startTime_ && endTime_ && timeResult) {
                                if (endTime_ < startTime_) {
                                    tipMessageService.clearErrorMessages();
                                    tipMessageService.alert("error", i18n.dps_canvas_toolbar_timeName, '0px');
                                    return;
                                } else if (endTime_ - startTime_ < timeResult) {
                                    tipMessageService.clearErrorMessages();
                                    tipMessageService.alert("error", i18n.dps_canvas_toolbar_notOver, '0px')
                                    return;
                                }
                            }
                        }
                    },
                    "endTime": {
                        "id": "endTime",
                        "width": 220,
                        "type": "datetime",
                        "timeFormat": "hh:mm:ss",
                        "dateFormat": "yy-mm-dd",
                        "ampm": false,
                        "firstDay": 1,
                        "defaultDate": new Date(),
                        "minDate": new Date(),
                        /* "maxDate": endTime_,*/
                        "on-close": close,
                        "close": function (date) {
                            var startTmp = $("#" + startTime.id).widget().getDateTime();
                            var startTime_ = new Date(startTmp).getTime();
                            var endTmp = $("#" + endTime.id).widget().getDateTime();
                            var endTime_ = new Date(endTmp).getTime();
                            var timeType = $("#selectType").widget().getSelectedId();
                            var timeValue = $("#selectTime").widget().getSelectedLabel();
                            var timeResult = $scope.exchangToMillSeconds(timeType, timeValue);
                            if (startTime_ && endTime_ && timeResult) {
                                if (endTime_ < new Date().getTime()) {
                                    tipMessageService.clearErrorMessages();
                                    tipMessageService.alert("error", i18n.dps_canvas_toolbar_nowTest, '0px');
                                    return;
                                } else if (endTime_ < startTime_) {
                                    tipMessageService.clearErrorMessages();
                                    tipMessageService.alert("error", i18n.dps_canvas_toolbar_timeName, '0px');
                                    return;
                                } else if (endTime_ - startTime_ < timeResult) {
                                    tipMessageService.clearErrorMessages();
                                    tipMessageService.alert("error", i18n.dps_canvas_toolbar_notOver, '0px')
                                    return;
                                }
                            }
                        }
                    }
                };

            }];

        var dataCraftModule = angular.module('dataAccess.config');
        dataCraftModule.tinyController('scheduleInfo.ctrl', scheduleInfoCtrl);
        return dataCraftModule;
    }
);
