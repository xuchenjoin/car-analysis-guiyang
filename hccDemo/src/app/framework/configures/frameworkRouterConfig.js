/**
 * 定义的整体框架的 路由地址
 * Created on 13-12-25.
 */
/* global define */
/* global $ */
/* global angular */
define(["tiny-lib/angular", "lazy-load/lazyLoad"],
    function (angular, lazyLoadModule) {
        "use strict";
        var nonsupportRegion = {
            url: "src/app/framework/views/nonsupportRegion.html"
        };

        var beingMaintained = {
            url: "src/app/framework/views/beingMaintained.html"
        };

        var accessDeclined = {
            url: "src/app/framework/views/accessDeclined.html"
        };

        var configArr = [
            {
                name: "home",
                url: "/home"
            },
            {
                name: "nonsupportRegion",
                url: "/nonsupportRegion",
                templateUrl: nonsupportRegion.url,
                controller: "nonsupportRegion.ctrl",
                scripts: {
                    'controllers': ['app-remote/framework/controllers/nonsupportRegionCtrl']
                }

            },
            {
                name: "beingMaintained",
                url: "/beingMaintained",
                templateUrl: beingMaintained.url,
                controller: "beingMaintained.ctrl",
                scripts: {
                    'controllers': ['app-remote/framework/controllers/beingMaintainedCtrl']
                }

            },
            {
                    name: "accessDeclined",
                    url: "/accessDeclined",
                    templateUrl: accessDeclined.url,
                    controller: "accessDeclined.ctrl",
                    scripts: {
                        'controllers': ['app-remote/framework/controllers/accessDeclinedCtrl']
                    }
            }
        ];

        var frmModule = angular.module("frm", ["ui.router"]);
        frmModule = lazyLoadModule.makeLazy(frmModule);
        frmModule.tinyStateConfig({stateConfig: configArr});
        frmModule.tinyStateConfig({urlMatch: [["/home"]]});
        return frmModule;
    });