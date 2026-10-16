/**
 * urlDeal
 * Created on 2015/7/16.
 */
(function () {
    "use strict";

    //TODO 旧版本URL支持，通过发文方式告知其他服务统一整改
    (function () {
        var locationHref = window.location.href;
        if (!window.location.hash) {
            if (locationHref.indexOf('?hws_route_url=') !== -1) {
                locationHref = locationHref.replace('?hws_route_url=', '#/');
            } else if (locationHref.indexOf('&hws_route_url=') !== -1) {
                locationHref = locationHref.replace('&hws_route_url=', '#/');
            }
            var hrefs = locationHref.split('#/');
            if (hrefs.length === 2) {
                if (hrefs[1].indexOf('&') !== -1) {
                    hrefs[1] = hrefs[1].replace('&', '?');
                }
                window.location.href = hrefs[0] + '#/' + hrefs[1];
            }
        }
    })(window);

    window.onload = function () {
        var height1 = $(window).height();
        //UI规范窗口最小高度600
        if (height1 < 600) {
            height1 = 600;
        }
        var height3 = $('#service-footer').height();
        $('#service-content').css('min-height', height1 - height3);
    };

    function getUrlParameter(paramKey) {
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
    }

    //the first is the defualt
    var supportLanguage = ['zh-cn', 'en-us', 'de-de', 'es-es', 'fr-fr', 'pt-br'];

    window.cloudCookieDomain = 'hwclouds.com';

    function getLanguage(key) {
        var result = getUrlParameter(key);

        if (!window.urlParams) {
            window.urlParams = {};
        }

        if (!result) {
            result = getCookie(key);
        }

        if (supportLanguage.indexOf(result) >= 0) {
            window.urlParams.lang = result;
        } else {
            result = (navigator.browserLanguage || navigator.language).toLowerCase();
            result = languageTranslate(result);
            if (supportLanguage.indexOf(result) >= 0) {
                window.urlParams.lang = result;
            } else {
                result = supportLanguage[0];
                window.urlParams.lang = result;
            }
        }
            setCookie(key, result);
    }

    var browserCodeMap = {
        'zh': 'zh-cn',
        'en': 'en-us',
        'de': 'de-de',
        'es': 'es-es',
        'fr': 'fr-fr',
        'pt': 'pt-br'
    };

    function languageTranslate(browserCode) {
        if (browserCode) {
            return browserCodeMap[browserCode.substr(0, 2)];
        }
    }

    function trimEmpty(value) {
        if (!value) {
            return '';
        }
        return value.replace(/(^\s*)|(\s*$)/g, '');
    }

    function getCookie(key) {
        if (!document.cookie) {
            return null;
        }
        var consoleCookies = document.cookie.split(';');
        var cookie;
        for (var i = 0; i < consoleCookies.length; i++) {
            cookie = consoleCookies[i].split('=');
            if (cookie && cookie.length >= 2 && key === trimEmpty(cookie[0])) {
                return trimEmpty(cookie[1]);
            }
        }
    }

    function setCookie(cname, cvalue) {
        document.cookie = cname + '=' + cvalue + ';path=/;domain=' + window.cloudCookieDomain;
    }

    window.bussinessVersion = getCookie('ttl');
    window.frameworkVersion = getCookie('ttf');
    getLanguage('locale');
})();