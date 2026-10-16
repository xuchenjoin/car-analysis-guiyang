define([], function () {
    "use strict";

    var timeService = function ($rootScope,camel) {
        this.fn = {
            "offset": 60 * -(new Date).getTimezoneOffset() * 1e3, "addSuffix": function (localTime) {
                var timeZoneStr, timeZone = -(new Date).getTimezoneOffset(), timeZoneAbs = Math.abs(timeZone), timeZoneMinute = timeZoneAbs % 60, timeZoneHour = (timeZoneAbs - timeZoneMinute) / 60;
                timeZoneHour = timeZoneHour < 10 ? "0" + timeZoneHour : timeZoneHour;
                timeZoneMinute = timeZoneMinute < 10 ? "0" + timeZoneMinute : timeZoneMinute;
                timeZoneStr = timeZoneHour + ":" + timeZoneMinute;
                timeZoneStr = timeZone < 0 ? "-" + timeZoneStr : "+" + timeZoneStr;
                return localTime + " GMT" + timeZoneStr
            }, "milli2LocalWithoutSuffix": function (milliseconds) {
                var date, hour, minute, second, time = new Date(milliseconds), year = time.getFullYear(), month = time.getMonth() + 1;
                month = month < 10 ? "0" + month : month;
                date = time.getDate();
                date = date < 10 ? "0" + date : date;
                hour = time.getHours();
                hour = hour < 10 ? "0" + hour : hour;
                minute = time.getMinutes();
                minute = minute < 10 ? "0" + minute : minute;
                second = time.getSeconds();
                second = second < 10 ? "0" + second : second;
                return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
            }, "milliseconds2LocalTime": function (milliseconds) {
                var localTime = this.milli2LocalWithoutSuffix(milliseconds);
                return this.addSuffix(localTime)
            }, "localTime2Milliseconds": function (localTime) {
                var year = localTime.substr(0, 4), month = localTime.substr(5, 2), date = localTime.substr(8, 2), hour = localTime.substr(11, 2), minute = localTime.substr(14, 2), second = localTime.substr(17, 2), time = new Date(+year, month - 1, +date, +hour, +minute, +second);
                return time.getTime()
            }, "utcTime2Milliseconds": function (utcTime) {
                var milliseconds = this.localTime2Milliseconds(utcTime) + this.offset;
                return milliseconds
            }, "milliseconds2UtcTime": function (milliseconds) {
                milliseconds -= this.offset;
                return this.milli2LocalWithoutSuffix(milliseconds)
            }, "utc2Local": function (utcTime) {
                if (!utcTime)return "";
                var milliSeconds = this.utcTime2Milliseconds(utcTime);
                return this.milliseconds2LocalTime(milliSeconds)
            }, "local2Utc": function (localTime) {
                if (!localTime)return "";
                var milliSeconds = this.localTime2Milliseconds(localTime);
                return this.milliseconds2UtcTime(milliSeconds)
            }
        };
    };

    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyService('timeService', timeService);
});