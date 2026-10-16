define(['language/dataAccess','src/app/common/commonInfo'],
    function(i18n, commonInfo) {
        "use strict";

        var examineConfigureCtrl = function ($rootScope, $scope, $state, $stateParams, $compile, mask, commonService,  createOrderConfigService, camel, storage) {
            $scope.i18n = i18n;
            $rootScope.step={curStep:2};//标示当前创建订购服务执行到的步骤
            var configInfos = {};
            var configInfosData = createOrderConfigService.getBuyServiceInfo().isObject ? createOrderConfigService.getBuyServiceInfo() : storage.get("infoObj");
            if(configInfosData){
                var produceNameInfo = commonService.produceNameInfo;
                var buyPeroidInfo = commonService.buyPeroidInfo;
                for(var i=0; i<produceNameInfo.length; i++){
                    if(configInfosData.productName == produceNameInfo[i].name){
                        if(window.urlParams.lang == "en-us"){
                            configInfos.productName = produceNameInfo[i].productName;
                        }else{
                            configInfos.productName = produceNameInfo[i].productName.substring(0,produceNameInfo[i].productName.length-4);
                        }
                        break;
                    }
                }
                for(var j=0; j<buyPeroidInfo.length; j++){
                    if(configInfosData.buyPeroid == buyPeroidInfo[j].name){
                        configInfos.buyPeroid = buyPeroidInfo[j].buyPeroid;
                        break;
                    }
                }
                $.extend(true,configInfosData,configInfos);
            }/*else{
                commonService.failTip(i18n.dps_pipeline_te_admin);
                $state.go("manage.pipelineList");
            }*/
            $scope.isRead = true;
            $scope.Fee = configInfosData.totalPrice;
            var chargingMode;
            if(configInfosData.Duration<10){
                chargingMode=i18n.dps_examineOrder_byMonth;
            }else{
                chargingMode=i18n.dps_examineOrder_byYear;
            }
            var infoData = [{
                'serviceName' : i18n.dps_title_service,
                'configure' :'',
                'buyPeroid':configInfosData.buyPeroid,
                'perPrice':i18n.dps_examineOrder_perPrice,
                'totalprice' : configInfosData.totalPrice
            }];

            $scope.configInfo = {
                "id":"directivetableId",
                "data" : infoData,
                "enablePagination" :false,
                "tableLanguage": {
                    "sEmptyTable": i18n.dps_table_no_data_show
                },
                "columns" : [{
                    "sTitle" : i18n.dps_examine_order_service_name,//"serviceName",
                    "sWidth":"15%",
                    "mData":"serviceName",
                    "bSortable":false
                }, {
                    "sTitle" : i18n.dps_examine_order_configure,//"Specifications",
                    "sWidth":"30%",
                    "mData":"configure",
                    "bSortable":false
                },{
                    "sTitle" : i18n.dps_examine_order_table_duration,//"Validity Period",
                    "sWidth":"20%",
                    "mData":"buyPeroid",
                    "bSortable":false
                },{
                    "sTitle" : i18n.dps_examine_per_price,//"Unit price",
                    "sWidth":"20%",
                    "mData":"perPrice",
                    "bSortable":false
                }, {
                    "sTitle" : i18n.dps_examine_order_price,//"price",
                    "sWidth":"15%",
                    "mData":"totalprice",
                    "bSortable":false
                }],
                "changeSelect": function(evtObj) {
                },
                "callback": function(evtObj) {
                },
                "renderRow" : function(nRow, aData, iDataIndex){
                    //订单信息
                    if(window.urlParams.lang == "en-us"){
                        if(configInfosData.regionName=="中国华北"){
                            configInfosData.regionName="northchina";
                        }else if(configInfosData.regionName=="中国华南"){
                            configInfosData.regionName="southchina";
                        }else if(configInfosData.regionName=="中国华东"){
                            configInfosData.regionName="eastchina";
                        }else{
                            configInfosData.regionName="cn-xian-1";
                        }
                    }
                    var infoDiv = "<div><p>"+i18n.dps_examine_order_region_servie +configInfosData.regionName +"</p></div>"+
                                  "<div><p>"+i18n.dps_pipeline_billingType +chargingMode+"</p></div>";
                    var infoLink = $compile(infoDiv);
                    var infoScope = $scope.$new();
                    var infoNode = infoLink(infoScope);
                    $("td:eq(1)", nRow).html(infoNode);
                    //价格
                    var priceInfo="<div class='common-color-number order-price-strong'><p>"+i18n.dps_create_order_fee_unit +configInfosData.totalPrice +"</p></div>";
                    var priceLink = $compile(priceInfo);
                    var priceScope = $scope.$new();
                    var priceNode = priceLink(priceScope);
                    $("td:eq(4)", nRow).html(priceNode);
                }
            };
            //click the checkbox can submit
            var check = new tinyWidget.Checkbox({
                "id" : "isKownRule",
                "text" : i18n.dps_examine_order_accept_agreement,
                "change" : function(){
                    $scope.isRead = !$scope.isRead;
                    $("#confirmBuy").widget().option('disable', $scope.isRead);//modity confirm button's status
                    $scope.$apply();
                }
            });
            //previous
            $scope.preStep = {
                "id" : "preStep",
                "text" : i18n.dps_examine_order_pre_step, //初始数据为空
                "click" : function(){
                    $state.go("createOrder.createOrderConfig");
                }
            };

            function getOrderInof(orderID){
                var url = 'rest/api/v1/datacraft/orders/' + orderID;
                var promise = camel.get({
                    url: url,
                    params:'',
                    timeout: 50000
                });
                return promise;
            }
            $scope.serviceAgreement = function(){
                var url = $scope.genHWSHref(commonInfo.dpsServiceAgreementPage);
                var dpsServiceAgreementPage = open(url);
                dpsServiceAgreementPage.opener = null;
            };
            //协议
            /*$scope.showAgreement=function(){
                var options={
                    title:i18n.dps_window_service_protocol,
                    width:"600px",
                    height:"600px",
                    content:"<p>"+i18n.dps_agreement+"</p>",
                    buttons:[{
                        key: "btnOK",
                        label: 'OK',
                        focused: true,
                        handler : function(event){
                            win.destroy();
                        }
                    }]
                };
                var win = new tinyWidget.Window(options);
                win.show();
            };*/


            $scope.confirmBuy = {
                "id" : "confirmBuy",
                "text" : i18n.dps_examine_order_submit_order, //初始数据为空
                "disable" : $scope.isRead,
                "click" : function(){
                    $scope.isRead = !$scope.isRead;
                    $("#confirmBuy").widget().option('disable', $scope.isRead);
                    var params = {};
                    params.billingType = "1";
                    params.availableZoneId = configInfosData.AvailableZoneId;
                    params.availableZoneName = configInfosData.AvailableZoneName;
                    params.availableZoneCode = configInfosData.AvailableZoneCode;
                    params.productId = configInfosData.productId;
                    params.regionId = configInfosData.RegionId;
                    params.duration = configInfosData.Duration;
                    params.pipelineName = $rootScope.transferPipelineName;
                    params.pipelineDescription = $rootScope.transferPipelineDescription;
                    var promise = createOrderConfigService.postOrder(params);
                    promise.then(function(data){
                        var orderId = data.orderId;
                        var orderInofPromise = getOrderInof(orderId);
                        orderInofPromise.then(function(data){
                            var order = data.orders[0];
                            var baseUrl = "http://support.hwclouds.com/";
                            var helpPagePath;
                            var locallang =window.urlParams.lang.toLowerCase();

                            if(locallang == "en-us"){
                                var baseLocal = "en-us/";
                                helpPagePath=baseUrl+baseLocal+"usermanual-dps/";
                            } else {
                                var baseLocal = "";
                                helpPagePath=baseUrl+baseLocal+"usermanual-dps/";
                            }
                            var helpCreateClusterPageUrl = helpPagePath + locallang + "_topic_0032989643.html";
                            var subjectContent = encodeURIComponent(i18n.dps_title_service);
                            var paramsStrUri = "orderId=" + order.orderId + "&orderAmount=" + order.currency + "&subject=" + subjectContent + "&serviceURL=" + helpCreateClusterPageUrl;
                            var urlHostName = commonService.urlHostName;
                            var hostname;
                            for(var i = 0;i < urlHostName.length; i++){
                                if(window.location.hostname === urlHostName[i].hostname){
                                    hostname = urlHostName[i]._hostnamePay;
                                }
                            }
                            var userCenterUri = "https://"+hostname + "/usercenter/#/servicePay";
                            var url = commonService.genHWSHref(userCenterUri + "?" + paramsStrUri);
                            /*window.location.href = url;*/
                            commonService.safeOpenURL(url);
                            setTimeout(function(){
                                $state.go("manage.pipelineList");
                            },3000);
                        });
                    },function(data){
                        commonService.netErrorTip(i18n,  data);
                        setTimeout(function(){
                            $state.go("manage.pipelineList");
                        },3000);
                    });
                }
            };

        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('examineConfigure.ctrl', examineConfigureCtrl);
        return dataAccessModule;
    });