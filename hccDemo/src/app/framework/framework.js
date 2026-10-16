/**
 * 主框架module， 该模块依赖于angularjs ng module和tiny wcc module
 * 所有的service router都在这里进行统一的配置
 * Created on 13-12-25.
 */
/* global define */
/* global $ */
/* global angular */
/* global ha */
define(["angular/angular-animate",
        "ui-router/angular-ui-router",
        "language-remote/widgetsLanguage",
        "app-remote/framework/directive/hwsDirective",
        "app-remote/services/maskService",
        "app-remote/services/httpService",
        "app-remote/services/cookieService",
        "app-remote/services/exceptionService",
	"app-remote/services/msgService",
        "app-remote/framework/controllers/serviceCtrl",
        "app-remote/framework/controllers/menusCtrl",
        "app-remote/framework/services/frameworkService",
        "app-remote/services/utilService",
        "app/framework/configures/frameworkRouterConfig",
        "app/dataAccess/configures/dataAccessRouterConfig",
        "angularEchart/angular-echarts",        
        "echarts",
        "china",
        "shanghai"
        ],

    function (ngAnimate,router, widgetsLanguage, hws, mask, http, storage, exception, message, serviceCtrl,
              menusCtrl, frameworkServ, utilService, frameworkConfig, dataAccessRouterConfig,angularEcharts,echarts,china,shanghai ) {
        "use strict";

        // 设置控件国际化语言
        if (!window.tinyLanguage) {
            window.tinyLanguage = {};
        }
        window.tinyLanguage.language = widgetsLanguage;


        //注入框架的配置文件,wcc是tiny1的module，tiny是tiny2的module，ngAnimate是tiny2的module
        var dependency = [
            "ng",
            "wcc",
            //"tiny",
            "ngAnimate",
            "ui.router",
            "hws",
            frameworkConfig.name,
            dataAccessRouterConfig.name
        ];

        var framework = angular.module("framework", dependency);

        //如果是全局部署服务，请将该值设置为global(MOS请将该值设置为MOS)，页面区域信息将显示该值且将不再显示region下拉列表，否则设置为''
        framework.value('globalRegionName', '');
        framework.value('currentService', '');

        framework.value('favoriteServiceMax', 5);
        framework.value('heartbeatInterval', 5 * 60 * 1000);

        framework.value('sharedProperties', {});

        framework.controller("serviceCtrl", serviceCtrl);
        framework.controller("menusCtrl", menusCtrl);

        framework.service("mask", mask);
        framework.service("camel", http);
        framework.service("exception", exception);
        framework.service("storage", storage);
        framework.service("frameworkService", frameworkServ);
        framework.service("utilService", utilService);

       /* window.appWebPath = "/dps";*/
        var path = window.location.pathname;
        var pathStr =  path.substr(0, path.length - 1);
        window.appWebPath = pathStr;
     
        /**
         * 配置服务在console框架注册的endpointId
         * @type {string}
         */
        window.global_endpoint_id = "";
        //与application.properties的配置保持一致，该值请不要随意配置，只有部分使用console子域名的服务需要配置
        window.app_cookie_prefix = "";
        window.app_enable_framework_503 = false;

        //提供controllerPrivider, compileProvider常量
        framework.config(["$controllerProvider", "$compileProvider", "toggleSwitchConfigProvider",
            function ($controllerProvider, $compileProvider, toggleSwitchConfigProvider) {
                framework.controllerProvider = $controllerProvider;
                framework.compileProvider = $compileProvider;
                //Tiny switch组件默认配置
                toggleSwitchConfigProvider.onLabel = '\u00a0\u00a0';
                toggleSwitchConfigProvider.offLabel = '\u00a0\u00a0';
            }]);

        //menus-hws-start
        framework.run(["$rootScope", "$timeout", function ($rootScope, $timeout) {
            $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                if (typeof ha === "function") {
                    $timeout(function () {
                        ha("setAutoSendPV", false);
                        ha("set", {
                            "url": location.href
                        });
                        ha('trackPageView', {"page_hierarchy": "c:{" + toState.name.replace(/\./g, '/') + "}"});
                    }, 1);
                }
            });
        }
        ]);
        //menus-hws-end

        //Tiny校验位置定制化处理
        window.tinyWidget.UnifyValid.defaultTipPos = "top";

        var $locale = angular.injector(['ng']).get('$locale');
        var locale = $.extend(true, $locale, widgetsLanguage.locale);
        angular.module('ngLocale').config(function($provide) {
            $provide.value('$locale', locale);
        });
        return framework;
    });