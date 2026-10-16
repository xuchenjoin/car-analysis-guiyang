define(['language/dataAccess'], function (i18n) {
    "use strict";
    var pipelineDetailsCtrl = function ($rootScope, $scope, $state, $stateParams, $compile, mask, instanceListService, commonService, timeService) {

        $scope.i18n = i18n;

        $scope.pipelineInfo = {};

        $scope.myOrderUrl = "";
        $scope.orderInfo = {
            "ifShowOrderInfo": true
        }
        //获取工作流列表上已经存在的属性，通过这些属性找到当前工作流的id；
        var parentScope = $("#instanceListTable").scope();

        var pipeline_id = parentScope.instanceListTable.value.pipelineId;
        var ENVIRONMENT_FLag = commonService.getEnvironmentFlag();  //true for hws environment and false for tlf environment
        //通过工作流的id获取订单信息函数，透传文件已配置好，此处可以参照恢复工作流的方法来定义函数
        function getorderinformation(id) {
            if (id) {
                return instanceListService.getPipelineOrderInfo(id);
            }
        }

        function isInvalidScheduleInterval(interval) {
            return [null, undefined, NaN, '', '0'].indexOf(interval) != -1;
        }

        //通过工作流id获取工作流详情
        instanceListService.getPipelineInfo(pipeline_id).then(function (data) {
            $scope.pipelineInfo.pipelineId = data.id;
            if (data && data.startTime != undefined ) {
                var startTimeTmp = data.startTime.substring(0, data.startTime.length - 3);
                var startTime = new Date(startTimeTmp).getTime();
                data.startTime = timeService.fn.milliseconds2LocalTime(startTime * 1);
                if (isInvalidScheduleInterval(data.startTime)) {
                    data.startTime = '--';
                }
                if(data.endTime != undefined){
                    var endTimeTmp = data.endTime.substring(0, data.endTime.length - 3);
                    var endTime = new Date(endTimeTmp).getTime();
                    data.endTime = timeService.fn.milliseconds2LocalTime(endTime * 1);
                    if (isInvalidScheduleInterval(data.endTime)) {
                        data.endTime = '--';
                    }
                }else{
                    data.endTime = '--';
                }

            } else {
                data.startTime = '--';
                data.endTime = '--';
                data.interval = '--';
            }

            $scope.pipelineInfo.startTime = data.startTime;
            $scope.pipelineInfo.endTime = data.endTime;
            $scope.pipelineInfo.interval = data.interval;
            $scope.pipelineInfo.description=data.description?data.description:"--";
        }, function (data) {
            if (data.status == 200) {
                $scope.pipelineInfo.pipelineId = data.id;
                if (data && data.startTime != undefined && data.endTime != undefined) {
                    var startTimeTmp = data.startTime.substring(0, data.startTime.length - 3);
                    var startTime = new Date(startTimeTmp).getTime();
                    data.startTime = timeService.fn.milliseconds2LocalTime(startTime * 1);
                    if (isInvalidScheduleInterval(data.startTime)) {
                        data.startTime = '--';
                    }

                    if(data.endTime != undefined){
                        var endTimeTmp = data.endTime.substring(0, data.endTime.length - 3);
                        var endTime = new Date(endTimeTmp).getTime();
                        data.endTime = timeService.fn.milliseconds2LocalTime(endTime * 1);
                        if (isInvalidScheduleInterval(data.endTime)) {
                            data.endTime = '--';
                        }
                    }
                } else {
                    data.startTime = '--';
                    data.endTime = '--';
                    data.interval = '--';
                }

                $scope.pipelineInfo.startTime = data.startTime;
                $scope.pipelineInfo.endTime = data.endTime;
                $scope.pipelineInfo.interval = data.interval;
                $scope.pipelineInfo.description=data.description?data.description:"--";
            } else {
                commonService.netErrorTip(i18n, data);
            }
        });

        //通过工作流id获取订单数据
        if (ENVIRONMENT_FLag) {
            var promise = getorderinformation(pipeline_id);
            promise.then(function (data) {
                if (data && data.orderInfoDTO) {
                    $scope.pipelineInfo.orderId = data.orderInfoDTO.orderId ? data.orderInfoDTO.orderId : "--";
                    $scope.pipelineInfo.createTime = data.orderInfoDTO.validTime ? data.orderInfoDTO.validTime : "--";
                    //英文界面包年包月需要显示英文转换
                    if (data.orderInfoDTO.billingType) {
                        if (window.urlParams.lang.toLowerCase() == 'zh-cn') {
                            $scope.pipelineInfo.billingType = data.orderInfoDTO.billingType;
                        } else {
                            switch (data.orderInfoDTO.billingType) {
                                case "包年/包月":
                                    $scope.pipelineInfo.billingType = i18n.dps_pipeline_yearMonth;
                                    break;
                                case "按需计费":
                                    $scope.pipelineInfo.billingType = i18n.dps_pipeline_Metered;
                                    break;
                            }
                        }
                    } else {
                        $scope.pipelineInfo.billingType = "--";
                    }
                    $scope.pipelineInfo.expireTime = data.orderInfoDTO.expireTime ? data.orderInfoDTO.expireTime : "--";
                    //设置订单id的跳转链接，先获取主机名称
                    var urlHostName = commonService.urlHostName;
                    var hostname;
                    for (var i = 0; i < urlHostName.length; i++) {
                        if (window.location.hostname === urlHostName[i].hostname) {
                            hostname = urlHostName[i]._hostnamePay;
                        }
                    }
                    var userCenterUri = "https://" + hostname + "/usercenter/#/userindex/orderDetail";

                    var paramsStrUri = "orderId=" + $scope.pipelineInfo.orderId;
                    //拼接完整的订单链接地址，主要是加上agencyId,region,local这三个参数
                    var url = commonService.genHWSHref(userCenterUri + "?" + paramsStrUri);

                    $scope.myOrderUrl = url;
                    $scope.pipelineInfo.description=data.orderInfoDTO.description?data.orderInfoDTO.description: "--";
                }
            }, function (data) {
                if (data.status === 200) {
                    $scope.pipelineInfo.orderId = data.orderInfoDTO.orderId ? data.orderInfoDTO.orderId : "--";
                    $scope.pipelineInfo.createTime = data.orderInfoDTO.validTime ? data.orderInfoDTO.validTime : "--";
                    //英文界面包年包月需要显示英文转换
                    if (data.orderInfoDTO.billingType) {
                        if (window.urlParams.lang.toLowerCase() == 'zh-cn') {
                            $scope.pipelineInfo.billingType = data.orderInfoDTO.billingType;
                        } else {
                            switch (data.orderInfoDTO.billingType) {
                                case "包年/包月":
                                    $scope.pipelineInfo.billingType = i18n.dps_pipeline_yearMonth;
                                    break;
                                case "按需计费":
                                    $scope.pipelineInfo.billingType = i18n.dps_pipeline_Metered;
                                    break;
                            }
                        }
                    } else {
                        $scope.pipelineInfo.billingType = "--";
                    }
                    $scope.pipelineInfo.expireTime = data.orderInfoDTO.expireTime ? data.orderInfoDTO.expireTime : "--";
                    //设置订单id的跳转链接，先获取主机名称
                    var urlHostName = commonService.urlHostName;
                    var hostname;
                    for (var i = 0; i < urlHostName.length; i++) {
                        if (window.location.hostname === urlHostName[i].hostname) {
                            hostname = urlHostName[i]._hostnamePay;
                        }
                    }
                    var userCenterUri = "https://" + hostname + "/usercenter/#/userindex/orderDetail";

                    var paramsStrUri = "orderId=" + $scope.pipelineInfo.orderId;
                    //拼接完整的订单链接地址，主要是加上agencyId,region,local这三个参数
                    var url = commonService.genHWSHref(userCenterUri + "?" + paramsStrUri);

                    $scope.myOrderUrl = url;

                    $scope.pipelineInfo.description=data.orderInfoDTO.description?data.orderInfoDTO.description: "--";

                } else {
                    commonService.netErrorTip(i18n, data);
                }
            })
        } else {
            $scope.orderInfo.ifShowOrderInfo = false;
        }


    }
    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyController('pipelineDetails.ctrl', pipelineDetailsCtrl);
    return dataAccessModule;
})
