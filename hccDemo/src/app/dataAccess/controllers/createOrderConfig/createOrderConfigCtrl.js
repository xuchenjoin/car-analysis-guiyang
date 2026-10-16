define(['language/dataAccess','src/app/common/commonInfo'], function (i18n,commonInfo) {
    "use strict";

    var createOrderConfigCtrl = function ($rootScope, $scope, $state, $stateParams, $compile,$location, mask, createOrderConfigService, storage, commonService) {
        var regionsData;
        var productsData;
        var regionId;
        var availableZoneId;
        var servicesId;
        var buyPeroid = 1;//peroid of buy the service.
        var buyPeroidDes = i18n.aMonth;
        var infoObj = {};
        $rootScope.step={curStep:1};//标示当前创建订购服务执行到的步骤
        $scope.commonInfo = commonInfo;
        $scope.regions = [];
        $scope.AZs = [];
        $scope.services = [];
        $scope.i18n = i18n;
        $scope.servicePrice = 0;//servece price
        $scope.Fee = storage.get("feeInfo") ? storage.get("feeInfo")+".00" : "85.00";
        $scope.productName=i18n.dps_examineOrder_month;
        $scope.FeeUnit = '';
        $scope.slideFlag = true;
        $scope.productNameInfo=commonService.produceNameInfo;
        $scope.checkItem=["Duration","buyPeroid","totalPrice","BillingType","RegionId","regionName",
            "AvailableZoneName","AvailableZoneCode","AvailableZoneId","productName","productId"];

        var defaultName=storage.get("pipelineNameCookie")?storage.get("pipelineNameCookie"):'pipeline' + '_' + String(new Date().getTime()).slice(9);
        var defaultDescription=storage.get("pipelineDescriptionCookie")?storage.get("pipelineDescriptionCookie"):'';
        $scope.newStepNameTextBox2= {
            id: "pipelineName",
            "placeholder": i18n.pipelineName,
            /*maxLength用于当用户输入超过62个字符时禁止用户继续输入，但此时无提示输入不能多于62字符，参考ECS，此处应去掉maxLength属性，保留提示信息*/
            //"maxLength":62,
            "focused" : true,
            value: defaultName,
            "validate":[{
                validFn : "maxSize",
                params : 62,
                errorDetail : i18n.dps_validate_pipeline_name_num//"输入不能多于62字符"
            },{
                validFn:"required",
                errorDetail : i18n.dps_validate_pipeline_name_required//"输入不能为空"
            },{
                validFn:"regularCheck",
                params:"/\\S+/",
                errorDetail:i18n.dps_validate_pipeline_name_no_space//"工作流名不能为空格"
            },{
                validFn:"regularCheck",
                params:"/^([A-Za-z0-9_]+)?$/",
                errorDetail:i18n.dps_validate_pipeline_name_special_char_warning
            }],
            "keydown": function (event) {
            }
        };
        $scope.newStepDescriptionTextBox2 = {
            id: "pipelineDescription",
            "placeholder": i18n.dps_create_new_order_pipelineDescription,
            "maxLength":1024,
            value: defaultDescription,
            type: "multi",
            width: 240,
            height: 100,
            resize:"none",
            "keydown": function (event) {
            }
        };
        //获取region信息
        var param = createOrderConfigService.getRegions();
        if (!$rootScope.selectRegionId) {
            $scope.$on("initDefaultRegion", function () {//in case of basic data of requests in menusCtrl.js not completed
                getRegionsAndProducts();
            })
        } else {
            getRegionsAndProducts();
        }
        function getRegionsAndProducts() {
            param.then(function (data) {
                regionsData = data.regions;
                var regionTem = [];
                for (var i = 0; i < regionsData.length; i++) {
                    if (regionsData[i].regionId == $rootScope.selectRegionId) {//$rootScope.selectRegionId
                        regionTem.push(regionsData[i]);
                    }
                }
                regionsData = regionTem;
                var params = {
                    'regionId': regionsData[0].regionId,
                    'resourceType': 'hws.resource.type.dps'
                };
                var promise = createOrderConfigService.getServices(params);//获取产品信息
                promise.then(function (data) {
                    productsData = data.products;
                    if ($scope.slideFlag) {
                        var orderInfo = storage.get("infoObj");
                        if (orderInfo) {
                            var buyPeroidInfo = commonService.buyPeroidInfo;
                            for (var i = 0; i < buyPeroidInfo.length; i++) {
                                if (orderInfo.buyPeroid == buyPeroidInfo[i].name) {
                                    orderInfo.buyPeroid = buyPeroidInfo[i].buyPeroid;
                                    break;
                                }
                            }
                            setOrderInfo(orderInfo.Duration, orderInfo.buyPeroid, orderInfo.productName, orderInfo.totalPrice);
                        } else {
                            setOrderInfo(buyPeroid, i18n.aMonth, i18n.dps_examineOrder_month, $scope.Fee);
                        }
                    } else {//按钮不可点击的时候滑动滑动条，会先执行$scope.buyDurationSlider.change，再执行getRegions和getServices，导致确认订单显示为默认的一个月
                        var period = $("#buyDurationSlider").widget().option("value");
                        storage.add("period", period);
                        exchangePeriod(period)
                    }
                });
            }, function (data) {
                commonService.netErrorTip(i18n, data);
            });
        }
        $scope.buyDurationSlider = {
            "id" : "buyDurationSlider",
            "width" : 600,
            from : 1,
            to : 12,
            step : 1,
            value : storage.get("period") ? storage.get("period") : "1",
            scale : [1+i18n.monthPeroid,2+i18n.monthsPeroid,3+i18n.monthsPeroid, 4+i18n.monthsPeroid, 5+i18n.monthsPeroid, 6+i18n.monthsPeroid, 7+i18n.monthsPeroid, 8+i18n.monthsPeroid, 9+i18n.monthsPeroid,i18n.oneYear,i18n.twoYears, i18n.threeYears],
            calculate: function( value ){
                var str;
                if(value == 1){
                    var str=i18n.dps_month_period;
                    return  str.replace("{0}",value);
                } else if(value <= 9) {
                    var str=i18n.dps_months_period;
                    return str.replace("{0}",value);
                }else if(value == 10){
                    var str=i18n.dps_year_period_title;
                    var strResult=str.replace("{0}",value);
                    return '<span class="common-color-number">'+strResult.replace("{1}",value-9)+'</span>';
                }else if(value == 11){
                    var str=i18n.dps_year_periods_title;
                    var strResult=str.replace("{0}",20);
                    return '<span class="common-color-number">'+strResult.replace("{1}",value-9)+'</span>';
                }else if(value == 12){
                    var str=i18n.dps_year_periods_title;
                    var strResult=str.replace("{0}",30);
                    return '<span class="common-color-number">'+strResult.replace("{1}",value-9)+'</span>';
                }
            },
            change:function(event, value) {
                var period = $("#buyDurationSlider").widget().option("value");
                storage.add("period",period);
                exchangePeriod(period)
            }
        };
        function exchangePeriod(period){
            var _period;
            if(period == "11"){
                _period = 20;
            }else if(period == "12"){
                _period = 30;
            }else{
                _period = parseInt(period);
            }
            var _fee = _period*85+".00";
            switch(period)
            {
                case "1":
                    setOrderInfo(_period,i18n.aMonth,i18n.dps_examineOrder_month,_fee,true);
                    break;
                case "2":
                    setOrderInfo(_period,i18n.twoMonths,i18n.dps_examineOrder_month,_fee,true);
                    break;
                case "3":
                    setOrderInfo(_period,i18n.threeMonths,i18n.dps_examineOrder_month,_fee,true);
                    break;
                case "4":
                    setOrderInfo(_period,i18n.fourMonths,i18n.dps_examineOrder_month,_fee,true);
                    break;
                case "5":
                    setOrderInfo(_period,i18n.fiveMonths,i18n.dps_examineOrder_month,_fee,true);
                    break;
                case "6":
                    setOrderInfo(_period,i18n.sixMonths,i18n.dps_examineOrder_month,_fee,true);
                    break;
                case "7":
                    setOrderInfo(_period,i18n.sevenMonths,i18n.dps_examineOrder_month,_fee,true);
                    break;
                case "8":
                    setOrderInfo(_period,i18n.eightMonths,i18n.dps_examineOrder_month,_fee,true);
                    break;
                case "9":
                    setOrderInfo(_period,i18n.nineMonths,i18n.dps_examineOrder_month,_fee,true);
                    break;
                case "10":
                    setOrderInfo(_period,i18n.oneYear,i18n.dps_examineOrder_year,_fee,true);
                    break;
                case "11":
                    setOrderInfo(_period,i18n.twoYears,i18n.dps_examineOrder_year,_fee,true);
                    break;
                case "12":
                    setOrderInfo(_period,i18n.threeYears,i18n.dps_examineOrder_year,_fee,true);
                    break;
                default:
                    setOrderInfo(buyPeroid,i18n.aMonth,i18n.dps_examineOrder_month,$scope.Fee);
            }
        }

        function setOrderInfo(buyPeroid,buyPeroidDes,productName,fee,slideflag){
            if(slideflag == true){
                $scope.slideFlag = false;
            }
            $scope.Fee =fee;
            $scope.productName = productName;
            infoObj.Duration = buyPeroid;
            infoObj.buyPeroid = buyPeroidDes;
            infoObj.totalPrice = fee;
            infoObj.BillingType = 1;
            infoObj.RegionId = $rootScope.selectRegionId;

            if(regionsData && productsData){
                for (var i = 0; i < regionsData.length; i++) {
                    infoObj.regionName = regionsData[i].regionName;
                    for (var j = 0; j < regionsData[i].availableZones.length; j++) {
                        infoObj.AvailableZoneName = regionsData[i].availableZones[j].availableZoneName;
                        infoObj.AvailableZoneCode = regionsData[i].availableZones[j].availableZoneCode;
                        infoObj.AvailableZoneId = regionsData[i].availableZones[j].availableZoneId;
                    }
                }
                //英文状态下转换productName
                for(var k=0; k< $scope.productNameInfo.length; k++){
                    if (window.urlParams.lang.toLowerCase() == 'en-us' && $scope.productName == $scope.productNameInfo[k].name) {
                        $scope.productName = $scope.productNameInfo[k].translateName;
                    }
                }

                for (var m = 0; m < productsData.length; m++) {
                    if (productsData[m].productName == $scope.productName) {
                        //处理英文界面下ServiceName没有传到购买页面
                        for(var n=0; n< $scope.productNameInfo.length; n++){
                            if (window.urlParams.lang.toLowerCase() == 'en-us' && $scope.productName == $scope.productNameInfo[n].name) {
                                $scope.productName = $scope.productNameInfo[n].translateName;
                            }
                        }
                        infoObj.productName =$scope.productName;
                        infoObj.productId = productsData[m].productId;
                    }
                }
                //订单数据验证通过后方可点击“立即购买”
                for (var i = 0; i < $scope.checkItem.length; i++) {
                    //需要检查实名认证是否通过
                    if (!$scope.isCertificate && infoObj[$scope.checkItem[i]] != undefined && infoObj[$scope.checkItem[i]] != null){
                        createOrderConfigService.setBuyServiceInfo(infoObj);
                        storage.add("infoObj",infoObj);
                        storage.add("feeInfo",$scope.Fee);
                        $scope.confirmConf.disable = false;
                    }else{
                        $scope.confirmConf.disable = true;
                    }

                }
            }
        }
        //立即购买
        $scope.confirmConf = {
            'id':'confirmConf',
            'disable':true,
            'text' :i18n.dps_general_purchase_btn,
            'click': function () {
                if (tinyWidget.UnifyValid.FormValid($("#CreatePipelineName"))){
                    $rootScope.transferPipelineName=$scope.newStepNameTextBox2.value;
                    $rootScope.transferPipelineDescription=$scope.newStepDescriptionTextBox2.value;
                    storage.add("pipelineNameCookie",$scope.newStepNameTextBox2.value);
                    storage.add("pipelineDescriptionCookie",$scope.newStepDescriptionTextBox2.value);
                    var path = 'createOrder/examineConfigure';
                    $location.path(path);
                    return;
                }
            }
        };
        /*进行实名认证*/
        (function(isSwitch){
            if(isSwitch){
                createOrderConfigService.statusCertification().then(function(data){
                    if(data.isVerified !== true){
                        $scope.isCertificate = true;
                        $scope.confirmConf.disable = true;
                    }else{
                        $scope.isCertificate = false;
                    }

                },function(data){
                    if(data.status === 200){
                        if(data.isVerified !== true){
                            $scope.isCertificate = true;
                            $scope.confirmConf.disable = true;
                        }else{
                            $scope.isCertificate = false;
                        }
                    }else{
                        commonService.showNetError($scope, i18n, data);
                    }
                });
            }
        })(true);
        /*实名认证链接，链接到用户中心*/
        $scope.goCustomerVerified = function(){
            var urlHostName = commonService.urlHostName;
            var hostname;
            for(var i = 0;i < urlHostName.length; i++){
                if(window.location.hostname === urlHostName[i].hostname){
                    hostname = urlHostName[i]._hostnameVerified;
                }
            }
            var customerVerifiedUrl = "https://" + hostname + "/usercenter/#/userindex/realNameAuth";
            var url = commonService.genHWSHref(customerVerifiedUrl);
            commonService.safeOpenURL(url);
        };
    };
    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyController('createOrderConfig.ctrl', createOrderConfigCtrl);
    return dataAccessModule;
});