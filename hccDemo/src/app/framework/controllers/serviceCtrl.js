/**
 * 框架Controller， 设置服务菜单的视图控制逻辑
 * Created on 13-12-25.
 */
/* global define */
/* global $ */
/* global angular */
define(['language-remote/framework', 'app-remote/framework/localization/config'], function (i18n, localization) {
    "use strict";

    var ctrl = function ($rootScope, $state, $stateParams, mask, storage) {

        $rootScope.supportLanguage = [["en-us", "English"], ["zh-cn", "中文(简体)"]];

        $rootScope.i18n = i18n;
        $rootScope.language = window.urlParams.lang;
        $rootScope.languageName = getLanguageName($rootScope.language, $rootScope.supportLanguage);
        $rootScope.offsets = {
            leftMenuWidth: 240
        };

        mask.pageInitShow();

        $rootScope.menus = {
            url: "src/app/framework/views/menus.html?v=" + Date.now()
        };
        $rootScope.footer = {
            url: "src/app/framework/views/footer.html"
        };

        $rootScope.changeLanguage = function (language) {
            window.location.href = $rootScope.addOrReplaceUrlParameter(window.location.href, 'locale', language);
        };

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        //通过点击事件关闭错误提示
        $rootScope.closeMenusFavoriteError = function () {
            $rootScope.favoriteError = false;
        };

        //动态设置中间层高度
        angular.element(window).bind("resize", function () {
            setContentMinHeight();
        });

        $rootScope.$on('$viewContentLoaded', function () {
            mask.pageInitHide();
        });

        $rootScope.$on('$includeContentLoaded', function (event, target) {
            if (target === $rootScope.menus.url) {
                if (storage.cookieStorage.getItem("browserCheckResult") === "B" &&
                    storage.cookieStorage.getItem("browserCheckClose") !== "true") {
                    showBrowserTips();
                    angular.element(document).injector().invoke(function ($compile) {
                        var scope = $("#frame-os-check").scope();
                        $compile($("#frame-os-check"))(scope);
                        scope.$evalAsync();
                    });
                }
            }
        });

        var setMenuTop = function (offset) {
            var $serviceMenus = $('#service-menus');
            $rootScope.offsets.headerHeight = offset + $serviceMenus.height();
            $serviceMenus.css('top', offset);
            $('.console-menu-nav-list-wrapper').css('border-top-width', $rootScope.offsets.headerHeight);
        };

        function showBrowserTips() {
            var messageTemplate = $('<div id="frame-os-check">                                                                                         ' +
            '    <span class="frame-os-check-hint-display common-font-size-big1">                                                                       ' +
            '    <span class="frame-os-check-tips-icon hwsicon-frame-image-tip"></span>                                             ' +
            '    <span class="frame-os-check-tips" ng-bind="i18n.console_term_tipInfo_label"></span> ' +
            '    <span class="frame-os-check-link-info">                                                                             ' +
            '    <a ng-if="i18n.console_term_learnMore_link" ng-href="{{i18n.console_term_learnMore_link}}"                ' +
            'class="learn-more-link-info" ng-bind="i18n.console_term_learnMore_label" target="_blank">' +
            '    </a>                                                                                                      ' +
            '    </span>                                                                                                   ' +
            '    <a class="frame-os-check-close-icon hwsicon-frame-image-close" ng-click="tipInfoClose()">                                ' +
            '    </a>                                                                                                      ' +
            '    </span>                                                                                                   ' +
            '</div>                                                                                                        ');

            messageTemplate.prependTo($(document.body));
            setMenuTop(62);
            if (localization.x_domain_type !== 'TSI') {
                $('#service-content').css('padding-top', '122px');
                $('.framework-scrolling').css('top', '122px');
            } else {
                $('#service-content').css('padding-top', '202px');
                $('.framework-scrolling').css('top', '202px');
            }
        }

        $rootScope.tipInfoClose = function () {
            $('#frame-os-check').remove();
            setMenuTop(0);
            if (localization.x_domain_type !== 'TSI') {
                $('#service-content').css('padding-top', '60px');
                $('.framework-scrolling').css('top', '60px');
            } else {
                $('#service-content').css('padding-top', '140px');
                $('.framework-scrolling').css('top', '140px');
            }
            //使用cookie记录关闭行为，cookie设置到二级域名下，保证所有console该会话周期内不再提示
            setCookie("browserCheckClose", "true");
        };

        function setCookie(cname, cvalue) {
            document.cookie = cname + '=' + cvalue + ';path=/;domain=' + window.cloudCookieDomain;
        }

        //导航随水平滚动条滚动
        var $window = $(window);

        $window.scroll(setMenuLeft);

        function setContentMinHeight() {
            var height1 = $(window).height();
            //UI规范窗口最小高度600
            if (height1 < 600) {
                height1 = 600;
            }
            var height3 = $('#service-footer').height();
            $('#service-content').css('min-height', height1 - height3);
        }

        function setMenuLeft() {
            var scrollLeft = $window.scrollLeft(),
                $serviceFooter = $('#service-footer');
            $('#service-menus,#frame-os-check').css('left', -scrollLeft);
            if ($serviceFooter.css('position') === 'fixed') {
                $serviceFooter.css('left', -scrollLeft);
            }
            $('.console-menu-nav-list-wrapper').css('left', -scrollLeft + 20);
            if ($('#service-menus .menu-top-content').css('display') === 'none' ||
                !$('#service-menus .menu-top-content').css('display')) {
                return;
            }
            var scrollTop = $window.scrollTop();
            if (scrollTop > 78) {
                scrollTop = 78;
            } else {
                scrollTop = 0;
            }
            var top = 0;
            if ($('#frame-os-check')) {
                top = $('#frame-os-check').height();
            }

            setMenuTop(top - scrollTop);
            $('.framework-scrolling').css('top', (140 + top - scrollTop) + 'px');
            //$('.framework-scrolling').css('margin-top', (140 + top - scrollTop) + 'px');
        }

        function getLanguageName(key, languages) {
            if (languages) {
                for (var i = 0; i < languages.length; i++) {
                    if (key === languages[i][0]) {
                        return languages[i][1];
                    }
                }
            }

            return null;
        }

        $rootScope.genHWSHref = function (href, flag) {
            if (!href || href === '' || href === '#') {
                return href;
            }

            if (!flag) {
                href = $rootScope.addOrReplaceUrlParameter(href, 'agencyId', $rootScope.getUrlParameter('agencyId', true));

                var region = $rootScope.getUrlParameter('region', true);
                if (region && region !== '' && region !== 'null') {
                    href = $rootScope.addOrReplaceUrlParameter(href, 'region', region);
                }
                //处理国际化
                href = $rootScope.addOrReplaceUrlParameter(href, 'locale', window.urlParams.lang);
            } else if (flag === 'locale') {
                //处理国际化
                href = $rootScope.addOrReplaceUrlParameter(href, 'locale', window.urlParams.lang);
            }

            return href;
        };

        //!value为true时删除参数
        $rootScope.addOrReplaceUrlParameter = function (href, key, value) {
            if (!href || !key) {
                return href;
            }
            var hrefs = href.split('#/');
            var hrefPostfix = '';
            //将#后面的路由信息拼接到URL最后
            if (hrefs.length > 1) {
                hrefPostfix = '#/' + hrefs[1];
            }

            hrefs[0] = $rootScope.delUrlParameter(hrefs[0], key);
            if (value) {
                if (hrefs[0].indexOf('?') !== -1) {
                    hrefs[0] = hrefs[0] + '&' + key + '=' + value;
                } else {
                    hrefs[0] = hrefs[0] + '?' + key + '=' + value;
                }
            }

            return hrefs[0] + hrefPostfix;

        };

        $rootScope.getUrlParameter = function (paramKey, scopeFlag) {
            var sPageURL = window.location.search.substring(1);
            if (sPageURL) {
                var sURLVariables = sPageURL.split('&');
                for (var i = 0; i < sURLVariables.length; i++) {
                    var sParameterName = sURLVariables[i].split('=');
                    if (sParameterName[0] === paramKey) {
                        return sParameterName[1];
                    }
                }
            }
            if (scopeFlag) {
                if (paramKey === 'agencyId') {
                    return $rootScope.userId;
                } else if (paramKey === 'region') {
                    return encodeURIComponent($rootScope.projectName || '');
                }
            } else {
                return null;
            }
        };

        $rootScope.delUrlParameter = function (url, name) {
            return url
                .replace(new RegExp('[?&]' + name + '=[^&#]*(#.*)?$'), '$1')
                .replace(new RegExp('([?&])' + name + '=[^&]*&'), '$1');
        };

        $rootScope.getImageByCloudType = function (type) {
            var cloud_type;
            var typeMatch = {
                "aws": ["aws", "AWS"],
                "toc": ["toc", "TOC"],
                "otc": ["otc", "OTC"],
                "hec": ["hec", "HPC"],
                "ctc": ["ctc", "eCloud"],
                "fs_cloud": ["fs_cloud", "DC2"],
                "private_cloud": ["private_cloud", "localcloud"],
                "fe": ["FE"]
            };

            window._.each(typeMatch, function (values, key) {
                if (window._.contains(values, type)) {
                    cloud_type = key;
                }
            });

            var imagesUrl = {
                "aws": { url: "theme/default/images/aws.png"},
                "fs_cloud": { url: "theme/default/images/fs_cloud.png"},
                "toc": { url: "theme/default/images/toc.png"},
                "otc": { url: "theme/default/images/otc.png"},
                "hec": { url: "theme/default/images/hec.png"},
                "ctc": { url: "theme/default/images/ctc.png"},
                "private_cloud": { url: "theme/default/images/private_cloud.png"},
                "fe": { url: "theme/default/images/fe.png"}
            };
            return imagesUrl[cloud_type] && imagesUrl[cloud_type].url || "";
        };
        
    };
    ctrl.$injector = ["$rootScope", "$state", "$stateParams"];
    return ctrl;

});