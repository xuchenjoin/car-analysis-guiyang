/* global define */
/* global $ */
/* global angular */
define(['language-remote/framework', 'app-remote/framework/localization/config', 'app-remote/services/cookieService'], function (i18n, localizationConfig, Storage) {
    "use strict";
    $.fn.alert = function () {
        var self = $(this);
        self.find(".close").bind("click", function () {
            self.remove();
        });
    };

    var storage = new Storage();

    var tipMessage = function ($timeout) {
        if (!$timeout) {
            $timeout = setTimeout;
        }

        var target = "#frame-cloud-messages-tips";
        var types = ["error", "success"];
        var images = {
            "success": {"url": "theme/default/images/cloud-tips-success.png"},
            "error": {"url": "theme/default/images/cloud-tips-error.png"},
            "success-big": {"url": "theme/default/images/cloud-tips-success-big.png"},
            "error-big": {"url": "theme/default/images/cloud-tips-error-big.png"}
        };
        var fade_duration = 2000;
        var auto_fade_alerts_delay = 5000;

        this.alert = function (type, message, marginLeft, width) {
            this.alertCore(false, type, message, marginLeft, width);
        };

        /**
         * 通过该函数弹出的提示信息会根据页面是否有左风琴进行大小和偏移自适应
         * @param type 消息类型
         * @param message 消息内容
         * @param marginLeft 自定义左偏移
         * @param width 自定义宽度
         */
        this.alertAdaptive = function (type, message, marginLeft, width) {
            this.alertCore(true, type, message, marginLeft, width);
        };

        this.alertCore = function (adaptiveFlag, type, message, marginLeft, width) {
            var messageTemplate = $('<div class="alert alert-block fade in frame-cloud-alert-block frame-normal-font-size"><a class="close frame-cloud-close" data-dismiss="alert">&times;</a><p></p></div>');
            if (type === types[0]) {
                messageTemplate.addClass("frame-cloud-alert-error");
            } else if (type === types[1]) {
                messageTemplate.addClass("frame-cloud-alert-success");
            } else {
                return;
            }
            //如果页面没有左风琴,则设置为全屏宽度，不进行padding偏移
            if (adaptiveFlag) {
                if ((!$('.leftContainer') || !$('.leftContainer').length) && (!$('.left-container') || !$('.left-container').length) &&
                    (!$('.tiny-layout-west') || !$('.tiny-layout-west').length)) {
                    $(target).css('padding-left', 0);
                }
            }
            if (marginLeft) {
                messageTemplate.css({
                    "margin-left": marginLeft
                });
            }
            if (width) {
                messageTemplate.css({
                    "width": width
                });
            }


            messageTemplate.find("p")
                .append('<img class="frame-cloud-message-img" src="' + images[type].url + '">')
                .append($.encoder.encodeForHTML(message));
            messageTemplate.alert();
            messageTemplate.hide().prependTo(target).fadeIn(100);
            this.autoDismissAlert(messageTemplate);
            this.storageMsg(type, message);
            return messageTemplate;
        };

        this.clearErrorMessages = function () {
            $(target + ' .alert.frame-cloud-alert-error').remove();
        };

        this.clearSuccessMessages = function () {
            $(target + ' .alert.frame-cloud-alert-success').remove();
        };

        this.clearAllMessages = function () {
            this.clearErrorMessages();
            this.clearSuccessMessages();
        };

        this.autoDismissAlerts = function () {
            var self = this;
            var $alerts = $(target + ' .alert');
            $alerts.each(function (index, alert) {
                var $alert = $(this),
                    types = $alert.attr('class').split(' '),
                    intersection = $.grep(types, function (value) {
                        return $.inArray(value, types) !== -1;
                    });
                // Check if alert should auto-fade
                if (intersection.length > 0) {
                    self.autoDismissAlert($alert);
                }
            });
        };

        this.storageMsg = function (type, msg) {
            var msgData = {};
            msgData.content = '[' + type + '] ' + msg;
            msgData.time = new Date();

            var agencyID = storage.cookieStorage.getItem('agencyID');

            var tipsMessages = storage.get('framework_tips_msg' + agencyID);
            tipsMessages = tipsMessages ? tipsMessages : [];
            if (tipsMessages.unshift(msgData) > 50) {
                tipsMessages.pop();
            }
            storage.add('framework_tips_msg' + agencyID, tipsMessages);
            storage.add('framework_tips_new_msg' + agencyID, true);
            if($('.frame-message-round')) {
                $('.frame-message-round').css('display', 'block');
            }
        };

        this.autoDismissAlert = function (itemMessage) {
            $timeout(function () {
                itemMessage.fadeOut(fade_duration).remove();
            }, auto_fade_alerts_delay);
        };

        this.init = function () {
            var self = this;
            $('a.ajax-modal').click(function () {
                self.clearAllMessages();
            });
            self.autoDismissAlerts();
        };
        this.init();
    };
    return tipMessage;
});
