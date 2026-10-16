/**
 * Created on 14-2-27.
 */
/* global define */
/* global $ */
/* global angular */
/* global _ */
/* global tinyWidget */
define(['bootstrap/bootstrap.min', 'app-remote/framework/localization/config'], function (bootstrap, localizationConfig) {
    "use strict";
    var ctrl = function ($rootScope, frameworkService, globalRegionName, currentService, $sce, $state, $location, storage,$scope) {
  
    	console.log(i18n)
    	console.log($scope.i18n.hightraffic_header)
        var i18nSubRegRex = /\{\s*([^\|\}]+?)\s*(?:\|([^\}]*))?\s*\}/g,
            projectNameRegExp = /^([^_]+)_([^_]+)_(.+)$/;

        $rootScope.i18nReplace = function (s, o) {
            if (!s || !o) {
                return;
            }
            return ((s.replace) ? s.replace(i18nSubRegRex, function (match, key) {
                return (!angular.isUndefined(o[key])) ? o[key] : match;
            }) : s);
        };
        
        $rootScope.widgetsLanguage = window.tinyLanguage.language;
        $rootScope.timeFormat = $rootScope.i18n.dateFormat + ' HH:mm:ss';
        $rootScope.tmpRegions = [];
        $rootScope.regions = [];
        $rootScope.projects = {};
        $rootScope.selectRegionId = '';
        $rootScope.projectName = '';
        $rootScope.displayRegionName = '';
        $rootScope.isVdcRegion = false;
        $rootScope.noticeNum = 0;
        $rootScope.username = '';
        $rootScope.company = '';
        $rootScope.userId = '';
        $rootScope.projectId = '';
        $rootScope.domainId = '';
        $rootScope.userRoles = [];
        $rootScope.isOldUser = false;
        $rootScope.accountBalance = 0;
        $rootScope.accountBalanceDecimal = '.00';
        $rootScope.debitBalance = 0;
        $rootScope.bonusBalance = 0;
        $rootScope.importantMessages = [];
        $rootScope.homeEndpoint = null;
        //已经按类别进行分类处理的endpoints，可直接用于菜单服务列表显示
        $rootScope.serviceEndpoints = [];
        //列表格式的endpoints，未按类别进行分组
        $rootScope.serviceEndpointList = [];
        $rootScope.favoriteEndpoints = [];
        //收藏是否失败标志
        $rootScope.favoriteError = true;

        $rootScope.isLoginUserFlag = true;
        $rootScope.loginUserAccount = {};
        $rootScope.hasAssumeRoleFlag = false;
        $rootScope.assumeRoles = [];
        $rootScope.links = [];
        $rootScope.favoriteServiceMax = 7;
        $rootScope.showBalance = false;
        //是否为分销商子账户
        $rootScope.isVendorSubUser = false;
        //是否分销商
        $rootScope.isVendorUser = false;
        //是否冻结用户
        $rootScope.isSuspendedUser = false;
        //是否实名认证用户
        $rootScope.isVerifiedUser = false;
        $rootScope.endpointInitFlag = false;
        $rootScope.elementDisplayFlag = true;
        $rootScope.regionDisplayFlag = true;
        $rootScope.globalRegionName = globalRegionName;
        $rootScope.currentService = currentService;
        $rootScope.bussinessConsoleList = ['authCenter', 'marketplace', 'userCenter'];
        $rootScope.isServiceConsole = $.inArray($rootScope.currentService, $rootScope.bussinessConsoleList) < 0;
        $rootScope.currentServiceName = $rootScope.i18n['console_term_' + $rootScope.currentService + '_label'];
        $rootScope.logoutUrl = window.appWebPath + '/logout';
        $rootScope.lastState = "";
        $rootScope.canAssumeRole = localizationConfig.canAssumeRole;
        $rootScope.console_term_copyright_label = $sce.trustAsHtml($rootScope.i18n.console_term_copyright_label);

        $rootScope.user_head_href = {
            "url": 'theme/default/images/user-head.png'
        };

        $rootScope.user_head_all = {};

        $rootScope.my_quota_link = $rootScope.i18n.console_term_consoleHome_link + "#/quota";

        $rootScope.nonsupportRegions = [];
        $rootScope.regionHighlightColor = ['#82b1ff', '#ea80fc', '#85f2a3', '#b388ff', '#80d8ff', '#39e749', '#5ff7d4', '#ff6e40' ,'#ffd180', '#ff9e80', '#ff8a80', '#ffff8d'];

        $rootScope.displayMenuElements = function (flag) {
            $rootScope.regionDisplayFlag = flag;
        };

        $rootScope.displayMenusWithOutRegion = function (flag) {
        };

        $rootScope.logout = function() {
            storage.flush();
            window.location.href =  $rootScope.logoutUrl;
        };

        function initUserHead() {
            frameworkService.queryIamUser($rootScope.userId).then(function (data) {
                if (data) {
                    if (data.user && data.user.img_path) {
                        $rootScope.user_head_all = data.user.img_path;
                        if (data.user.img_path.small) {
                            $rootScope.user_head_href.url = data.user.img_path.small;
                        }
                    }
                }
            });
        }

        //初始化region 代码表
        var promiseRegion = frameworkService.queryRegions();

        function initRegions() {
            promiseRegion.then(function (data) {
                if (!data || !data.regions) {
                    return;
                }
                $rootScope.tmpRegions = data.regions;
            });
        }

        var genTipPosition = function (index) {
            var innerWidth = window.innerWidth,
                numOfCols;

            if (innerWidth < 1440) {
                numOfCols = 3;
            } else if (innerWidth < 1680) {
                numOfCols = 4;
            } else if (innerWidth < 1920) {
                numOfCols = 5;
            } else {
                numOfCols = 6;
            }

            return index % numOfCols === numOfCols - 1 ? 'bottom-left' : 'bottom-right';
        },
        $window = $(window);

        $rootScope.genFavTipOptions = function () {
            var index = this.$index,
            favTipOptions = this.favTipOptions = {
                collect: {
                    content: $rootScope.i18n.console_term_collect_tip,
                    width: 300,
                    containerStyle: "frame-dropdown-tinyTip",
                    position: genTipPosition(index)
                },
                cancel: {
                    content: $rootScope.i18n.console_term_unCollect_tip,
                    width: 300,
                    containerStyle: "frame-dropdown-tinyTip",
                    position: genTipPosition(index)
                }
            };

            $window.resize(function () {
                $rootScope.$apply(function () {
                    favTipOptions.collect.position = favTipOptions.cancel.position = genTipPosition(index);
                });
            });
        };

        $rootScope.oldTips = {
            "tooltip": {
                content: $rootScope.i18n.console_term_oldConsoleTips_label,
                width: 180,
                containerStyle: "frame-dropdown-tinyTip old-console-tips",
                position: "bottom"
            }
        };

        $rootScope.helpTips = {
            "tooltip": {
                content: $rootScope.i18n.console_term_helpcenter_label,
                width: 100,
                containerStyle: "frame-dropdown-tinyTip frame-helpcenter-tips",
                position: "bottom"
            }
        };

        $rootScope.i18n.console_term_collectTip_valid = $sce.trustAsHtml($rootScope.i18nReplace($rootScope.i18n.console_term_collectTip_valid,
            {
                "1": $rootScope.favoriteServiceMax,
                "2": '<span class="hwsicon-frame-image-favorite-true menu-hwsicon-frame-service-favorite-tip"></span>'
            }));

        //页面数据初始化
        pageInit();
        function pageInit() {
            initAllUserInfo();
            initRegions();
            //初始化消息列表
            importantMessage();
            //初始化页面的超链接信息
            initAllLinks();
        }

        //初始化所有与用户相关的信息,切换用户时需重新获取
        function initAllUserInfo() {
            initUserInfo();
        }

        //初始化链接信息
        function initAllLinks() {
            frameworkService.getLinks().then(function (data) {
                if (data && data.links) {
                    var links = {};
                    var key = '';
                    for (var index = 0; index < data.links.length; index++) {
                        key = data.links[index].key + '_' + data.links[index].type;
                        links[key] = data.links[index].href;
                    }
                    $rootScope.links = links;
                }
            });
        }

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                if (toState.name !== "nonsupportRegion") {
                    if ($rootScope.nonsupportRegions && $rootScope.isNonsupportRegion($rootScope.nonsupportRegions, $rootScope.projectName)) {
                        $rootScope.lastState = toState;
                        event.preventDefault();
                    }
                }
            });

        //用户数据及依赖用户数据的endpoints相关数据初始化
        function initUserInfo() {
            var promiseUser = frameworkService.getLoginUser();

            promiseUser.then(function (data) {
                $rootScope.userId = data.id;
                $rootScope.username = data.name;
                $rootScope.projectId = data.projectId;
                $rootScope.projectName = data.region;
                $rootScope.userRoles = data.roles;
                if (data.nonsupportRegions) {
                    $rootScope.nonsupportRegions = data.nonsupportRegions;
                }

                if ($rootScope.nonsupportRegions && $rootScope.isNonsupportRegion($rootScope.nonsupportRegions, $rootScope.projectName)) {
                    $rootScope.lastState = $state.current;
                    if ($rootScope.lastState.name !== "nonsupportRegion") {
                        $state.go("nonsupportRegion");
                    }
                }
                if ($.inArray('op_vendor_sub_user', data.roles) >= 0) {
                    $rootScope.isVendorSubUser = true;
                    $rootScope.isVendorUser = true;
                }
                if ($.inArray('op_vendor', data.roles) >= 0) {
                    $rootScope.isVendorUser = true;
                }

                //判断是否为冻结用户，导航栏顶部出现提示
                if ($.inArray('op_suspended', data.roles) >= 0) {
                    $rootScope.isSuspendedUser = true;
                }

                if ($.inArray('op_legacy', data.roles) >= 0 && localizationConfig.isOldUser) {
                    $rootScope.isOldUser = true;
                }
                
                if ($.inArray('op_gated_pc_vendor_subuser', data.roles) >= 0) {
                    $rootScope.isPcVendorSubuser = true;
                } else {
                    $rootScope.isPcVendorSubuser = false;
                }

                $rootScope.domainId = data.domainId;
                initUserHead();
                initUserBalance();
                $rootScope.$broadcast("initUser");
                promiseRegion.then(function () {
                    initUserProjects();
                });
                initDefaultRegion();
                getAssumeRoles();
                return frameworkService.queryEndpoints({"region": $rootScope.projectName});
            }).then(function (data) {
                dealAllEndpoints(data);
                return getFavoriteEndpoints();
            }).then(function (data) {
                dealFavoriteEndpoints(data);
                beautifierEndpoints();
            });
        }

        function initUserBalance() {
            frameworkService.queryAccountSum().then(function (data) {
                if (!data) {
                    return;
                }
                //账户余额
                var accountBalance = !$.isNumeric(data.sumAmount) ? 0 : data.sumAmount;
                accountBalance = accountBalance.toFixed(2);
                $rootScope.accountBalanceDecimal = getDecimal(accountBalance);
                $rootScope.accountBalance = parseInt(accountBalance,10);
                //信用账户
                $rootScope.debitBalance = !$.isNumeric(data.debitAmount) ? 0 : data.debitAmount;
                //奖励账户
                $rootScope.bonusBalance = !$.isNumeric(data.bonusAmount) ? 0 : data.bonusAmount;
                $rootScope.showBalance = true;
            }, function(data) {
                $rootScope.showBalance = false;
            });
        }

        function getDecimal(number) {
            var result = '.00';
            if ($.isNumeric(number) && number > 0) {
                var tmpResult = (number - parseInt(number,10)).toFixed(2);
                if (tmpResult > 0) {
                    result = ('' + tmpResult).substr(1, 3);
                    if (result.length < 3) {
                        result = result + '0';
                    }
                }
            }

            return result;
        }

        //通过projectName获取选中后展示的regionName
        //多project projectName 的格式为 <prefix>_<regionId>_<projectName>,展示格式为 regionName(projectName)  中国华东(DeC001)
        function getDisplayRegionName(regionId) {
            if (regionId && projectNameRegExp.test(regionId)) {
                var projectElms = regionId.match(projectNameRegExp);
                if (regionId.indexOf('DeC') === 0) {
                    $rootScope.isVdcRegion = true;
                }
                return getRegionNameById(projectElms[2]) + '(' + projectElms[3] + ')';
            }
            return getRegionNameById(regionId);
        }

        //初始化默认region，支持页面重写选择后在各console传递，该方法需要在region列表取得后调用
        function initDefaultRegion() {
            //判断是否为全局服务
            if (globalRegionName + '' === '') {
                if ($rootScope.regions.length > 0 && $rootScope.projectName !== '') {
                    $rootScope.selectRegionId = getProjectRegionId($rootScope.projectName);
                    $rootScope.displayRegionName = getDisplayRegionName($rootScope.projectName);
                    $rootScope.$broadcast("initDefaultRegion");
                }
            } else {
                $rootScope.selectRegionId = getProjectRegionId($rootScope.projectName);
                $rootScope.displayRegionName = globalRegionName;
                $rootScope.$broadcast("initDefaultRegion");
            }
        }

        function getRegionNameById(regionId) {
            var index;
            for (index in $rootScope.regions) {
                if (regionId === $rootScope.regions[index].id) {
                    $rootScope.regionColorIndex = index;
                    return $rootScope.regions[index].name;
                }
            }

            return '';
        }

        function getProjectRegionId(projectName) {
            if (projectName && projectNameRegExp.test(projectName)) {
                return projectName.match(projectNameRegExp)[2];
            }

            return projectName;
        }

        //从IAM获取用户的project列表，作为用户的region下拉列表
        function initUserProjects() {
            var options = {
                'domain_id': $rootScope.domainId,
                'userId': $rootScope.userId
            };
            frameworkService.getUserProjects(options).then(function (data) {
                if (data && data.projects) {
                    genProjectList(data.projects);
                }
            }, function (data) {
                genProjectList(null);
            });
        }

        function genProjectList(sProjects) {
            var index,
                projects = {};

            if (sProjects) {
                for (index = 0; index < sProjects.length; index++) {
                    if (sProjects[index] && sProjects[index].name && projectNameRegExp.test(sProjects[index].name)) {
                        var projectElms = sProjects[index].name.match(projectNameRegExp);

                        projects[projectElms[2]] = projects[projectElms[2]] || [];
                        projects[projectElms[2]].push(
                            {
                                'id': sProjects[index].name,
                                'name': sProjects[index].name,
                                'displayName': projectElms[3],
                                'disable': $rootScope.isNonsupportRegion($rootScope.nonsupportRegions, sProjects[index].name)
                            }
                        );
                    }
                }
            }

            var regions = $rootScope.tmpRegions;

            for (index = 0; index < regions.length; index++) {
                regions[index].projects = projects[regions[index].id];
                if ($rootScope.nonsupportRegions && $rootScope.isNonsupportRegion($rootScope.nonsupportRegions, regions[index].id)) {
                    regions[index].disable = true;
                } else {
                    regions[index].disable = false;
                }
            }

            $rootScope.regions = regions;
            initDefaultRegion();
        }

        function getFavoriteEndpoints() {
            var options = {
                'user_id': $rootScope.userId
            };
            return frameworkService.favoriteEndpoints(options);
        }


        function dealAllEndpoints(data) {
            if (!data || !data.endpoints) {
                return;
            }
            var endpoints = data.endpoints;
            var tmpEndpoints = [];
            var endpoint;

            for (var item = 0; item < endpoints.length; item++) {
                endpoint = endpoints[item];
                if (endpoint.id === window.global_endpoint_id) {
                    $rootScope.endpointName = endpoint.name;
                }
                if (endpoint.id === "home") {
                    $rootScope.homeEndpoint = endpoint;
                } else {
                    tmpEndpoints.push(endpoint);
                }
            }
            $rootScope.serviceEndpointList = tmpEndpoints;
        }

        function dealFavoriteEndpoints(data) {
            if (!data || !data.endpointCollects) {
                return;
            }
            var length = data.endpointCollects.length;
            var result = [];

            for (var i = 0; i < $rootScope.favoriteServiceMax && i < length; i++) {
                data.endpointCollects[i].tooltip = {
                    content: $.encoder.encodeForHTML(data.endpointCollects[i].shortName),
                    containerStyle: "frame-dropdown-tinyTip",
                    position: "bottom-right",
                    width: 200
                };
                data.endpointCollects[i].tipsElementId = 'frameFavoriteEndpointId' + data.endpointCollects[i].endpointId + i;
                result.push(data.endpointCollects[i]);
            }

            $rootScope.favoriteEndpoints = result;

            $rootScope.console_term_clickhere_tips = $sce.trustAsHtml($rootScope.i18nReplace($rootScope.i18n.console_term_clickhere_tips,
                {
                    "1": '<span class="hwsicon-frame-image-favorite-false menu-hwsicon-frame-service-favorite-tip"></span>',
                    "2": $rootScope.favoriteServiceMax - $rootScope.favoriteEndpoints.length
                }));

        }

        var favoriteEndpointTips = new tinyWidget.Tip({
            containerStyle: "frame-dropdown-tinyTip",
            position: "bottom-right",
            width: 200
        });
        $rootScope.favoriteEndpointMouseEnter = function (content, elementId) {
            favoriteEndpointTips.option('content', $.encoder.encodeForHTML(content));
            favoriteEndpointTips.option('element', $('#' + elementId));
            favoriteEndpointTips.show();
        };

        $rootScope.favoriteEndpointMouseLeave = function () {
            favoriteEndpointTips.hide();
        };

        function beautifierEndpoints(flag) {
            var endpoints = $rootScope.serviceEndpointList;
            if (!endpoints) {
                return [];
            }
            var catalogs = {};
            var endpoint;
            var catalog;
            for (var item = 0; item < endpoints.length; item++) {
                //根据类别分类
                endpoint = endpoints[item];
                catalog = $.trim(endpoint.catalog);
                endpoint.isFavorite = isFavoriteEndpoint(endpoint);
                catalogs[catalog] = catalogs[catalog] || [];
                catalogs[catalog].push(endpoint);
            }

            var result = [];
            var index;
            for (index in catalogs) {
                if (catalogs.hasOwnProperty(index)) {
                    result.push({
                        catalog: index,
                        endpoints: catalogs[index]
                    });
                }
            }
            $rootScope.serviceEndpoints = result;
            if (!flag) {
                $rootScope.endpointInitFlag = true;
            }
        }


        function isFavoriteEndpoint(endpoint) {
            if ($rootScope.favoriteEndpoints) {
                for (var index = 0; index < $rootScope.favoriteEndpoints.length; index++) {
                    if (endpoint.id === $rootScope.favoriteEndpoints[index].endpointId) {
                        $rootScope.favoriteEndpoints[index].serviceCss = endpoint.serviceCss;
                        return true;
                    }
                }
            }

            return false;
        }

        function importantMessage() {
            if (!localizationConfig.getMessageFlag) {
                return;
            }
            var promise = frameworkService.getMessages();
            promise.then(function (data) {
                if (!data || !data.messages) {
                    return;
                }
                $rootScope.importantMessages = data.messages;
                $rootScope.noticeNum = data.total;
            });
        }

        $rootScope.favorite = function (endpointId, isFavorite) {
            $rootScope.favoriteError = false;
            if (isFavorite && $rootScope.favoriteEndpoints.length >= $rootScope.favoriteServiceMax) {
                $rootScope.favoriteError = true;
                return;
            }
            var options = {
                'user_id': $rootScope.userId,
                'id': endpointId
            };
            var promise;
            if (isFavorite) {
                promise = frameworkService.addFavoriteEndpoint(options);
            } else {
                promise = frameworkService.deleteFavoriteEndpoint(options);
            }
            promise.then(function () {
                $rootScope.favoriteError = false;
                //重新获取收藏的服务
                return getFavoriteEndpoints();
            }, function (data) {
                if (data && data.status === 400 && data.responseText) {
                    var result = JSON.parse(data.responseText);
                    if (result && result.code === '0000010002') {
                        $rootScope.favoriteError = true;
                    }
                }
            }).then(function (data) {
                dealFavoriteEndpoints(data);
                beautifierEndpoints(true);
            });

        };

        $rootScope.isNonsupportRegion = function (nonsupportRegions, regionId) {
            var result = false;
            //如果是多project
            if (regionId && projectNameRegExp.test(regionId)) {
                for (var i = 0; i < nonsupportRegions.length; i++) {
                    if (nonsupportRegions[i] && regionId.indexOf(nonsupportRegions[i]) === 0) {
                        result = true;
                        break;
                    }
                }
            } else {
                result = nonsupportRegions.indexOf(regionId) >= 0;
            }

            return result;
        };

        $rootScope.changeRegion = function (projectName) {
            if ($rootScope.isNonsupportRegion($rootScope.nonsupportRegions, projectName)) {
                return;
            }
            frameworkService.changeRegion({"project": projectName}).then(function () {
                //删除URL中的agencyId和regionName并刷新窗口以获取最新token
                var href = $rootScope.delUrlParameter(window.location.href, 'agencyId');
                href = $rootScope.delUrlParameter(href, 'region');
                $rootScope.projectName = projectName;
                if ($state.current.name === 'nonsupportRegion' || $state.current.name === 'beingMaintained' ||
                    $state.current.name === 'accessDeclined') {
                    window.location.href = href.replace('#' + $location.url(), '');
                } else {
                    if (href === window.location.href) {
                        window.location.reload();
                    } else {
                        window.location.href = href;
                    }
                }
            });
        };

        $rootScope.$watch('userId', function (newVal, oldVal) {
            if (newVal && (newVal + '') !== '' && (newVal + '') !== (oldVal + '')) {
                initMessageTypes();
            }
        });

        var choiceMessageType = "frameworkMessageType";

        function initMessageTypes() {
            if (!localizationConfig.getMessageFlag) {
                return;
            }
            var options = {
                "userId": $rootScope.userId,
                "type": choiceMessageType
            };
            frameworkService.getUserChoices(options).then(function (choices) {
                var promise = frameworkService.getMessagesTypes();
                promise.then(function (types) {
                    dealMessageTypes(choices, types);
                });
            });
        }

        function dealMessageTypes(choices, types) {
            var values = [];
            var keys = [];
            for (var index = 0; index < types.length; index++) {
                values.push({
                    "key": types[index].key,
                    "text": types[index].text,
                    "checked": isChoiceMessageType(types[index].key, choices)
                });
                keys.push(types[index].key);
            }

            $rootScope.messageTypeKeys = keys;
            $rootScope.messageTypes = {
                "id": "messageTypes",
                "values": values,
                "change": function () {
                    var checkedArray = $("#messageTypes").widget().opChecked("checked");
                    var unChecked = [];
                    for (var index = 0; index < $rootScope.messageTypeKeys.length; index++) {
                        if (!_.contains(checkedArray, $rootScope.messageTypeKeys[index])) {
                            unChecked.push($rootScope.messageTypeKeys[index]);
                        }
                    }
                    //记录用户选择
                    var options = {
                        "userId": $rootScope.userId,
                        "type": choiceMessageType,
                        "value": unChecked.join(','),
                        "preferDesc": ''
                    };
                    frameworkService.updateUserChoices(options);
                    //更新数据
                    importantMessage();
                }
            };

            importantMessage();
        }

        function isChoiceMessageType(key, choices) {
            if (choices && choices.preferences &&
                choices.preferences[0] && choices.preferences[0].preferDisplayName) {
                var choiceArr = choices.preferences[0].preferDisplayName.split(',');
                return !_.contains(choiceArr, key);
            }

            return true;
        }

        function getAssumeRoles() {
            var options = {
                "userId": $rootScope.userId,
                "limit": $rootScope.limit
            };
            frameworkService.getAssumeRoles(options).then(function (data) {
                if (data) {
                    if (data.account && data.account.id && data.account.id !== $rootScope.userId) {
                        $rootScope.isLoginUserFlag = false;
                        $rootScope.hasAssumeRoleFlag = true;
                        $rootScope.loginUserAccount = data.account;
                        var tmpIndex = $rootScope.username.indexOf('/');
                        if (tmpIndex > 0) {
                            $rootScope.company = $rootScope.username.substring(tmpIndex + 1);
                            $rootScope.shortName = $rootScope.username.substring(0, tmpIndex);
                        }
                    } else {
                        $rootScope.isLoginUserFlag = true;
                        $rootScope.hasAssumeRoleFlag = false;
                    }

                    if (data.xrole_history && data.xrole_history.length > 0) {
                        $rootScope.assumeRoles = data.xrole_history;
                        $rootScope.hasAssumeRoleFlag = true;
                    }
                } else {
                    $rootScope.assumeRoles = [];
                    $rootScope.hasAssumeRoleFlag = false;
                }
            });
        }

        $rootScope.assumeRole = function (agencyId) {
            if (agencyId) {
                var options = {
                    "agencyId": agencyId
                };
                frameworkService.assumeRole(options).then(function () {
                    //删除URL中的agencyId和region并刷新窗口以获取最新token
                    var href = $rootScope.delUrlParameter(window.location.href, 'agencyId');
                    href = $rootScope.delUrlParameter(href, 'region');
                    if (href === window.location.href) {
                        window.location.reload();
                    } else {
                        window.location.href = href;
                    }
                });
            }
        };

        $rootScope.assumeRoleToIAM = function () {
            if ($rootScope.links.assume_role_iam + '' === '') {
                return;
            }
            //删除URL中的agencyId和region以便IAM跳回时获取最新token
            var href = $rootScope.delUrlParameter(window.location.href, 'agencyId');
            href = $rootScope.delUrlParameter(href, 'region');

            var iamHref = $rootScope.addOrReplaceUrlParameter(
                $rootScope.links.assume_role_iam, 'callbackurl', encodeURIComponent(href));

            window.location.href = $rootScope.genHWSHref(iamHref);
        };

        $rootScope.goHome = function () {
            if ($rootScope.isServiceConsole) {
                window.location.href = $rootScope.genHWSHref($rootScope.homeEndpoint.endpoint);
            } else {
                window.location.href = $rootScope.genHWSHref($rootScope.links.console_common, 'locale');
            }
        };


        if(storage.get('framework_tips_new_msg' + storage.cookieStorage.getItem('agencyID'))) {
            if($('.frame-message-round')) {
                $('.frame-message-round').css('display', 'block');
            }
        }

        $rootScope.showTipsMsg = function (page) {
            storage.add('framework_tips_new_msg' + storage.cookieStorage.getItem('agencyID'), false);
            $('.frame-message-round').css('display', 'none');
            page = page < 1 ? 1 : page;
            var tipsMessages = storage.get('framework_tips_msg' + storage.cookieStorage.getItem('agencyID'));
            tipsMessages = tipsMessages ? tipsMessages : [];
            var total = Math.ceil(tipsMessages.length / 10);
            $rootScope.tipsMessagesTotal = total === 0 ? 1 : total;
            page = page > $rootScope.tipsMessagesTotal ? $rootScope.tipsMessagesTotal : page;
            if (page === 1) {
                $('.hwsicon-frame-image-pre-page').addClass('disabled');
            } else {
                $('.hwsicon-frame-image-pre-page').removeClass('disabled');
            }
            if (page === $rootScope.tipsMessagesTotal) {
                $('.hwsicon-frame-image-next-page').addClass('disabled');
            } else {
                $('.hwsicon-frame-image-next-page').removeClass('disabled');
            }
            $rootScope.tipsMessagesCurrent = page;
            $rootScope.tipsMessages = tipsMessages.slice((page - 1) * 10, 10 * page);
        };

        $rootScope.clearTipsMsg = function () {
            storage.add('framework_tips_msg' + storage.cookieStorage.getItem('agencyID'), []);
            $rootScope.showTipsMsg(1);
        };

        $rootScope.recharge = function () {
            window.open($rootScope.genHWSHref($rootScope.links.recharge_userCenter));
        };
        
         

    };


    ctrl.$injector = ["$rootScope", "frameworkService", "globalRegionName", "currentService", "$state", "$location"];
    return ctrl;
});
