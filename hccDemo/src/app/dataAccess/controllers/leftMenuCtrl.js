
define(
    ['language/dataAccess'],
    function (i18n) {
        "use strict";

        var leftMenuCtrl = function ($rootScope, $scope, $state, $stateParams, $compile, mask, commonService) {
            $scope.i18n = i18n;
            $scope.plugins = { "text": i18n.dps_title_text };

            $scope.serviceList = [{
                iconClass: 'icon-dps-dps-left-menu-pipelines',
                title: i18n.dps_pipeline_list,
                state: "manage.pipelineList",
                params: {},
                hide: false
            }, {
                iconClass: 'icon-dps-dps-left-menu-warnings',
                title: i18n.dps_alarm_list_title,
                state: "manage.alarmList",
                params: {},
                hide: false
            }, {
                iconClass: 'icon-dps-dps-left-menu-logs',
                title: i18n.left_menu_opertaion_logs,
                state: "manage.operationLogs",
                params: {},
                hide: false
            }, {
                iconClass: 'icon-dps-editor-link',
                title: i18n.left_menu_Key_Generate_certificate,
                state: "manage.certificate",
                params: {},
                hide: false
            }];

            $scope.go = function (state, params) {
                window.location.hash = '/' + state.replace('.', '/');
            };

            // 用于标志是否为点击 tiny-layout-head 所导致的stateChangeSuccess事件，此种情况下无需设置layout层级菜单激活状态
            var isheadClick = false;
            var lay;
            $scope.headClickFn = function () {
                isheadClick = true;
                setTimeout(function () {
                    setCurActive();
                }, 100);
            };
            function setCurActive() {
                try {
                    var currentName = $state.current.name;
                    lay.opActive($("a[ui-sref='" + currentName + "']").last());
                } catch (e) {
                }
            }

           /* function leftMenuResponse() {
                var leftMenuDom = document.querySelector("#leftMenu"),
                    leftMenuHeight = leftMenuDom.offsetHeight;
                var listHeight = document.querySelector("#leftMenu ul").offsetHeight;

                if (leftMenuHeight < listHeight) {
                    leftMenuDom.style.overflow = null;
                    leftMenuDom.styleoverflowX = "hidden";
                } else {
                    leftMenuDom.style.overflow = "visible";
                }
            }

            $(window).resize(function () {
                leftMenuResponse();
            });

            leftMenuResponse();*/
            
            $scope.$on("$viewContentLoaded", function () {
                if (navigator.userAgent.indexOf("Firefox") > -1) {
                    $("#dpsLogo").css("margin-top", "3px");
                }
                setTimeout(function () {
                    lay = new tinyWidget.Layout({
                        "id": "leftBar",
                        "subheight": 93,
                        "footerHeight": 34
                    });
                    setCurActive();
                }, 0);
                $('.dropdown-toggle').dropdown();
            });

        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('leftMenu.ctrl', leftMenuCtrl);
        return dataAccessModule;
    });
