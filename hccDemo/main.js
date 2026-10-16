/**
 * 工程的module加载配置文件
 * module的基础路径为"工程名/"
 * Created on 13-12-12.
 */
/* global require */
/* global angular */
/* global $ */
/* jshint -W097 */
'use strict';
require.config({
    "baseUrl": "./",
    "waitSeconds": 0,
    "urlArgs": "v=" + Date.now(),
    "paths": {
        "can": "lib/can", //桩路径
        "app": "src/app", //app文件夹路径
        "business-app-remote": "src/app",
        "app-remote": "src/app", //app文件夹路径
        "angular": "lib/angular",
        "ui-router": "lib/angular-ui/ui-router",
        "bootstrap": "lib/bootstrap3.3.6/js",
        "moment": "lib/moment/moment.min",
        "language": "i18n/default/" + window.urlParams.lang,
        "language-remote": "i18n/default/" + window.urlParams.lang,
        "lazy-load": "lib/lazy-load",
        "fixtures": "fixtures",
        "remote-lib": "lib",
        "angularEchart":"lib/echart",
        "echarts":"lib/echart/echarts.min",
        "china":"lib/echart/china",
        "shanghai":"lib/echart/shanghai",
        "baidu":"lib/baidu/map",
        "lushu":"lib/baidu/Lushu"
    },
    "priority": [
        "angular"
    ]
});

//menus-hws-start
require(["remote-lib/analysis"], function (analysis) {
    /* jshint -W030 */
    analysis && analysis.start();
});
//menus-hws-end

/**
 * 主启动类，手动给html element绑定module
 */
require(["app/framework/framework"], function (app) {
    angular.bootstrap($("html"), [app.name]);
});
