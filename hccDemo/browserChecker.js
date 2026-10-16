//浏览器版本检测
(function () {
    "use strict";

    function Device(ua) {
        var os = this.os = {},
            browser = this.browser = {},
            webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
            android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
            osx = !!ua.match(/\(Macintosh\; Intel /),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            touchpad = webos && ua.match(/TouchPad/),
            kindle = ua.match(/Kindle\/([\d.]+)/),
            silk = ua.match(/Silk\/([\d._]+)/),
            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
            bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
            rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
            playbook = ua.match(/PlayBook/),
            uc = ua.match(/UCBrowser\/([\w.\s]+)/),
            chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            firefox = ua.match(/Firefox\/([\d.]+)/),
            ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
            webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
            safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
            orientation = Math.abs(window.orientation);
        /* jshint -W084 */
        if (browser.webkit = !!webkit) {
            browser.version = webkit[1];
        }

        if (android) {
            os.android = true;
            os.version = android[2];
        }
        if (iphone && !ipod) {
            os.ios = os.iphone = true;
            os.version = iphone[2].replace(/_/g, '.');
        }
        if (ipad) {
            os.ios = os.ipad = true;
            os.version = ipad[2].replace(/_/g, '.');
        }
        if (ipod) {
            os.ios = os.ipod = true;
            os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        }
        if (webos) {
            os.webos = true;
            os.version = webos[2];
        }
        if (touchpad) {
            os.touchpad = true;
        }
        if (blackberry) {
            os.blackberry = true;
            os.version = blackberry[2];
        }
        if (bb10) {
            os.bb10 = true;
            os.version = bb10[2];
        }
        if (rimtabletos) {
            os.rimtabletos = true;
            os.version = rimtabletos[2];
        }
        if (playbook) {
            browser.playbook = true;
        }
        if (uc) {
            os.uc = true;
            os.ucversion = uc[1];
        }
        if (kindle) {
            os.kindle = true;
            os.version = kindle[1];
        }
        if (silk) {
            browser.silk = true;
            browser.version = silk[1];
        }
        if (!silk && os.android && ua.match(/Kindle Fire/)) {
            browser.silk = true;
        }
        if (orientation !== 90) {
            os.protrait = true;
        }
        if (orientation === 90) {
            os.landscape = true;
        }

        if (chrome) {
            browser.chrome = true;
            browser.version = chrome[1];
        }
        if (firefox) {
            browser.firefox = true;
            browser.version = firefox[1];
        }
        if (ie) {
            browser.ie = true;
            browser.version = ie[1];
        }
        if (safari && (osx || os.ios)) {
            browser.safari = true;
            if (osx) {
                browser.version = safari[1];
            }
        }
        if (webview) {
            browser.webview = true;
        }

        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
        (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
        os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
        (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
        (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));
    }

    function getBrowserInfo() {
        var Msie = /(msie\s|trident.*rv:)([\w.]+)/;
        var Firefox = /(firefox)\/([\w.]+)/;
        var Chrome = /(chrome)\/([\w.]+)/;
        var Opera = /(opera).+version\/([\w.]+)/;
        var Safari = /version\/([\w.]+).*(safari)/;

        var agent = navigator.userAgent.toLowerCase();
        var match = Msie.exec(agent);
        if (match) {
            return {
                browser: "IE",
                version: match[2] || "0"
            };
        }
        match = Firefox.exec(agent);
        if (match) {
            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        }
        match = Chrome.exec(agent);
        if (match) {
            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        }
        match = Opera.exec(agent);
        if (match) {
            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        }
        match = Safari.exec(agent);
        if (match) {
            return {
                browser: match[2] || "",
                version: match[1] || "0"
            };
        }
        return "false";
    }

    function detectOS() {
        var sUserAgent = navigator.userAgent;
        var isWin = (navigator.platform === "Win32") || (navigator.platform === "Win64") || (navigator.platform === "Windows");
        var isMac = (navigator.platform === "Mac68K") || (navigator.platform === "MacPPC") || (navigator.platform === "Macintosh") || (navigator.platform === "MacIntel");
        if (isMac) {
            return "Mac";
        }
        var isUnix = (navigator.platform === "X11") && !isWin && !isMac;
        if (isUnix) {
            return "linux";
        }
        var UserAgent = sUserAgent.toLowerCase();
        var isIpad = /ipad/.test(UserAgent);
        var isIphone = /iphone os/.test(UserAgent);
        var isAndroid = /android/.test(UserAgent);
        var isWindowsCe = /windows ce/.test(UserAgent);
        var isWindowsMobile = /windows mobile/.test(UserAgent);
        var isWin2K = /windows nt 5.0/.test(UserAgent);
        var isXP = /windows nt 5.1/.test(UserAgent);
        var isVista = /windows nt 6.0/.test(UserAgent);
        var isWin7 = /windows nt 6.1/.test(UserAgent);
        var isWin8 = /windows nt 6.2/.test(UserAgent);
        var isWin81 = /windows nt 6.3/.test(UserAgent);

        if (isIpad || isIphone || isAndroid || isWindowsMobile || isWindowsCe) {
            return "other";
        }
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);

        var bIsAndroid = sUserAgent.toLowerCase().match(/android/i) === "android";
        if (isLinux) {
            if (bIsAndroid) {
                return "other";//"Android";
            } else {
                return "linux";
            }
        }
        if (isWin) {
            isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            if (isWin2K) {
                return "win7";
            }
            var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
            if (isWinXP) {
                return "win7";
            }
            var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            if (isWin2003) {
                return "win7";
            }
            var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            if (isWinVista) {
                return "win7";
            }
            isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin7) {
                return "win7";
            }
            var isWin10 = sUserAgent.indexOf("Windows NT 6.2") > -1 || sUserAgent.indexOf("Windows NT 6.3") > -1 ||
                sUserAgent.indexOf("Windows NT 6.4") > -1 || sUserAgent.indexOf("Windows NT 10.0") > -1 || sUserAgent.indexOf("Windows 10") > -1;
            if (isWin10) {
                return "win10";
            }
            if (isWin8 || isWin81) {
                return "win7";
            }
        }
        return "false";
    }

    var supportOSArray = {
        "win7": {"ie": {"9+": "A"}, "firefox": {"38+": "A", "27+": "B"}, "chrome": {"43+": "A", "31+": "B"}},
        "win10": {
            "microsoft edge": {"13+": "B"},
            "ie": {"9+": "A"},
            "firefox": {"38+": "A", "27+": "B"},
            "chrome": {"43+": "A", "31+": "B"}
        },
        "linux": {"firefox": {"27+": "A", "X": "B"}, "chrome": {"50+": "A", "31+": "B"}},
        "mac": {"chrome": {"43+": "A", "31+": "B"}, "safari": {"8+": "B"}}
    };
    var minimumBrowserVersion = {
        "ie": "9+",
        "firefox": "27+",
        "chrome": "31+"
    };

    // function simpeExtend(destination, source) {
    //     var property;
    //     for (property in source) {
    //         destination[property] = source[property];
    //     }
    //     return destination;
    // }

    // if (window.frame_supportOSArray) {
    //     supportOSArray = simpeExtend(supportOSArray, window.frame_supportOSArray);
    // }
    // if (window.frame_minimumBrowserVersion) {
    //     minimumBrowserVersion = simpeExtend(minimumBrowserVersion, window.frame_minimumBrowserVersion);
    // }

    function checkBrowser() {
        var currentOs = detectOS();
        var browserFlag = "C";
        var flag = browserFlag;
        if (currentOs === "false") {
            return flag;
        }
        if (currentOs === "other") {
            return "A";
        }
        var browserInfo = getBrowserInfo();
        if (browserInfo === "false") {
            return flag;
        }
        var browser = browserInfo.browser.toLowerCase();
        var version = browserInfo.version;
        var browserArray = supportOSArray[currentOs];
        var supportArray = browserArray[browser];
        for (var index in supportArray) {
            flag = supportArray[index];
            if (index.indexOf("X") >= 0) {
                return flag;
            } else if (index.indexOf("+") >= 0 && parseInt(version, 10) >= parseInt(index, 10)) {
                return flag;
            } else if (parseInt(version, 10) === parseInt(index, 10)) {
                return flag;
            }
            continue;
        }
        return browserFlag;
    }

    var result = checkBrowser();
    if (result === "C") {
        setCookie("minimumBrowserVersion", JSON.stringify(minimumBrowserVersion));
        window.location.href = '/error/supportBrowsers.html';
    } else if (result === "B") {
        setCookie("browserCheckResult", "B");
    } else {
        setCookie("browserCheckResult", "A");
    }

    function setCookie(cname, cvalue) {
        document.cookie = cname + '=' + cvalue + ';path=/';
    }

    function trimEmpty(value) {
        if (!value) {
            return '';
        }
        return value.replace(/(^\s*)|(\s*$)/g, '');
    }
})();