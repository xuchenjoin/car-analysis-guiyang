define(['language/dataAccess'],
    function (i18n) {
        "use strict";

        var createInstanceCtrl = function ($rootScope, $scope, $state, $stateParams, $compile, mask, createInstanceService, instanceListService, commonService) {
            $scope.i18n = i18n;
            var pipelineState, revisionId, revisionVersion, pipelineName;
            var refreshST;
            var requestNum = 10;

            // 返回列表url
            $scope.backLink = '';

            //校验规则
            $scope.checkPipelineNameRules = createInstanceService.checkRules;
            $scope.checkPipelineDescriptionRules = createInstanceService.checkDescriptionRules;
            //template下拉框
            $scope.templateSelect = {
                "id": "templateSelect",
                "placeholder": "",
                "values": [],
                "change": function () {

                },
                "width": 200,
                "display": true,
                "mode": "multiple"
            };

            //confirmEditPipelineButton
            $scope.newStepNameTextBox1 = {
                id: "revisionId",
                value: "",
                "keydown": function (event) {
                }
            };
            var timestamp = new Date().getTime();
            var defaultName = 'pipeline' + '_' + String(timestamp).slice(9);
            $scope.newStepNameTextBox2 = {
                id: "pipelineName",
                "placeholder": i18n.pipelineName,
                "maxLength":63,
                value: defaultName,
                "keydown": function (event) {
                }
            };
            $scope.newStepDescriptionTextBox2 = {
                id: "pipelineDescription",
                "placeholder": i18n.pipelineDescription,
                "maxLength":1024,
                value: "",
                type: "multi",
                width: 240,
                height: 100,
                resize:"none",
                "keydown": function (event) {
                }
            };
            $scope.newStepNameTextBox3 = {
                id: "revisionVersion",
                value: "",
                "keydown": function (event) {
                }
            };
            $scope.dateModel = {
                id: "dateModel",
                width: "168px",
                type: "date",
                "onCloseMin": function (date) {
                }
            };
            $scope.currentSubTask = {
                id: "newTaskName",
                text: "",
                type: "Active"
            };
            $scope.res_routine = i18n.pipelineStateActive;
            $scope.srv_routine = i18n.pipelineStateInActive;
            $scope.currentSubTask.type = $scope.currentSubTask.type;
            $scope.subTaskTypeChange = function () {
                pipelineState = $scope.currentSubTask.type;
                getPipelineRevision();
            };
            $scope.confirmCreatePipelineButton = {
                "id": "confirmCreatePipelineButton",
                "text": i18n.confirm1,
                "click": function (environmentflag) {
                    /*TODO:go to apply for new instance page*/
                    console.log("now I will insert a new instance");
                    if (tinyWidget.UnifyValid.FormValid($("#createPipelineForm"))) {
                        if(environmentflag){
                            /*insertPipeline($scope.newStepNameTextBox2.value,$scope.newStepDescriptionTextBox2.value);*/
                             $rootScope.transferPipelineName=$scope.newStepNameTextBox2.value;
                             $rootScope.transferPipelineDescription=$scope.newStepDescriptionTextBox2.value;

                             return;
                        }else{
                            var params = {
                                "name": $scope.newStepNameTextBox2.value,
                                "description": $scope.newStepDescriptionTextBox2.value
                            };
                            var promise = createInstanceService.createPipeline(params);
                            return promise;

                        }
                    }
                }
            };
            //cancelEditPipelineButton
            $scope.cancelCreatePipelineButton = {
                "id": "cancelCreatePipelineButton",
                "text": i18n.cancel,
                //初始数据为空
                "click": function () {
                    /*TODO:go to apply for new instance page*/
                    console.log("now I will go to new instance page");
                }
            };

            $scope.textboxCreatePipelineButton = {
                "id": "textboxCreatePipelineButton",
                "text": "",
                //初始数据为空
                "type": "multi",
                "height": 400,
                "width": 300,
                "placeholder": ""

            };
            $scope.submitCreatePipelineButton = {
                "id": "submitCreatePipelineButton",
                "text": i18n.submit,
                //初始数据为空
                "click": function () {
                    /*TODO:go to apply for new instance page*/
                    console.log("你点击的是：" + i18n.busynesstemplate);
                    $scope.textboxCreatePipelineButton.placeholder = i18n.busynesstemplate;
                }

            };
            function insertPipeline(pinpelineName,pipelineDescription) {
                if (pinpelineName) {
                    var params = {
                        "name": pinpelineName,
                        "description": pipelineDescription
                    };
                    var promise = createInstanceService.createPipeline(params);
                    /*$rootScope.$broadcast('createInstance', promise);*/
                    return promise;
                    clearTimeout(refreshST);
                    refreshST = setTimeout(function () {
                        },
                        commonService.WAIT_TIME);
                }
            }
        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('createInstance.ctrl', createInstanceCtrl);
        return dataAccessModule;
    });