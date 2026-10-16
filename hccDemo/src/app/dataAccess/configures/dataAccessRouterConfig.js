define(["lazy-load/lazyLoad"],
    function (lazyLoadModule) {
        "use strict";
        var configArr = [{
            name: "fakeCar",
            url: "/fakeCar",
            templateUrl: "src/app/dataAccess/views/fakeCar.html",
            controller: "fakeCarCtrl.ctrl",
            scripts: {
                'services': ['app/dataAccess/services/commonService',
                    'app/dataAccess/services/monitorService',
                    'app/dataAccess/services/timeService',
                    'app/dataAccess/services/instanceListService',
                    'app/dataAccess/services/showLogDetailService',
                    'app/dataAccess/services/fakeCarService'],
                'controllers': ['app/dataAccess/controllers/fakeCarCtrl',
                                ],
                'js': ['app/dataAccess/services/commonService']
            }
        },{
            name: "homePage",
            url: "/homePage",
            templateUrl: "src/app/dataAccess/views/home.html",
            controller: "homePageCtrl.ctrl",
            scripts: {
            	'controllers': ['app/dataAccess/controllers/homePageCtrl'
                                ],
            }
          
        }, {
            name: "highTraffic",
            url: "/highTraffic",
            templateUrl: "src/app/dataAccess/views/highTraffic.html",
            controller: "highTraffic.ctrl",
            scripts: {
                'services': ['app/dataAccess/services/commonService',
                    'app/dataAccess/services/showLogDetailService',
                    'app/dataAccess/services/timeService',
                    'app/dataAccess/services/instanceListService',
                    'app/dataAccess/services/fakeCarService'],
                'controllers': ['app/dataAccess/controllers/highTrafficCtr'],
                'js': ['app/dataAccess/services/commonService']
            }
        },{
            name: "highTraffic.map",
            url: "/map",
            templateUrl: "src/app/dataAccess/views/highTrafficMap.html",
            controller: "highTrafficMap.ctrl",
            scripts: {
                'services': [
                    'app/dataAccess/services/instanceListService',
                    'app/dataAccess/services/createInstanceService',
                    'app/dataAccess/services/timeService'
                ],
                'controllers': ['app/dataAccess/controllers/highTrafficMapCtrl'],
                'js': [
                       
                       ]
            }
        }, {
            name: "carMovement",
            url: "/carMovement",
            templateUrl: "src/app/dataAccess/views/carMovement.html",
            controller: "carMovement.ctrl",
            scripts: {
                'controllers': ['app/dataAccess/controllers/carMovementCtrl'],
                'services': ['app/dataAccess/services/commonService',
                             'app/dataAccess/services/monitorService',
                             'app/dataAccess/services/timeService',
                             'app/dataAccess/services/instanceListService',
                             'app/dataAccess/services/showLogDetailService',
                             'app/dataAccess/services/fakeCarService'],
                'js': []
            }
        }, {
            name: "trafficStat",
            url: "/trafficStat",
            templateUrl: "src/app/dataAccess/views/trafficStatics.html",
            controller: "trafficStatics.ctrl",
            scripts: {
                'controllers': ['app/dataAccess/controllers/trafficStaticsCtrl'],
                'services': ['app/dataAccess/services/commonService',
                             'app/dataAccess/services/monitorService',
                             'app/dataAccess/services/timeService',
                             'app/dataAccess/services/instanceListService',
                             'app/dataAccess/services/showLogDetailService',
                             'app/dataAccess/services/fakeCarService'],
                'js': ['app/dataAccess/services/commonService']
            }
        }, {
            name: "manage.pipelineList",
            url: "/pipelineList",
            templateUrl: "src/app/dataAccess/views/instanceList.html",
            controller: "instanceList.ctrl",
            scripts: {
                'services': [
                    'app/dataAccess/services/instanceListService',
                    'app/dataAccess/services/createInstanceService',
                    'app/dataAccess/services/timeService'
                ],
                'controllers': ['app/dataAccess/controllers/instanceListV2Ctrl'],
                'js': ['app/dataAccess/services/commonService']
            }
        },{
            name: "fakeCar.map",
            url: "/map",
            templateUrl: "src/app/dataAccess/views/fakeCarMap.html",
            controller: "fakeCarMap.ctrl",
            scripts: {
                'services': [
                    'app/dataAccess/services/instanceListService',
                    'app/dataAccess/services/createInstanceService',
                    'app/dataAccess/services/timeService'
                ],
                'controllers': ['app/dataAccess/controllers/fakeCarMapCtrl'],
                'js': [
                       
                       ]
            }
        },{
            name: "carMovement.map",
            url: "/map",
            templateUrl: "src/app/dataAccess/views/carMovementMap.html",
            controller: "carMovementMap.ctrl",
            scripts: {
                'services': [
                    'app/dataAccess/services/instanceListService',
                    'app/dataAccess/services/createInstanceService',
                    'app/dataAccess/services/timeService'
                ],
                'controllers': ['app/dataAccess/controllers/carMovementMapCtrl'],
                'js': [
                       
                       ]
            }
        },{
            name: "trafficStat.map",
            url: "/map",
            templateUrl: "src/app/dataAccess/views/trafficStatisticsMap.html",
            controller: "trafficStatisticsMap.ctrl",
            scripts: {
                'services': [
                    'app/dataAccess/services/instanceListService',
                    'app/dataAccess/services/createInstanceService',
                    'app/dataAccess/services/timeService'
                ],
                'controllers': ['app/dataAccess/controllers/trafficStatisticsMapCtrl'],
                'js': [
                       
                       ]
            }
        },{
            name: "uQuery",
            url: "/uquery",
            templateUrl: "src/app/dataAccess/views/uQuery.html",
            controller: "uQuery.ctrl",
            scripts: {
                'controllers': ['app/dataAccess/controllers/uQueryCtrl'],
                'services': ['app/dataAccess/services/commonService',
                'app/dataAccess/services/monitorService',
                'app/dataAccess/services/timeService',
                'app/dataAccess/services/instanceListService',
                'app/dataAccess/services/showLogDetailService',
                'app/dataAccess/services/fakeCarService'],
                'js': [
                       
                       ]
            }
        },{
            name: "uQuery.map",
            url: "/map",
            templateUrl: "src/app/dataAccess/views/uQueryMap.html",
            controller: "uQueryMap.ctrl",
            scripts: {
                'controllers': ['app/dataAccess/controllers/uQueryMapCtrl'],
                'js': [
                       
                       ]
            }
        }
        
        ];
        var dataAccessModule = angular.module("dataAccess.config", ["ui.router"]);
        dataAccessModule = lazyLoadModule.makeLazy(dataAccessModule);
        dataAccessModule.tinyStateConfig({stateConfig: configArr, urlMatch: [["/homePage"]]});
        return dataAccessModule;
    });