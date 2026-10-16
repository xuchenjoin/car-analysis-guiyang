define({
    start: function () {
        (function (url, win, doc, myName) {
            win[myName] = win[myName] || function () {
                (win[myName].q = win[myName].q || []).push(arguments);
            };
            setTimeout(function () {
                var iframe = document.createElement('iframe');
                (iframe.frameElement || iframe).style.cssText = 'display:none';
                iframe.src = 'javascript:false';
                var where = document.getElementsByTagName('script')[0];
                where.parentNode.insertBefore(iframe, where);
                var doc = iframe.contentWindow.document;
                doc.open().write('<body onload="' +
                    'var js = document.createElement(\'script\');' +
                    'js.src = \'' + url + '?hr=' + new Date().getTime() + '\';' +
                    'document.body.appendChild(js);">');
                doc.close();
            }, 0);
        }('https://app.huawei.com/hwa-c/configresource/js/general/ha_f.js', window, document, 'ha'));

        ha("setAutoSendPV", false);
        ha("set", "siteId", "PublicCloud");
    }
});