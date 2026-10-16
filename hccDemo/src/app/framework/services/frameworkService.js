/**
 * Created on 2015/1/31.
 */
/* global define */
/* global $ */
/* global angular */
define(["fixtures/frameworkFixture", 'app-remote/framework/localization/config'], function (fixtures, localizationConfig) {
    "use strict";
    var framework = {
        "beforeSend": function (request, setting) {
            request.setRequestHeader('X-Request-From', 'Framework');
        }
    };

    var service = function ($q, camel) {
        this.queryEndpoints = function (options) {
            options = options || {};
            var promise = camel.get({
                'url': window.appWebPath + '/rest/silvan/rest/v1.0/endpoints',
                "timeout": 60000,
                "params": {
                    "start": options.start || 0,
                    "limit": options.limit || 0,
                    "region": options.region
                },
                "beforeSend": function (request, setting) {
                    request.setRequestHeader("Frame-Domain-Type", localizationConfig.x_domain_type || '');
                    framework.beforeSend(request, setting);
                }
            });
            return promise;
        };

        this.favoriteEndpoints = function (options) {
            options = options || {};
            var promise = camel.get({
                'url': {
                    's': window.appWebPath + '/rest/silvan/rest/v1.0/users/{user_id}/endpoints',
                    'o': {
                        'user_id': options.user_id
                    }
                },
                "timeout": 60000,
                "beforeSend": function (request, setting) {
                    request.setRequestHeader("Frame-Domain-Type", localizationConfig.x_domain_type || '');
                    framework.beforeSend(request, setting);
                }
            });
            return promise;
        };

        this.addFavoriteEndpoint = function (options) {
            options = options || {};
            var promise = camel.post({
                'url': {
                    's': window.appWebPath + '/rest/silvan/rest/v1.0/users/{user_id}/endpoints/{id}',
                    'o': {
                        'user_id': options.user_id,
                        'id': options.id
                    }
                },
                "timeout": 60000,
                "beforeSend": function (request, setting) {
                    request.setRequestHeader("Frame-Domain-Type", localizationConfig.x_domain_type || '');
                    framework.beforeSend(request, setting);
                }
            });
            return promise;
        };

        this.deleteFavoriteEndpoint = function (options) {
            options = options || {};
            var promise = camel.deleter({
                'url': {
                    's': window.appWebPath + '/rest/silvan/rest/v1.0/users/{user_id}/endpoints/{id}',
                    'o': {
                        'user_id': options.user_id,
                        'id': options.id
                    }
                },
                "timeout": 60000,
                "beforeSend": framework.beforeSend
            });
            return promise;
        };

        this.queryRegions = function (options) {
            options = options || {};
            var promise = camel.get({
                'url': window.appWebPath + '/rest/silvan/rest/v1.0/regions',
                "timeout": 60000,
                "params": {
                    "start": options.start || 0,
                    "limit": options.limit || 0
                },
                "beforeSend": function (request, setting) {
                    request.setRequestHeader("Frame-Domain-Type", localizationConfig.x_domain_type || '');
                    framework.beforeSend(request, setting);
                }
            });
            return promise;
        };

        this.changeRegion = function (options) {
            options = options || {};
            var promise = camel.get({
                'url': window.appWebPath + '/rest/changeRegion',
                "timeout": 60000,
                "mask": true,
                "params": {
                    "project": options.project
                },
                "beforeSend": framework.beforeSend
            });
            return promise;
        };

        this.getMessages = function (options) {
            options = options || {};
            var promise = camel.get({
                'url': window.appWebPath + '/rest/silvan/rest/v1.0/messages',
                "timeout": 60000,
                "params": {
                    "start": options.start || 0,
                    "limit": options.limit || 0
                },
                "beforeSend": framework.beforeSend
            });
            return promise;
        };

        this.getLinks = function (options) {
            options = options || {};
            var promise = camel.get({
                'url': window.appWebPath + '/rest/silvan/rest/v1.0/links',
                "timeout": 60000,
                "params": {
                    "key": options.key || '',
                    "type": options.type || ''
                },
                "beforeSend": function (request, setting) {
                    request.setRequestHeader("Frame-Domain-Type", localizationConfig.x_domain_type || '');
                    framework.beforeSend(request, setting);
                }
            });
            return promise;
        };

        this.getLoginUser = function () {
            var promise = camel.get({
                'url': window.appWebPath + '/rest/me',
                "timeout": 60000,
                "beforeSend": framework.beforeSend
            });
            return promise;
        };

        this.queryAccountSum = function() {
            return camel.get({
                'url': window.appWebPath + '/rest/BSS/OpenApi/v1/accounts/sum/accountinfo',
                "timeout": 10000
            });
        };

        this.heartbeat = function () {
            var promise = camel.get({
                'url': window.appWebPath + '/rest/heartbeat',
                "timeout": 60000,
                "beforeSend": framework.beforeSend
            });
            return promise;
        };

        this.getMessagesTypes = function () {

            var promise = camel.get({
                'url': window.appWebPath + '/rest/silvan/rest/v1.0/messageTypes',
                "timeout": 60000,
                "beforeSend": framework.beforeSend
            });
            return promise;
        };

        this.getUserChoices = function (options) {
            options = options || {};
            var promise = camel.get({
                'url': window.appWebPath + '/rest/silvan/rest/v1.0/user_choices',
                "params": {
                    "userId": options.userId || '',
                    "preferName": options.type || ''
                },
                "timeout": 60000,
                "beforeSend": framework.beforeSend
            });
            return promise;
        };

        this.updateUserChoices = function (options) {
            options = options || {};
            var promise = camel.post({
                'url': window.appWebPath + '/rest/silvan/rest/v1.0/user_choices',
                "params": {
                    "userId": options.userId || '',
                    "preferName": options.type || '',
                    "preferDisplayName": options.value || '',
                    "preferDesc": options.preferDesc || ''
                },
                "timeout": 60000,
                "beforeSend": framework.beforeSend
            });
            return promise;
        };

        this.getAssumeRoles = function (options) {
            options = options || {};
            var promise = camel.get({
                'url': {
                    's': window.appWebPath + '/rest/iam/assumeRoles/{user_id}',
                    'o': {
                        'user_id': options.userId
                    }
                },
                "params": {
                    "limit": 5
                },
                "timeout": 60000,
                "beforeSend": framework.beforeSend
            });

            return promise;
        };

        this.assumeRole = function (options) {
            options = options || {};
            var promise = camel.get({
                'url': window.appWebPath + '/rest/changeRole',
                "timeout": 60000,
                "mask": true,
                "params": {
                    "agencyId": options.agencyId
                },
                "beforeSend": framework.beforeSend
            });

            return promise;
        };

        this.getUserProjects = function (options) {
            options = options || {};
            var promise;
            if(localizationConfig.x_cloud_type === "private"){
                promise = camel.get({
                   'url': {
                       's': window.appWebPath + '/rest/iam/v3/users/{user_id}/projects',
                       'o': {
                           'user_id': options.userId
                       }
                   },
                    "timeout": 60000,
                    "beforeSend": framework.beforeSend
                });
            } else {
                promise = camel.get({
                    'url': window.appWebPath + '/rest/iam/v3/projects',
                    "timeout": 60000,
                    "params": {
                        "domain_id": options.domain_id
                    },
                    "beforeSend": framework.beforeSend
                });
            }

            return promise;
        };

        this.queryIamUser = function (userId) {
            return camel.get({
                'url': {
                    's': window.appWebPath + '/rest/iam/service/user/{userId}',
                    'o': {
                        'userId': userId
                    }
                },
                "timeout": 10000,
                "params": {
                    "scope": "imgpaths"
                },
                "beforeSend": framework.beforeSend
            });
        };

    };

    service.$injector = ["$q", "camel"];
    return service;
});
