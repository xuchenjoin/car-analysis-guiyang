
define(['language/dataAccess'], function (i18n) {
    "use strict";

    var compsPanelCtrl = function ($rootScope, $scope, $compile, camel, mask, commonService, canvasService, processManager, editorLayout, processTypeManager, processStatus, $timeout) {
        $scope.layout = editorLayout.getCompsPanelLayout();
        $scope.processorTypes;
        $scope.templateTypes;
        processTypeManager.getProcessTypePromise().then(
            function (response) {
                $scope.processorTypes = processTypeManager.getProcessTypes();
            }
        );
        /**
         * search button
         * @type {{display: boolean, width: number, placeholder: string, search: Function, suggest: Function}}
         */
        $scope.searchBtn = {
            display: true,
            width: 230,
            placeholder: "activity name",
            search: function (content) { },
            suggest: function (content) { }
        };
        /**
         * process type mouse down
         * @param processType
         */
        $scope.processTypeMousedown = function (processType) {
            if (processType) {
                processTypeManager.setSelectedProcessType(processType);
            }
        };

        /**
         * process type drag stop
         * @param event
         * @param ui
         */
        $scope.processTypeDragStop = function (event, ui) {
            var scaleFactor = processManager.getScaleFactor();
            var screenOffset = processManager.getCanvasScrollOffset();
            var position = { x: (ui.position.left - 257 + screenOffset.left) / scaleFactor, y: (ui.position.top - 101 + screenOffset.top) / scaleFactor };
            var selectedProcessType = processTypeManager.getSelectedProcessType();//要生成的processor的类型
            processManager.createNewProcessPromise(position, selectedProcessType);
            $scope.$evalAsync();
        };

        $scope.processTemplateDragStop = function (event, ui) {
            var position = { x: ui.position.left - 257, y: ui.position.top };
            var selectedProcessType = processTypeManager.getSelectedProcessType();
            processManager.getTemplateStructure(position, selectedProcessType).then(function (response) {
                $rootScope.$broadcast('templateConfig', response);
            });
        }
        /**
         * class types show
         * @param processClass
         */

        $scope.classSwitchClick = function (processClass) {
            if (processClass.isShow) {
                processClass.isShow = false;
            } else {
                processClass.isShow = true;
            }
        };

        /**
         * group show switch
         * @param processGroup
         */
        $scope.groupSwitchClick = function (processGroup) {
            if (processGroup.isShow) {
                processGroup.isShow = false;
            } else {
                processGroup.isShow = true;
            }
        };

        /**
         * menu switch
         */
        $scope.menuSwitchClick = function () {
            if ($scope.layout.ifShow) {
                $scope.layout.ifShow = false;
            } else {
                $scope.layout.ifShow = true;
            }
        };
    };
    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyController('compsPanel.ctrl', compsPanelCtrl);
    return dataCraftModule;
});