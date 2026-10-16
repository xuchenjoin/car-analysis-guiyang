/**
 * Created on 13-12-18.
 */
define(["can/util/fixture/fixture", "tiny-lib/underscore"], function (fixture, _) {
     var endpoints= {
        "endpoints": [{
            "seq_id": 67,
            "id": "home",
            "name": "控制台首页",
            "shortName": "控制台首页",
            "created": "2015-06-01 13:13:26",
            "lastModified": "2015-07-06 13:52:44",
            "version": "v1.0",
            "endpoint": "https://console.test.hwclouds.com/console",
            "active": true,
            "defaultOpen": false,
            "catalogOrder": 0,
            "serviceOrder": 0,
            "links": []
        },
            {
                "seq_id": 5,
                "id": "ecm",
                "name": "弹性云主机",
                "shortName": "弹性云主机",
                "created": "2015-05-30 15:47:53",
                "lastModified": "2015-07-06 15:05:18",
                "version": "v1.0",
                "catalog": "弹性计算",
                "description": "云主机提供弹性计算能力，按需使用",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/ecs/manager/vmList",
                "active": true,
                "catalogCss": "compute",
                "serviceCss": "ecm",
                "defaultOpen": false,
                "catalogOrder": 1,
                "serviceOrder": 1,
                "links": [{
                    "seqId": 577,
                    "key": "ecm",
                    "text": "dashboard",
                    "href": "https://console.test.hwclouds.com/ecm/#/ecs/manager/dashboard",
                    "type": "endpoint"
                },
                    {
                        "seqId": 469,
                        "key": "ecm",
                        "text": "buy",
                        "href": "https://console.test.hwclouds.com/ecm/#/ecs/createVm",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 576,
                        "key": "ecm",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/ecm/#/ecs/manager/vmList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 470,
                        "key": "ecm",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/ecs.html",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 6,
                "id": "ess",
                "name": "弹性伸缩服务",
                "shortName": "弹性伸缩服务",
                "created": "2015-05-30 15:47:53",
                "lastModified": "2015-07-06 14:36:28",
                "version": "v1.0",
                "catalog": "弹性计算",
                "description": "提供自动调整其弹性计算资源的管理服务",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/as/manager/groupList",
                "active": true,
                "catalogCss": "compute",
                "serviceCss": "ess",
                "defaultOpen": false,
                "catalogOrder": 1,
                "serviceOrder": 2,
                "links": [{
                    "seqId": 471,
                    "key": "ess",
                    "text": "buy",
                    "iconName": "apply",
                    "href": "https://console.test.hwclouds.com/ecm/#/as/createGroup",
                    "type": "endpoint"
                },
                    {
                        "seqId": 584,
                        "key": "ess",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/ecm/#/as/manager/groupList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 583,
                        "key": "ess",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/as.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 472,
                        "key": "ess",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/as/manager/groupList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 7,
                "id": "ims",
                "name": "镜像服务",
                "shortName": "镜像服务",
                "created": "2015-05-30 15:47:53",
                "lastModified": "2015-07-06 14:37:27",
                "version": "v1.0",
                "catalog": "弹性计算",
                "description": "提供自助制作镜像以及镜像的管理服务",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/ims/manager/imageList/selfImage",
                "active": true,
                "catalogCss": "compute",
                "serviceCss": "ims",
                "defaultOpen": false,
                "catalogOrder": 1,
                "serviceOrder": 3,
                "links": [{
                    "seqId": 45,
                    "key": "ims",
                    "text": "buy",
                    "iconName": "apply",
                    "href": "https://console.test.hwclouds.com/ecm/#/ims/createImage",
                    "type": "endpoint"
                },
                    {
                        "seqId": 586,
                        "key": "ims",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/ims/manager/imageList/selfImage",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 587,
                        "key": "ims",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/ecm/#/ims/manager/imageList/selfImage",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 46,
                        "key": "ims",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/ims.html",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 3,
                "id": "dbs",
                "name": "云硬盘",
                "shortName": "云硬盘",
                "created": "2015-05-30 15:47:53",
                "lastModified": "2015-07-06 14:56:03",
                "version": "v1.0",
                "catalog": "存储",
                "description": "云硬盘",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/evs/manager/volumelist",
                "active": true,
                "catalogCss": "storage",
                "serviceCss": "dbs",
                "defaultOpen": false,
                "catalogOrder": 2,
                "serviceOrder": 1,
                "links": [{
                    "seqId": 599,
                    "key": "dbs",
                    "text": "dashboard",
                    "href": "https://console.test.hwclouds.com/ecm/#/ecs/manager/dashboard",
                    "type": "endpoint"
                },
                    {
                        "seqId": 476,
                        "key": "dbs",
                        "text": "buy",
                        "href": "https://console.test.hwclouds.com/ecm/#/evs/createvolume",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 473,
                        "key": "dbs",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/evs.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 598,
                        "key": "dbs",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/ecm/#/evs/manager/volumelist",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 3,
                "id": "tas",
                "name": "传输加速服务",
                "shortName": "传输加速服务",
                "created": "2015-05-30 15:47:53",
                "lastModified": "2015-07-06 14:56:03",
                "version": "v1.0",
                "catalog": "存储",
                "description": "传输加速服务",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/evs/manager/volumelist",
                "active": true,
                "catalogCss": "storage",
                "serviceCss": "tas",
                "defaultOpen": false,
                "catalogOrder": 2,
                "serviceOrder": 4,
                "links": [{
                    "seqId": 599,
                    "key": "dbs",
                    "text": "dashboard",
                    "href": "https://console.test.hwclouds.com/ecm/#/ecs/manager/dashboard",
                    "type": "endpoint"
                },
                    {
                        "seqId": 476,
                        "key": "dbs",
                        "text": "buy",
                        "href": "https://console.test.hwclouds.com/ecm/#/evs/createvolume",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 473,
                        "key": "dbs",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/evs.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 598,
                        "key": "dbs",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/ecm/#/evs/manager/volumelist",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 1,
                "id": "bks",
                "name": "云硬盘备份",
                "shortName": "云硬盘备份",
                "created": "2015-05-30 15:47:53",
                "lastModified": "2015-07-06 15:02:19",
                "version": "v1.0",
                "catalog": "存储",
                "description": "云硬盘备份服务",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/vbs/manager/backuplist",
                "active": true,
                "catalogCss": "storage",
                "serviceCss": "vbs",
                "defaultOpen": false,
                "catalogOrder": 2,
                "serviceOrder": 2,
                "links": [{
                    "seqId": 593,
                    "key": "bks",
                    "text": "list",
                    "href": "https://console.test.hwclouds.com/ecm/#/vbs/manager/backuplist",
                    "type": "endpoint"
                },
                    {
                        "seqId": 474,
                        "key": "bks",
                        "text": "buy",
                        "href": "https://console.test.hwclouds.com/ecm/#/vbs/createBackup",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 475,
                        "key": "bks",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/vbs.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 592,
                        "key": "bks",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/ecs/manager/dashboard",
                        "type": "endpoint"
                    }]
            },
            {
                "seq_id": 379,
                "id": "obs_zh",
                "name": "对象存储服务",
                "shortName": "对象存储服务",
                "created": "2015-07-26 13:10:21",
                "lastModified": "2015-07-26 13:10:21",
                "version": "v1.0",
                "catalog": "存储",
                "description": "对象存储服务",
                "endpoint": "https://storage.hwclouds.com/obs",
                "active": true,
                "catalogCss": "storage",
                "serviceCss": "obs",
                "defaultOpen": true,
                "catalogOrder": 2,
                "serviceOrder": 3,
                "links": [{
                    "seqId": 609,
                    "key": "obs_zh",
                    "text": "detail",
                    "iconName": "详情",
                    "href": "http://www.hwclouds.com/product/obs.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 611,
                        "key": "obs_zh",
                        "text": "dashboard",
                        "iconName": "详情",
                        "href": "https://storage.hwclouds.com/obs",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 613,
                        "key": "obs_zh",
                        "text": "dashboard",
                        "iconName": "详情",
                        "href": "https://storage.hwclouds.com/obs",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 612,
                        "key": "obs_zh",
                        "text": "dashboard",
                        "iconName": "详情",
                        "href": "https://storage.hwclouds.com/obs",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 380,
                "id": "csbs",
                "name": "云服务器备份",
                "shortName": "云服务器备份",
                "created": "2015-07-26 13:10:21",
                "lastModified": "2015-07-26 13:10:21",
                "version": "v1.0",
                "catalog": "存储",
                "description": "云服务器备份",
                "endpoint": "https://storage.hwclouds.com/obs",
                "active": true,
                "catalogCss": "storage",
                "serviceCss": "csbs",
                "defaultOpen": true,
                "catalogOrder": 2,
                "serviceOrder": 4,
                "links": [{
                    "seqId": 609,
                    "key": "csbs",
                    "text": "detail",
                    "iconName": "详情",
                    "href": "http://www.hwclouds.com/product/obs.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 611,
                        "key": "csbs",
                        "text": "dashboard",
                        "iconName": "详情",
                        "href": "https://storage.hwclouds.com/obs",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 613,
                        "key": "csbs",
                        "text": "dashboard",
                        "iconName": "详情",
                        "href": "https://storage.hwclouds.com/obs",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 612,
                        "key": "csbs",
                        "text": "dashboard",
                        "iconName": "详情",
                        "href": "https://storage.hwclouds.com/obs",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 381,
                "id": "csdr",
                "name": "云服务器容灾",
                "shortName": "云服务器容灾",
                "created": "2015-07-26 13:10:21",
                "lastModified": "2015-07-26 13:10:21",
                "version": "v1.0",
                "catalog": "存储",
                "description": "云服务器容灾",
                "endpoint": "https://storage.hwclouds.com/obs",
                "active": true,
                "catalogCss": "storage",
                "serviceCss": "csdr",
                "defaultOpen": true,
                "catalogOrder": 2,
                "serviceOrder": 5,
                "links": [{
                    "seqId": 609,
                    "key": "csdr",
                    "text": "detail",
                    "iconName": "详情",
                    "href": "http://www.hwclouds.com/product/obs.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 611,
                        "key": "csdr",
                        "text": "dashboard",
                        "iconName": "详情",
                        "href": "https://storage.hwclouds.com/obs",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 613,
                        "key": "csdr",
                        "text": "dashboard",
                        "iconName": "详情",
                        "href": "https://storage.hwclouds.com/obs",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 612,
                        "key": "csdr",
                        "text": "dashboard",
                        "iconName": "详情",
                        "href": "https://storage.hwclouds.com/obs",
                        "type": "endpoint"
                    }]
            },


            {
                "seq_id": 382,
                "id": "csha",
                "name": "云服务器高可用",
                "shortName": "云服务器高可用",
                "created": "2015-07-26 13:10:21",
                "lastModified": "2015-07-26 13:10:21",
                "version": "v1.0",
                "catalog": "存储",
                "description": "云服务器高可用",
                "endpoint": "https://storage.hwclouds.com/obs",
                "active": true,
                "catalogCss": "storage",
                "serviceCss": "csha",
                "defaultOpen": true,
                "catalogOrder": 2,
                "serviceOrder": 6,
                "links": [{
                    "seqId": 609,
                    "key": "csha",
                    "text": "detail",
                    "iconName": "详情",
                    "href": "http://www.hwclouds.com/product/obs.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 611,
                        "key": "csha",
                        "text": "dashboard",
                        "iconName": "详情",
                        "href": "https://storage.hwclouds.com/obs",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 613,
                        "key": "csha",
                        "text": "dashboard",
                        "iconName": "详情",
                        "href": "https://storage.hwclouds.com/obs",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 612,
                        "key": "csha",
                        "text": "dashboard",
                        "iconName": "详情",
                        "href": "https://storage.hwclouds.com/obs",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 9,
                "id": "vpc",
                "name": "虚拟私有云",
                "shortName": "虚拟私有云",
                "created": "2015-05-30 15:47:53",
                "lastModified": "2015-07-06 16:07:21",
                "version": "v1.0",
                "catalog": "网络",
                "description": "虚拟私有云",
                "endpoint": "https://console.test.hwclouds.com/vpc",
                "active": true,
                "catalogCss": "network",
                "serviceCss": "vpc",
                "defaultOpen": false,
                "catalogOrder": 3,
                "serviceOrder": 1,
                "links": [{
                    "seqId": 48,
                    "key": "vpc",
                    "text": "buy",
                    "iconName": "apply",
                    "href": "https://console.test.hwclouds.com/vpc/#/vpc/createVpc",
                    "type": "endpoint"
                },
                    {
                        "seqId": 588,
                        "key": "vpc",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/vpc/#/vpc/vpcmanager/dashboard",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 589,
                        "key": "vpc",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/vpc/#/vpc/vpcmanager/vpcs",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 49,
                        "key": "vpc",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/vpc.html",
                        "type": "endpoint"
                    }]
            },
            {
                "seq_id": 314,
                "id": "elb",
                "name": "弹性负载均衡",
                "shortName": "弹性负载均衡",
                "created": "2015-07-06 16:11:01",
                "lastModified": "2015-07-06 16:11:01",
                "version": "v1.0",
                "catalog": "网络",
                "description": "提供公有云的流量负载分发",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/elb/manager/elbList",
                "active": true,
                "catalogCss": "network",
                "serviceCss": "elb",
                "defaultOpen": false,
                "catalogOrder": 3,
                "serviceOrder": 2,
                "links": [{
                    "seqId": 467,
                    "key": "elb",
                    "text": "detail",
                    "href": "http://www.hwclouds.com/product/elb.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 468,
                        "key": "elb",
                        "text": "buy",
                        "iconName": "apply",
                        "href": "https://console.test.hwclouds.com/ecm/#/elb/createElb",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 594,
                        "key": "elb",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/elb/manager/elbList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 595,
                        "key": "elb",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/ecm/#/elb/manager/elbList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 9,
                "id": "vpn",
                "name": "VPN",
                "shortName": "vpn",
                "created": "2015-05-30 15:47:53",
                "lastModified": "2015-07-06 16:07:21",
                "version": "v1.0",
                "catalog": "网络",
                "description": "vpn",
                "endpoint": "https://console.test.hwclouds.com/vpc",
                "active": true,
                "catalogCss": "network",
                "serviceCss": "vpn",
                "defaultOpen": false,
                "catalogOrder": 3,
                "serviceOrder": 3,
                "links": [{
                    "seqId": 48,
                    "key": "vpc",
                    "text": "buy",
                    "iconName": "apply",
                    "href": "https://console.test.hwclouds.com/vpc/#/vpc/createVpc",
                    "type": "endpoint"
                },
                    {
                        "seqId": 588,
                        "key": "vpc",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/vpc/#/vpc/vpcmanager/dashboard",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 589,
                        "key": "vpc",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/vpc/#/vpc/vpcmanager/vpcs",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 49,
                        "key": "vpc",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/vpc.html",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 9,
                "id": "dns",
                "name": "DNS",
                "shortName": "dns",
                "created": "2015-05-30 15:47:53",
                "lastModified": "2015-07-06 16:07:21",
                "version": "v1.0",
                "catalog": "网络",
                "description": "dns",
                "endpoint": "https://console.test.hwclouds.com/vpc",
                "active": true,
                "catalogCss": "network",
                "serviceCss": "dns",
                "defaultOpen": false,
                "catalogOrder": 3,
                "serviceOrder": 4,
                "links": [{
                    "seqId": 48,
                    "key": "vpc",
                    "text": "buy",
                    "iconName": "apply",
                    "href": "https://console.test.hwclouds.com/vpc/#/vpc/createVpc",
                    "type": "endpoint"
                },
                    {
                        "seqId": 588,
                        "key": "vpc",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/vpc/#/vpc/vpcmanager/dashboard",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 589,
                        "key": "vpc",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/vpc/#/vpc/vpcmanager/vpcs",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 49,
                        "key": "vpc",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/vpc.html",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 329,
                "id": "cdn",
                "name": "Content Delivery Network",
                "shortName": "dns",
                "created": "2015-05-30 15:47:53",
                "lastModified": "2015-07-06 16:07:21",
                "version": "v1.0",
                "catalog": "网络",
                "description": "Content Delivery Network",
                "endpoint": "https://console.test.hwclouds.com/vpc",
                "active": true,
                "catalogCss": "network",
                "serviceCss": "cdn",
                "defaultOpen": false,
                "catalogOrder": 3,
                "serviceOrder": 5,
                "links": [{
                    "seqId": 48,
                    "key": "cdn",
                    "text": "buy",
                    "iconName": "apply",
                    "href": "https://console.test.hwclouds.com/vpc/#/vpc/createVpc",
                    "type": "endpoint"
                },
                    {
                        "seqId": 588,
                        "key": "vpc",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/vpc/#/vpc/vpcmanager/dashboard",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 589,
                        "key": "vpc",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/vpc/#/vpc/vpcmanager/vpcs",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 49,
                        "key": "vpc",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/vpc.html",
                        "type": "endpoint"
                    }]
            },


            {
                "seq_id": 310,
                "id": "webscan",
                "name": "WEB漏洞扫描",
                "shortName": "WEB漏洞扫描",
                "created": "2015-07-06 14:59:57",
                "lastModified": "2015-07-20 22:34:39",
                "version": "v1.0",
                "catalog": "安全",
                "description": "提供WEB漏洞扫描服务",
                "endpoint": "https://console.test.hwclouds.com/scc/#/webscan",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "webscan",
                "defaultOpen": true,
                "catalogOrder": 4,
                "serviceOrder": 1,
                "links": [{
                    "seqId": 568,
                    "key": "webscan",
                    "text": "detail",
                    "href": "http://www.hwclouds.com/product/webscan.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 463,
                        "key": "webscan",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/scc/#/webscan",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 310,
                "id": "kms",
                "name": "密钥管理服务",
                "shortName": "密钥管理服务",
                "created": "2015-07-06 14:59:57",
                "lastModified": "2015-07-20 22:34:39",
                "version": "v1.0",
                "catalog": "安全",
                "description": "密钥管理服务",
                "endpoint": "https://console.test.hwclouds.com/scc/#/webscan",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "kms",
                "defaultOpen": true,
                "catalogOrder": 4,
                "serviceOrder": 4,
                "links": [{
                    "seqId": 568,
                    "key": "webscan",
                    "text": "detail",
                    "href": "http://www.hwclouds.com/product/webscan.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 463,
                        "key": "webscan",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/scc/#/webscan",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 311,
                "id": "waf",
                "name": "WEB应用防火墙",
                "shortName": "WEB应用防火墙",
                "created": "2015-07-06 15:00:15",
                "lastModified": "2015-07-20 22:35:03",
                "version": "v1.0",
                "catalog": "安全",
                "description": "提供WEB应用防火墙服务",
                "endpoint": "https://console.test.hwclouds.com/scc/#/waf",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "waf",
                "defaultOpen": true,
                "catalogOrder": 4,
                "serviceOrder": 2,
                "links": [{
                    "seqId": 569,
                    "key": "waf",
                    "text": "detail",
                    "href": "http://www.hwclouds.com/product/waf.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 464,
                        "key": "waf",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/scc/#/waf",
                        "type": "endpoint"
                    }]
            },
            {
                "seq_id": 309,
                "id": "antiddos",
                "name": "Anti-DDoS流量清洗",
                "shortName": "Anti-DDoS流量清洗",
                "created": "2015-07-06 14:58:39",
                "lastModified": "2015-07-20 22:34:14",
                "version": "v1.0",
                "catalog": "安全",
                "description": "提供DDoS攻击防护与流量清洗服务",
                "endpoint": "https://console.test.hwclouds.com/scc",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "antiddos",
                "defaultOpen": true,
                "catalogOrder": 4,
                "serviceOrder": 3,
                "links": [{
                    "seqId": 567,
                    "key": "antiddos",
                    "text": "detail",
                    "href": "http://www.hwclouds.com/product/antiddos.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 462,
                        "key": "antiddos",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/scc/",
                        "type": "endpoint"
                    }]
            },
            {
                "seq_id": 2,
                "id": "ces",
                "name": "云监控",
                "shortName": "云监控",
                "created": "2015-05-30 15:47:53",
                "lastModified": "2015-07-06 13:32:47",
                "version": "v1.0",
                "catalog": "管理与部署",
                "description": "Cloud Eye",
                "endpoint": "https://console.test.hwclouds.com/ces",
                "active": true,
                "catalogCss": "manager",
                "serviceCss": "ces",
                "defaultOpen": true,
                "catalogOrder": 5,
                "serviceOrder": 1,
                "links": [{
                    "seqId": 36,
                    "key": "ces",
                    "text": "detail",
                    "href": "http://www.hwclouds.com/product/ces.html",
                    "type": "endpoint"
                }]
            },

            {
                "seq_id": 2,
                "id": "maas",
                "name": "数据迁移服务",
                "shortName": "数据迁移服务",
                "created": "2015-05-30 15:47:53",
                "lastModified": "2015-07-06 13:32:47",
                "version": "v1.0",
                "catalog": "管理与部署",
                "description": "数据迁移服务",
                "endpoint": "https://console.test.hwclouds.com/ces",
                "active": true,
                "catalogCss": "manager",
                "serviceCss": "maas",
                "defaultOpen": true,
                "catalogOrder": 5,
                "serviceOrder": 3,
                "links": [{
                    "seqId": 36,
                    "key": "ces",
                    "text": "detail",
                    "href": "http://www.hwclouds.com/product/ces.html",
                    "type": "endpoint"
                }]
            },

            {
                "seq_id": 370,
                "id": "iam",
                "name": "统一身份认证服务",
                "shortName": "统一身份认证服务",
                "created": "2015-07-17 21:56:51",
                "lastModified": "2015-07-17 21:56:51",
                "version": "v1.0",
                "catalog": "管理与部署",
                "description": "统一身份认证服务",
                "endpoint": "https://console.hwclouds.com/iam",
                "active": true,
                "catalogCss": "mgmt",
                "serviceCss": "iam",
                "defaultOpen": true,
                "catalogOrder": 5,
                "serviceOrder": 2,
                "links": [{
                    "seqId": 559,
                    "key": "iam",
                    "text": "detail",
                    "href": "http://www.hwclouds.com/product/iam.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 603,
                        "key": "iam",
                        "text": "dashboard",
                        "href": "https://console.hwclouds.com/iam",
                        "type": "endpoint"
                    }]
            },
            {
                "seq_id": 377,
                "id": "rds",
                "name": "关系型数据库",
                "shortName": "关系型数据库",
                "created": "2015-07-26 02:38:19",
                "lastModified": "2015-07-26 02:38:19",
                "version": "v1.0",
                "catalog": "数据库",
                "description": "关系型数据库服务（Relational Database Service，简称RDS）是一种即开即用、稳定可靠、可弹性伸缩的在线数据库服务。",
                "endpoint": "https://console.test.hwclouds.com/rds/",
                "active": true,
                "serviceCss": "rds",
                "defaultOpen": false,
                "catalogOrder": 6,
                "serviceOrder": 1,
                "links": [{
                    "seqId": 604,
                    "key": "rds",
                    "text": "detail",
                    "href": "http://www.hwclouds.com/product/rds.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 605,
                        "key": "rds",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/rds/#/rds/rdsManagement/rdslist",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 606,
                        "key": "rds",
                        "text": "buy",
                        "iconName": "申请",
                        "href": "https://console.test.hwclouds.com/rds/#/rds/createInstance",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 607,
                        "key": "rds",
                        "text": "dashbord",
                        "href": "https://console.test.hwclouds.com/rds/#/rds/rdsManagement/dashbord",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 608,
                        "key": "rds",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/rds/#/rds/rdsManagement/dashboard",
                        "type": "endpoint"
                    }]
            },
            {
                "seq_id": 335,
                "id": "bigdata",
                "name": "弹性大数据",
                "shortName": "弹性大数据",
                "created": "2015-07-16 19:25:37",
                "lastModified": "2015-07-16 19:25:37",
                "version": "1.0",
                "catalog": "数据分析",
                "description": "提供大容量的数据存储、查询和分析能力的服务",
                "endpoint": "https://console.test.hwclouds.com/console-emr/",
                "active": true,
                "catalogCss": "analysis",
                "serviceCss": "bigdata",
                "defaultOpen": false,
                "catalogOrder": 7,
                "serviceOrder": 1,
                "links": [{
                    "seqId": 525,
                    "key": "bigdata",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/console-emr/#/createCluster/config",
                    "type": "endpoint"
                },
                    {
                        "seqId": 524,
                        "key": "bigdata",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/bigdata.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 602,
                        "key": "bigdata",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/console-emr/#/manage/overView",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 335,
                "id": "hbase",
                "name": "Hbase",
                "shortName": "Hbase",
                "created": "2015-07-16 19:25:37",
                "lastModified": "2015-07-16 19:25:37",
                "version": "1.0",
                "catalog": "数据分析",
                "description": "提供大容量的数据存储、查询和分析能力的服务",
                "endpoint": "https://console.test.hwclouds.com/console-emr/",
                "active": true,
                "catalogCss": "analysis",
                "serviceCss": "hbase",
                "defaultOpen": false,
                "catalogOrder": 7,
                "serviceOrder": 2,
                "links": [{
                    "seqId": 525,
                    "key": "bigdata",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/console-emr/#/createCluster/config",
                    "type": "endpoint"
                },
                    {
                        "seqId": 524,
                        "key": "bigdata",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/bigdata.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 602,
                        "key": "bigdata",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/console-emr/#/manage/overView",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 335,
                "id": "m-olap",
                "name": "M-OLAP",
                "shortName": "M-OLAP",
                "created": "2015-07-16 19:25:37",
                "lastModified": "2015-07-16 19:25:37",
                "version": "1.0",
                "catalog": "数据分析",
                "description": "提供大容量的数据存储、查询和分析能力的服务",
                "endpoint": "https://console.test.hwclouds.com/console-emr/",
                "active": true,
                "catalogCss": "analysis",
                "serviceCss": "m-olap",
                "defaultOpen": false,
                "catalogOrder": 7,
                "serviceOrder": 3,
                "links": [{
                    "seqId": 525,
                    "key": "bigdata",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/console-emr/#/createCluster/config",
                    "type": "endpoint"
                },
                    {
                        "seqId": 524,
                        "key": "bigdata",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/bigdata.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 602,
                        "key": "bigdata",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/console-emr/#/manage/overView",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 335,
                "id": "hml",
                "name": "机器学习",
                "shortName": "机器学习",
                "created": "2015-07-16 19:25:37",
                "lastModified": "2015-07-16 19:25:37",
                "version": "1.0",
                "catalog": "数据分析",
                "description": "机器学习",
                "endpoint": "https://console.test.hwclouds.com/console-emr/",
                "active": true,
                "catalogCss": "analysis",
                "serviceCss": "hml",
                "defaultOpen": false,
                "catalogOrder": 7,
                "serviceOrder": 4,
                "links": [{
                    "seqId": 525,
                    "key": "bigdata",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/console-emr/#/createCluster/config",
                    "type": "endpoint"
                },
                    {
                        "seqId": 524,
                        "key": "bigdata",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/bigdata.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 602,
                        "key": "bigdata",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/console-emr/#/manage/overView",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 335,
                "id": "stream",
                "name": "实时流计算",
                "shortName": "实时流计算",
                "created": "2015-07-16 19:25:37",
                "lastModified": "2015-07-16 19:25:37",
                "version": "1.0",
                "catalog": "数据分析",
                "description": "实时流计算",
                "endpoint": "https://console.test.hwclouds.com/console-emr/",
                "active": true,
                "catalogCss": "analysis",
                "serviceCss": "stream",
                "defaultOpen": false,
                "catalogOrder": 7,
                "serviceOrder": 5,
                "links": [{
                    "seqId": 525,
                    "key": "bigdata",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/console-emr/#/createCluster/config",
                    "type": "endpoint"
                },
                    {
                        "seqId": 524,
                        "key": "bigdata",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/bigdata.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 602,
                        "key": "bigdata",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/console-emr/#/manage/overView",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 335,
                "id": "datacraft",
                "name": "数据专家服务",
                "shortName": "数据专家服务",
                "created": "2015-07-16 19:25:37",
                "lastModified": "2015-07-16 19:25:37",
                "version": "1.0",
                "catalog": "数据分析",
                "description": "数据专家服务",
                "endpoint": "https://console.test.hwclouds.com/console-emr/",
                "active": true,
                "catalogCss": "analysis",
                "serviceCss": "datacraft",
                "defaultOpen": false,
                "catalogOrder": 7,
                "serviceOrder": 6,
                "links": [{
                    "seqId": 525,
                    "key": "bigdata",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/console-emr/#/createCluster/config",
                    "type": "endpoint"
                },
                    {
                        "seqId": 524,
                        "key": "bigdata",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/bigdata.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 602,
                        "key": "bigdata",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/console-emr/#/manage/overView",
                        "type": "endpoint"
                    }]
            },


            {
                "seq_id": 335,
                "id": "dis",
                "name": "数据接入服务",
                "shortName": "数据接入服务",
                "created": "2015-07-16 19:25:37",
                "lastModified": "2015-07-16 19:25:37",
                "version": "1.0",
                "catalog": "数据分析",
                "description": "数据接入服务",
                "endpoint": "https://console.test.hwclouds.com/console-emr/",
                "active": true,
                "catalogCss": "analysis",
                "serviceCss": "dis",
                "defaultOpen": false,
                "catalogOrder": 7,
                "serviceOrder": 7,
                "links": [{
                    "seqId": 525,
                    "key": "bigdata",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/console-emr/#/createCluster/config",
                    "type": "endpoint"
                },
                    {
                        "seqId": 524,
                        "key": "bigdata",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/bigdata.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 602,
                        "key": "bigdata",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/console-emr/#/manage/overView",
                        "type": "endpoint"
                    }]
            },


            {
                "seq_id": 335,
                "id": "das",
                "name": "数据加速服务",
                "shortName": "数据加速服务",
                "created": "2015-07-16 19:25:37",
                "lastModified": "2015-07-16 19:25:37",
                "version": "1.0",
                "catalog": "数据分析",
                "description": "数据加速服务",
                "endpoint": "https://console.test.hwclouds.com/console-emr/",
                "active": true,
                "catalogCss": "analysis",
                "serviceCss": "das",
                "defaultOpen": false,
                "catalogOrder": 7,
                "serviceOrder": 8,
                "links": [{
                    "seqId": 525,
                    "key": "bigdata",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/console-emr/#/createCluster/config",
                    "type": "endpoint"
                },
                    {
                        "seqId": 524,
                        "key": "bigdata",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/bigdata.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 602,
                        "key": "bigdata",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/console-emr/#/manage/overView",
                        "type": "endpoint"
                    }]
            },



            {
                "seq_id": 271,
                "id": "cae",
                "name": "云应用引擎",
                "shortName": "云应用引擎",
                "created": "2015-06-18 11:46:22",
                "lastModified": "2015-06-18 14:18:39",
                "version": "v1.0",
                "catalog": "企业应用",
                "description": "云应用引擎",
                "endpoint": "https://console.test.hwclouds.com/cae",
                "active": true,
                "catalogCss": "application",
                "serviceCss": "eae",
                "defaultOpen": false,
                "catalogOrder": 8,
                "serviceOrder": 1,
                "links": [{
                    "seqId": 436,
                    "key": "cae",
                    "text": "detail",
                    "href": "http://www.hwclouds.com/product/cae.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 435,
                        "key": "cae",
                        "text": "buy",
                        "href": "https://console.test.hwclouds.com/cae/#/cae/apps/source/source_new",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 238,
                "id": "devcloud",
                "name": "开发云",
                "shortName": "开发云",
                "created": "2015-06-17 18:07:01",
                "lastModified": "2015-07-15 17:17:36",
                "version": "v1.0",
                "catalog": "企业应用",
                "description": "some thing description",
                "endpoint": "https://console.test.hwclouds.com/devcloud",
                "active": true,
                "catalogCss": "eapp",
                "serviceCss": "devcloud",
                "defaultOpen": true,
                "catalogOrder": 8,
                "serviceOrder": 2,
                "links": [{
                    "seqId": 449,
                    "key": "devcloud",
                    "text": "detail",
                    "href": "http://www.hwclouds.com/product/devcloud.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 600,
                        "key": "devcloud",
                        "text": "list",
                        "href": "https://console.test.hwclouds.com/devcloud",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 271,
                "id": "dms",
                "name": "分布式消息服务",
                "shortName": "分布式消息服务",
                "created": "2015-06-18 11:46:22",
                "lastModified": "2015-06-18 14:18:39",
                "version": "v1.0",
                "catalog": "企业应用",
                "description": "分布式消息服务",
                "endpoint": "https://console.test.hwclouds.com/cae",
                "active": true,
                "catalogCss": "application",
                "serviceCss": "dms",
                "defaultOpen": false,
                "catalogOrder": 8,
                "serviceOrder": 3,
                "links": [{
                    "seqId": 436,
                    "key": "cae",
                    "text": "detail",
                    "href": "http://www.hwclouds.com/product/cae.html",
                    "type": "endpoint"
                },
                    {
                        "seqId": 435,
                        "key": "cae",
                        "text": "buy",
                        "href": "https://console.test.hwclouds.com/cae/#/cae/apps/source/source_new",
                        "type": "endpoint"
                    }]
            },


            {
                "seq_id": 373,
                "id": "dec",
                "name": "专属云",
                "shortName": "专属云",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "专属云",
                "description": "专属云（DeC--Dedicated Cloud）是从物理上隔离的专属虚拟化资源池",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/dec/homepage",
                "active": true,
                "catalogCss": "dec",
                "serviceCss": "dec",
                "defaultOpen": false,
                "catalogOrder": 9,
                "serviceOrder": 1,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 373,
                "id": "projectman",
                "name": "项目管理",
                "shortName": "项目管理",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "开发工具",
                "description": "项目管理",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/dec/homepage",
                "active": true,
                "catalogCss": "developkits",
                "serviceCss": "projectman",
                "defaultOpen": false,
                "catalogOrder": 10,
                "serviceOrder": 1,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 373,
                "id": "codehub",
                "name": "配置管理",
                "shortName": "配置管理",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "开发工具",
                "description": "配置管理",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/dec/homepage",
                "active": true,
                "catalogCss": "developkits",
                "serviceCss": "codehub",
                "defaultOpen": false,
                "catalogOrder": 10,
                "serviceOrder": 2,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 373,
                "id": "codeci",
                "name": "编译服务",
                "shortName": "编译服务",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "开发工具",
                "description": "编译服务",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/dec/homepage",
                "active": true,
                "catalogCss": "developkits",
                "serviceCss": "codeci",
                "defaultOpen": false,
                "catalogOrder": 10,
                "serviceOrder": 3,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 373,
                "id": "codeci2",
                "name": "构建服务",
                "shortName": "构建服务",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "开发工具",
                "description": "构建服务",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/dec/homepage",
                "active": true,
                "catalogCss": "developkits",
                "serviceCss": "codeci2",
                "defaultOpen": false,
                "catalogOrder": 10,
                "serviceOrder": 4,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 373,
                "id": "codecheck",
                "name": "代码检查",
                "shortName": "代码检查",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "开发工具",
                "description": "代码检查",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/dec/homepage",
                "active": true,
                "catalogCss": "developkits",
                "serviceCss": "codecheck",
                "defaultOpen": false,
                "catalogOrder": 10,
                "serviceOrder": 5,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 373,
                "id": "testman",
                "name": "测试管理",
                "shortName": "测试管理",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "开发工具",
                "description": "测试管理",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/dec/homepage",
                "active": true,
                "catalogCss": "developkits",
                "serviceCss": "testman",
                "defaultOpen": false,
                "catalogOrder": 10,
                "serviceOrder": 6,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 373,
                "id": "eab",
                "name": "弹性接入带宽",
                "shortName": "弹性接入带宽",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "弹性计算",
                "description": "弹性接入带宽",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/dec/homepage",
                "active": true,
                "catalogCss": "compute",
                "serviceCss": "eab",
                "defaultOpen": false,
                "catalogOrder": 1,
                "serviceOrder": 8,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 373,
                "id": "crs",
                "name": "云报表服务",
                "shortName": "云报表服务",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "管理与部署",
                "description": "云报表服务",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/dec/homepage",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "crs",
                "defaultOpen": false,
                "catalogOrder": 5,
                "serviceOrder": 5,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 375,
                "id": "deh",
                "name": "专属主机",
                "shortName": "专属主机",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "弹性计算",
                "description": "智能报表服务",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/dec/homepage",
                "active": true,
                "catalogCss": "compute",
                "serviceCss": "crs",
                "defaultOpen": false,
                "catalogOrder": 1,
                "serviceOrder": 9,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 375,
                "id": "cpl",
                "name": "流水线",
                "shortName": "流水线",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "软件开发云",
                "description": "流水线",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "developkits",
                "serviceCss": "cpl",
                "defaultOpen": false,
                "catalogOrder": 10,
                "serviceOrder": 11,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 376,
                "id": "dem",
                "name": "部署服务",
                "shortName": "部署服务",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "软件开发云",
                "description": "部署服务",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "developkits",
                "serviceCss": "dem",
                "defaultOpen": false,
                "catalogOrder": 10,
                "serviceOrder": 12,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 376,
                "id": "MobileTest",
                "name": "移动应用测试",
                "shortName": "移动应用测试",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "软件开发云",
                "description": "移动应用测试",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "developkits",
                "serviceCss": "MobileTest",
                "defaultOpen": false,
                "catalogOrder": 10,
                "serviceOrder": 13,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 377,
                "id": "ars",
                "name": "程序运行认证",
                "shortName": "程序运行认证",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "安全",
                "description": "程序运行认证",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "ars",
                "defaultOpen": false,
                "catalogOrder": 4,
                "serviceOrder": 6,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 378,
                "id": "ssa",
                "name": "安全态势感知",
                "shortName": "安全态势感知",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "安全",
                "description": "安全态势感知",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "ssa",
                "defaultOpen": false,
                "catalogOrder": 4,
                "serviceOrder": 7,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 379,
                "id": "pcop",
                "name": "合作伙伴产品中心",
                "shortName": "合作伙伴产品中心",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "安全",
                "description": "合作伙伴产品中心",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "pcop",
                "defaultOpen": false,
                "catalogOrder": 4,
                "serviceOrder": 8,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 379,
                "id": "css",
                "name": "Cloud Security Status",
                "shortName": "Cloud Security Status",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "安全",
                "description": "Cloud Security Status",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "css",
                "defaultOpen": false,
                "catalogOrder": 4,
                "serviceOrder": 9,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 379,
                "id": "cvc",
                "name": "云视频会议",
                "shortName": "云视频会议",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "应用服务",
                "description": "云视频会议",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "application",
                "serviceCss": "cvc",
                "defaultOpen": false,
                "catalogOrder": 5,
                "serviceOrder": 6,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 380,
                "id": "scs",
                "name": "证书管理服务",
                "shortName": "证书管理服务",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "安全",
                "description": "证书管理服务",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "scs",
                "defaultOpen": false,
                "catalogOrder": 4,
                "serviceOrder": 9,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 381,
                "id": "ccs",
                "name": "云目录服务",
                "shortName": "云目录服务",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "管理与部署",
                "description": "云目录服务",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "ccs",
                "defaultOpen": false,
                "catalogOrder": 5,
                "serviceOrder": 3,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 381,
                "id": "tms",
                "name": "标签管理服务",
                "shortName": "标签管理服务",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "管理与部署",
                "description": "标签管理服务",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "tms",
                "defaultOpen": false,
                "catalogOrder": 5,
                "serviceOrder": 5,
                "links": [{
                    "seqId": 570,
                    "key": "tms",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "tms",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "tms",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "tms",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 381,
                "id": "dds",
                "name": "文档数据库服务",
                "shortName": "文档数据库服务",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "数据库",
                "description": "文档数据库服务",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "database",
                "serviceCss": "dds",
                "defaultOpen": false,
                "catalogOrder": 7,
                "serviceOrder": 3,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 386,
                "id": "dws",
                "name": "数据仓库服务",
                "shortName": "数据仓库服务",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "数据库",
                "description": "数据仓库服务",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "database",
                "serviceCss": "dws",
                "defaultOpen": false,
                "catalogOrder": 7,
                "serviceOrder": 4,
                "links": [{
                    "seqId": 570,
                    "key": "dws",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dws",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dws",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dws",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 378,
                "id": "servicestage",
                "name": "微服务云应用平台",
                "shortName": "微服务云应用平台",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "应用服务",
                "description": "微服务云应用平台",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "servicestage",
                "defaultOpen": false,
                "catalogOrder": 5,
                "serviceOrder": 8,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 378,
                "id": "drds",
                "name": "分布式关系型数据库服务",
                "shortName": "分布式关系型数据库服务",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "数据库",
                "description": "分布式关系型数据库服务",
                "endpoint": "https://console.hwclouds.com/devcloud/#/pipeline/manager/pipelineList",
                "active": true,
                "catalogCss": "security",
                "serviceCss": "drds",
                "defaultOpen": false,
                "catalogOrder": 7,
                "serviceOrder": 5,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            },

            {
                "seq_id": 373,
                "id": "releaseman",
                "name": "发布管理服务 ",
                "shortName": "发布管理服务 ",
                "created": "2015-07-21 14:28:51",
                "lastModified": "2015-07-21 14:28:51",
                "version": "v1.0",
                "catalog": "开发工具",
                "description": "发布管理服务 ",
                "endpoint": "https://console.test.hwclouds.com/ecm/#/dec/homepage",
                "active": true,
                "catalogCss": "developkits",
                "serviceCss": "releaseman",
                "defaultOpen": false,
                "catalogOrder": 10,
                "serviceOrder": 7,
                "links": [{
                    "seqId": 570,
                    "key": "dec",
                    "text": "buy",
                    "href": "https://console.test.hwclouds.com/ecm/#/dec/apply",
                    "type": "endpoint"
                },
                    {
                        "seqId": 572,
                        "key": "dec",
                        "text": "open",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 571,
                        "key": "dec",
                        "text": "detail",
                        "href": "http://www.hwclouds.com/product/dec.html",
                        "type": "endpoint"
                    },
                    {
                        "seqId": 596,
                        "key": "dec",
                        "text": "dashboard",
                        "href": "https://console.test.hwclouds.com/ecm/#/dec/manager/nodeList",
                        "type": "endpoint"
                    }]
            }],
        "total":50
  };

    var endpointsEn = {"endpoints":[{"seq_id":19999999993,"id":"home","name":"home","shortName":"home","created":"2015-05-27 19:48:24","lastModified":"2015-06-04 20:11:11","version":"v1.0","endpoint":"https://10.174.49.16/console","active":true,"defaultOpen":false,"catalogOrder":0,"serviceOrder":0,"links":[]},
        {"seq_id":263,"id":"ecm","name":"Elastic Cloud Server","shortName":"ECS","created":"2015-07-09 19:36:08","lastModified":"2015-07-09 19:36:08","version":"v1.0","catalog":"Compute","description":"云主机提供弹性计算能力，按需使用","endpoint":"https://10.174.49.16/ecm/#/ecs/manager/vmList","active":true,"catalogCss":"compute","serviceCss":"ecm","defaultOpen":false,"catalogOrder":1,"serviceOrder":1,"links":[{"seqId":267,"key":"ecm","text":"buy","iconName":"buy","href":"https://10.174.49.16/ecm/#/ecs/createVm","type":"endpoint"},{"seqId":268,"key":"ecm","text":"detail","iconName":"detail","href":"http://www.hwclouds.com/product/ecs.html","type":"endpoint"},{"seqId":445,"key":"ecm","text":"list","iconName":"detail","href":"https://10.174.49.16/ecm/#/ecs/manager/vmList","type":"endpoint"}]},
        {"seq_id":293,"id":"bms","name":"Bare Metal Server","shortName":"BMS","created":"2015-07-09 19:36:08","lastModified":"2015-07-09 19:36:08","version":"v1.0","catalog":"Compute","description":"云主机提供弹性计算能力，按需使用","endpoint":"https://10.174.49.16/ecm/#/ecs/manager/vmList","active":true,"catalogCss":"compute","serviceCss":"bms","defaultOpen":false,"catalogOrder":1,"serviceOrder":9,"links":[{"seqId":267,"key":"ecm","text":"buy","iconName":"apply","href":"https://10.174.49.16/ecm/#/ecs/createVm","type":"endpoint"},{"seqId":268,"key":"ecm","text":"detail","iconName":"detail","href":"http://www.hwclouds.com/product/ecs.html","type":"endpoint"},{"seqId":445,"key":"ecm","text":"list","iconName":"detail","href":"https://10.174.49.16/ecm/#/ecs/manager/vmList","type":"endpoint"}]},
        {"seq_id":264,"id":"ess","name":"Auto Scaling","shortName":"AS","created":"2015-07-09 19:37:24","lastModified":"2015-07-09 19:37:24","version":"v1.0","catalog":"Compute","description":"提供自动调整其弹性计算资源的管理服务","endpoint":"https://10.174.49.16/ecm/#/as/manager/groupList","active":true,"catalogCss":"compute","serviceCss":"ess","defaultOpen":false,"catalogOrder":1,"serviceOrder":2,"links":[{"seqId":443,"key":"ess","text":"list","iconName":"detail","href":"https://10.174.49.16:443/ecm/#/as/manager/groupList","type":"endpoint"},{"seqId":260,"key":"ess","text":"detail","iconName":"detail","href":"http://www.hwclouds.com/product/as.html","type":"endpoint"},{"seqId":261,"key":"ess","text":"buy","iconName":"apply","href":"https://10.174.49.16:443/ecm/#/as/createGroup","type":"endpoint"}]},{"seq_id":266,"id":"ims","name":"Image Management Service","shortName":"IMS","created":"2015-07-09 19:38:36","lastModified":"2015-07-09 19:38:36","version":"v1.0","catalog":"Compute","description":"提供自助制作镜像以及镜像的管理服务","endpoint":"https://10.174.49.16/ecm/#/ims/manager/imageList/publicImage","active":true,"catalogCss":"compute","serviceCss":"ims","defaultOpen":false,"catalogOrder":1,"serviceOrder":3,"links":[{"seqId":266,"key":"ims","text":"buy","iconName":"buy","href":"https://10.174.49.16/ecm/#/ims/createImage","type":"endpoint"},{"seqId":446,"key":"ims","text":"list","iconName":"detail","href":"https://10.174.49.16/ecm/#/ims/manager/imageList/selfImage","type":"endpoint"},{"seqId":269,"key":"ims","text":"detail","iconName":"detail","href":"http://www.hwclouds.com/product/ims.html","type":"endpoint"}]},{"seq_id":254,"id":"dbs","name":"Elastic Volume Service","shortName":"EVS","created":"2015-06-30 03:15:38","lastModified":"2015-06-30 03:15:38","version":"v1.0","catalog":"Storage","description":"Elastic Volume Service","endpoint":"https://10.174.49.16/ecm/#/evs/manager/volumelist","active":true,"catalogCss":"storage","serviceCss":"dbs","defaultOpen":false,"catalogOrder":2,"serviceOrder":1,"links":[{"seqId":252,"key":"dbs","text":"buy","href":"https://10.174.49.16/ecm/#/evs/createvolume","type":"endpoint"},{"seqId":441,"key":"dbs","text":"list","href":"https://10.174.49.16/ecm/#/evs/manager/volumelist","type":"endpoint"},{"seqId":251,"key":"dbs","text":"detail","href":"http://www.hwclouds.com/product/evs.html","type":"endpoint"}]},{"seq_id":256,"id":"bks","name":"Volume Backup Service","shortName":"VBS","created":"2015-06-30 03:18:37","lastModified":"2015-06-30 03:18:37","version":"v1.0","catalog":"Storage","description":"Volume Backup Service","endpoint":"https://10.174.49.16/ecm/#/vbs/manager/backuplist","active":true,"catalogCss":"storage","serviceCss":"vbs","defaultOpen":false,"catalogOrder":2,"serviceOrder":2,"links":[{"seqId":253,"key":"bks","text":"detail","href":"https://10.174.49.16/ecm/#/vbs/manager/backuplist","type":"endpoint"},{"seqId":442,"key":"bks","text":"list","href":"https://10.174.49.16/ecm/#/vbs/manager/backuplist","type":"endpoint"},{"seqId":254,"key":"bks","text":"buy","iconName":"apply","href":"https://10.174.49.16/ecm/#/vbs/createBackup","type":"endpoint"}]},{"seq_id":338,"id":"obs_en","name":"Object Storage Service","shortName":"OBS","created":"2015-07-17 00:46:14","lastModified":"2015-07-17 00:46:14","version":"v1.0","catalog":"Storage","description":"Object Storage Service","endpoint":"https://10.174.49.16/obs","active":true,"catalogCss":"storage","serviceCss":"obs","defaultOpen":true,"catalogOrder":2,"serviceOrder":3,"links":[{"seqId":375,"key":"obs_en","text":"detail","iconName":"detail","href":"https://10.174.49.16/obs","type":"endpoint"},{"seqId":451,"key":"obs_en","text":"list","iconName":"detail","href":"https://10.174.49.16/obs","type":"endpoint"}]},{"seq_id":149,"id":"vpc","name":"Virtual Private Cloud","shortName":"VPC","created":"2015-06-25 10:01:51","lastModified":"2015-06-25 10:01:51","version":"v1.0","catalog":"Network","description":"虚拟私有云","endpoint":"https://10.174.49.16/vpc","active":true,"catalogCss":"network","serviceCss":"vpc","defaultOpen":false,"catalogOrder":3,"serviceOrder":1,"links":[{"seqId":182,"key":"vpc","text":"detail","iconName":"detail","href":"http://www.hwclouds.com/product/vpc.html","type":"endpoint"},{"seqId":181,"key":"vpc","text":"buy","iconName":"apply","href":"https://10.174.49.16/vpc/#/vpc/createVpc","type":"endpoint"},{"seqId":460,"key":"vpc","text":"list","iconName":"detail","href":"https://10.174.49.16/vpc/#/vpc/vpcmanager/vpcs","type":"endpoint"}]},{"seq_id":150,"id":"elb","name":"Elastic Load Balance","shortName":"ELB","created":"2015-06-25 10:02:24","lastModified":"2015-07-15 05:57:56","version":"v1.0","catalog":"Network","description":"提供公有云的流量负载分发","endpoint":"https://10.174.49.16/ecm/#/elb/manager/elbList","active":true,"catalogCss":"network","serviceCss":"elb","defaultOpen":false,"catalogOrder":3,"serviceOrder":2,"links":[{"seqId":183,"key":"elb","text":"detail","iconName":"detail","href":"http://www.hwclouds.com/product/elb.html","type":"endpoint"},{"seqId":184,"key":"elb","text":"buy","iconName":"apply","href":"https://10.174.49.16/ecm/#/elb/createElb","type":"endpoint"},{"seqId":461,"key":"elb","text":"list","iconName":"detail","href":"https://10.174.49.16/ecm/#/elb/manager/elbList","type":"endpoint"}]},{"seq_id":69,"id":"webscan","name":"Web Scan","shortName":"Web Scan","created":"2015-06-25 06:52:42","lastModified":"2015-06-25 06:52:42","version":"v1.0","catalog":"Security","description":"Web Vulnerability Scanning","endpoint":"https://10.174.49.16/scc/#/webscan","active":true,"catalogCss":"security","serviceCss":"webscan","defaultOpen":true,"catalogOrder":4,"serviceOrder":1,"links":[{"seqId":96,"key":"webscan","text":"detail","href":"https://10.174.49.16/scc/#/webscan","type":"endpoint"},{"seqId":454,"key":"webscan","text":"list","href":"https://10.174.49.16/scc/#/webscan","type":"endpoint"}]},{"seq_id":70,"id":"waf","name":"Web Application Firewall","shortName":"WAF","created":"2015-06-25 06:52:53","lastModified":"2015-06-25 06:52:53","version":"v1.0","catalog":"Security","description":"Web Application Firewall","endpoint":"https://10.174.49.16/scc/#/waf","active":true,"catalogCss":"security","serviceCss":"waf","defaultOpen":true,"catalogOrder":4,"serviceOrder":2,"links":[{"seqId":95,"key":"waf","text":"detail","href":"https://10.174.49.16/scc/#/waf","type":"endpoint"},{"seqId":453,"key":"waf","text":"list","href":"https://10.174.49.16/scc/#/waf","type":"endpoint"}]},{"seq_id":68,"id":"antiddos","name":"Anti-DDoS","shortName":"AntiDDoS","created":"2015-06-25 06:52:31","lastModified":"2015-06-25 06:52:31","version":"v1.0","catalog":"Security","description":"Anti-DDoS Traffic Cleaning","endpoint":"https://10.174.49.16/scc","active":true,"catalogCss":"security","serviceCss":"antiddos","defaultOpen":true,"catalogOrder":4,"serviceOrder":3,"links":[{"seqId":97,"key":"antiddos","text":"detail","href":"https://10.174.49.16/scc/","type":"endpoint"},{"seqId":455,"key":"antiddos","text":"list","href":"https://10.174.49.16/scc/","type":"endpoint"}]},{"seq_id":151,"id":"ces","name":"Cloud Eye","shortName":"CES","created":"2015-06-25 10:02:59","lastModified":"2015-06-25 10:02:59","version":"v1.0","catalog":"Mgnt&Deployment","description":"Cloud Eye","endpoint":"https://10.174.49.16/ces","active":true,"catalogCss":"manager","serviceCss":"ces","defaultOpen":true,"catalogOrder":5,"serviceOrder":1,"links":[{"seqId":185,"key":"ces","text":"detail","iconName":"detail","href":"http://www.hwclouds.com/product/ces.html","type":"endpoint"},{"seqId":462,"key":"ces","text":"list","iconName":"detail","href":"https://10.174.49.16/ces#ces/manager/dashboard","type":"endpoint"}]},{"seq_id":371,"id":"rds","name":"Relational Database Service","shortName":"RDS","created":"2015-07-18 23:18:31","lastModified":"2015-07-18 23:18:31","version":"v1.0","catalog":"Database","description":"RDS is short for Relational Database Service.","endpoint":"https://10.174.49.16/rds","active":true,"serviceCss":"rds","defaultOpen":false,"catalogOrder":6,"serviceOrder":1,"links":[{"seqId":407,"key":"rds","text":"buy","href":"https://10.174.49.16/rds/#/rds/createInstance","type":"endpoint"},{"seqId":452,"key":"rds","text":"list","href":"https://10.174.49.16/rds/# /rds/rdsManagement/dashboard","type":"endpoint"},{"seqId":408,"key":"rds","text":"detail","href":"http://www.hwclouds.com/product/rds.html","type":"endpoint"}]},{"seq_id":201,"id":"bigdata","name":"Elastic BigData Service","shortName":"BigData","created":"2015-06-25 23:30:27","lastModified":"2015-07-15 17:23:02","version":"1.0","catalog":"Data Analysis","description":"Storage, query, and analysis for big data is made available.","endpoint":"https://10.174.49.16/console-emr/","active":true,"catalogCss":"analysis","serviceCss":"bigdata","defaultOpen":false,"catalogOrder":7,"serviceOrder":1,"links":[{"seqId":190,"key":"bigdata","text":"buy","href":"https://10.174.49.16/console-emr/#/createCluster/config","type":"endpoint"},{"seqId":449,"key":"bigdata","text":"list","href":"https://10.174.49.16/console-emr/#/manage/overView","type":"endpoint"},{"seqId":189,"key":"bigdata","text":"detail","href":"http://www.hwclouds.com/product/bigdata.html","type":"endpoint"}]},{"seq_id":71,"id":"cae","name":"Cloud Application Engine","shortName":"CAE","created":"2015-06-25 07:08:01","lastModified":"2015-07-15 17:25:09","version":"1.0","catalog":"Enterprise Applications","description":"Cloud App Engine","endpoint":"https://10.174.49.16/cae/","active":true,"catalogCss":"eapp","serviceCss":"eae","defaultOpen":false,"catalogOrder":8,"serviceOrder":1,"links":[{"seqId":83,"key":"cae","text":"buy","iconName":"buy","href":"https://10.174.49.16/cae/#/cae/apps/source/source_new","type":"endpoint"},{"seqId":448,"key":"cae","text":"list","iconName":"detail","href":"https://10.174.49.16/cae/#/cae/apps/dashboard","type":"endpoint"},{"seqId":84,"key":"cae","text":"detail","iconName":"detail","href":"http://www.hwclouds.com/product/cae.html","type":"endpoint"}]},{"seq_id":240,"id":"dec","name":"Dedicated Cloud","shortName":"DeC","created":"2015-06-28 01:03:40","lastModified":"2015-06-28 01:03:40","version":"v1.0","catalog":"Dedicated Cloud","description":"A Dedicated Cloud (DeC) is a dedicated resource pool that provides virtual resources and is isolated from physical devices.","endpoint":"https://10.174.49.16/ecm/#/dec/manager/nodeList","active":true,"catalogCss":"dec","serviceCss":"dec","defaultOpen":false,"catalogOrder":9,"serviceOrder":1,"links":[{"seqId":103,"key":"dec","text":"buy","href":"https://10.174.49.16/ecm/#/dec/apply","type":"endpoint"},{"seqId":105,"key":"dec","text":"open","href":"https://10.174.49.16/ecm/#/dec/manager/nodeList","type":"endpoint"},{"seqId":104,"key":"dec","text":"detail","href":"http://www.hwclouds.com/product/dec.html","type":"endpoint"},{"seqId":456,"key":"dec","text":"list","href":"https://10.174.49.16/ecm#/dec/manager/nodeList","type":"endpoint"}]}],"total":17};

    var favoriteEndpoints = {
        "endpointCollects" : [{
            "endpointId" : "ecm",
            "shortName" : "ECS",
            "endpoint" : "https://10.174.49.16/ecm/#/ecs/manager/vmList",
            "name" : "云主机"
        }, {
            "endpointId" : "ess",
            "shortName" : "AS",
            "endpoint" : "https://10.174.49.16/ecm/#/as/manager/groupList",
            "name" : "弹性伸缩"
        }, {
            "endpointId" : "ims",
            "shortName" : "IMS",
            "endpoint" : "https://10.174.49.16/ecm/#/ims/manager/imageList/publicImage",
            "name" : "镜像"
        }, {
            "endpointId" : "elb",
            "shortName" : "ELB",
            "endpoint" : "https://10.174.49.16/ecm/#/ims/manager/imageList/publicImage",
            "name" : "镜像"
        }, {
            "endpointId" : "ces",
            "shortName" : "ECS",
            "endpoint" : "https://10.174.49.16/ecm/#/ecs/manager/vmList",
            "name" : "云主机"
        }, {
            "endpointId" : "iam",
            "shortName" : "AS",
            "endpoint" : "https://10.174.49.16/ecm/#/as/manager/groupList",
            "name" : "弹性伸缩"
        }, {
            "endpointId" : "bigdata",
            "shortName" : "IMS",
            "endpoint" : "https://10.174.49.16/ecm/#/ims/manager/imageList/publicImage",
            "name" : "镜像"
        }, {
            "endpointId" : "rds",
            "shortName" : "ELB",
            "endpoint" : "https://10.174.49.16/ecm/#/ims/manager/imageList/publicImage",
            "name" : "镜像"
        }
        ]
    };

    var favoriteEndpointsEn = {
        "endpointCollects" : [{
            "endpointId" : "ims",
            "shortName" : "IMS",
            "endpoint" : "https://10.174.49.16/ecm/#/ims/manager/imageList/publicImage",
            "name" : "Image Management Service"
        }, {
            "endpointId" : "dbs",
            "shortName" : "EVS",
            "endpoint" : "https://10.174.49.16/ecm/#/evs/manager/volumelist",
            "name" : "Elastic Volume Service"
        }, {
            "endpointId" : "ecm",
            "shortName" : "IMS",
            "endpoint" : "https://10.174.49.16/ecm/#/ims/manager/imageList/publicImage",
            "name" : "Image Management Service"
        }, {
            "endpointId" : "ces",
            "shortName" : "EVS",
            "endpoint" : "https://10.174.49.16/ecm/#/evs/manager/volumelist",
            "name" : "Elastic Volume Service"
        }, {
            "endpointId" : "iam",
            "shortName" : "IMS",
            "endpoint" : "https://10.174.49.16/ecm/#/ims/manager/imageList/publicImage",
            "name" : "Image Management Service"
        }, {
            "endpointId" : "obs",
            "shortName" : "EVS",
            "endpoint" : "https://10.174.49.16/ecm/#/evs/manager/volumelist",
            "name" : "Elastic Volume Service"
        }, {
            "endpointId" : "rds",
            "shortName" : "IMS",
            "endpoint" : "https://10.174.49.16/ecm/#/ims/manager/imageList/publicImage",
            "name" : "Image Management Service"
        }, {
            "endpointId" : "bigdata",
            "shortName" : "EVS",
            "endpoint" : "https://10.174.49.16/ecm/#/evs/manager/volumelist",
            "name" : "Elastic Volume Service"
        }
        ]
    };


    var regions = {"regions":[{"seqId":1000008,"id":"eastchina","name":"Magdeburg","created":"2015-05-30 18:10:15","lastModified":"2015-05-30 18:10:15","locale":"zh-CN","active":true},{"seqId":1000010,"id":"northchina","name":"Biere","created":"2015-05-30 18:12:24","lastModified":"2015-05-30 18:12:24","locale":"zh-CN","active":true},{"seqId":1000011,"id":"westchina","name":"SS","created":"2015-05-30 18:12:24","lastModified":"2015-05-30 18:12:24","locale":"zh-CN","active":false}],"total":3};

    var messages = {"messages":[{type:"公告", url: "0001", content: "华南地区优惠活动111111111111111111111111111", time: "2015-12-03 21:18:35"}, {type:"公告", url: "0002", content: "华南地区优惠活动112", time: "2015-12-03 21:18:35"}, {type:"公告", url: "0003", content: "华南地区优惠活动11333", time: "2015-12-03 21:18:35"}], "total":100};
    //var messages = {"messages": []};
    var links = {"links":[{"seqId":4,"key":"rds","text":"detail","href":"https://10.174.49.16/rds/#/rds/rdsManagement/dashboard","type":"endpoint"},{"seqId":5,"key":"rds","text":"buy","href":"https://10.174.49.16/rds/#/rds/createInstance","type":"endpoint"},{"seqId":18,"key":"old_console_home","text":"old console","href":"https://oldconsole.hwclouds.com","type":"link"},{"seqId":251,"key":"dbs","text":"detail","href":"https://10.174.49.16/ecm/#/evs/manager/volumelist","type":"endpoint"},{"seqId":252,"key":"dbs","text":"buy","href":"https://10.174.49.16/ecm/#/evs/createvolume","type":"endpoint"},{"seqId":253,"key":"bks","text":"detail","href":"https://10.174.49.16/ecm/#/vbs/manager/backuplist","type":"endpoint"},{"seqId":254,"key":"bks","text":"buy","href":"https://10.174.49.16/ecm/#/vbs/createBackup","type":"endpoint"},{"seqId":255,"key":"help_center","text":"帮助中心","iconName":"support","href":"https://support.huawei.com","type":"common"},{"seqId":236,"key":"portal","text":"portal","iconName":"portal","href":"https://publiccloud.huawei.com","type":"common"},{"seqId":36,"key":"user_center","text":"用户中心","iconName":"user_center","href":"https://10.174.49.16/usercenter","type":"common"},{"seqId":37,"key":"message_list","text":"消息中心","iconName":"message_list","href":"https://10.174.49.16/messagecenter","type":"message_center"},{"seqId":40,"key":"billing","text":"消费详单","iconName":"iconName","href":"https://10.174.49.16/usercenter/#/userindex/consumeDetails","type":"userCenter"},{"seqId":42,"key":"workOrder","text":"工单列表","iconName":"iconName","href":"https://10.174.49.16/usercenter/#/userindex/customerfeedback","type":"userCenter"},{"seqId":43,"key":"message_center","text":"消息中心","iconName":"email","href":"https://10.174.49.16/messagecenter","type":"common"},{"seqId":51,"key":"recharge","text":"充值","iconName":"iconName","href":"https://10.174.49.16/usercenter/#/userindex/balanceRecharge","type":"userCenter"},{"seqId":55,"key":"bigdata","text":"detail","href":"https://10.174.49.16/console-emr/#/manage/overView","type":"detail"},{"seqId":56,"key":"bigdata","text":"detail","href":"https://10.174.49.16/console-emr/#/createCluster/config","type":"buy"},{"seqId":61,"key":"devcloud","text":"detail","href":"https://10.174.49.16/devconsole","type":"endpoint"},{"seqId":71,"key":"order_list","text":"我的订单","iconName":"user_order","href":"https://10.174.49.16:444/order/catalog/cur","type":"user_center"},{"seqId":72,"key":"unpay_order","text":"未付订单","iconName":"iconName","href":"https://10.174.49.16:444/order/order/orderlist","type":"userCenter"},{"seqId":83,"key":"cae","text":"buy","iconName":"buy","href":"https://10.174.49.16/cae/#/cae/apps/source/source_new","type":"endpoint"},{"seqId":84,"key":"cae","text":"detail","iconName":"detail","href":"https://10.174.49.16/cae/#/cae/apps/dashboard","type":"endpoint"},{"seqId":186,"key":"obs_en","text":"detail","iconName":"detail","href":"https://10.174.49.16/obs","type":"endpoint"},{"seqId":100,"key":"obs_zh","text":"detail","iconName":"详情","href":"https://10.174.49.16/obs","type":"endpoint"},{"seqId":189,"key":"bigdata","text":"detail","href":"https://10.174.49.16/console-emr/#/manage/overView","type":"endpoint"},{"seqId":103,"key":"dec","text":"buy","href":"https://10.174.49.16/ecm/#/dec/apply","type":"endpoint"},{"seqId":95,"key":"waf","text":"detail","href":"https://10.174.49.16/scc/#/waf","type":"endpoint"},{"seqId":96,"key":"webscan","text":"detail","href":"https://10.174.49.16/scc/#/webscan","type":"endpoint"},{"seqId":97,"key":"antiddos","text":"detail","href":"https://10.174.49.16/scc/","type":"endpoint"},{"seqId":104,"key":"dec","text":"detail","href":"https://10.174.49.16/ecm#/dec/manager/nodeList","type":"endpoint"},{"seqId":105,"key":"dec","text":"open","href":"https://10.174.49.16/ecm/#/dec/manager/nodeList","type":"endpoint"},{"seqId":137,"key":"waf1","text":"detail","href":"https://10.174.49.16/scc/#/waf","type":"endpoint"},{"seqId":138,"key":"webscan1","text":"detail","href":"https://10.174.49.16/scc/#/webscan","type":"endpoint"},{"seqId":139,"key":"antiddos1","text":"detail","href":"https://10.174.49.16/scc","type":"endpoint"},{"seqId":140,"key":"ess","text":"detail","iconName":"detail","href":"https://10.174.49.16:443/ecm/#/as/manager/groupList","type":"endpoint"},{"seqId":174,"key":"ims","text":"buy","iconName":"buy","href":"https://10.174.49.16/ecm/#/ims/createImage","type":"endpoint"},{"seqId":175,"key":"ecm","text":"buy","iconName":"buy","href":"https://10.174.49.16/ecm/#/ecs/createVm","type":"endpoint"},{"seqId":176,"key":"ecm","text":"detail","iconName":"detail","href":"https://10.174.49.16/ecm/#/ecs/manager/vmList","type":"endpoint"},{"seqId":177,"key":"ess","text":"detail","iconName":"detail","href":"https://10.174.49.16:443/ecm/#/as/manager/groupList","type":"endpoint"},{"seqId":178,"key":"ess","text":"buy","iconName":"buy","href":"https://10.174.49.16:443/ecm/#/as/createGroup","type":"endpoint"},{"seqId":181,"key":"vpc","text":"buy","iconName":"buy","href":"https://10.174.49.16/vpc/#/vpc/createVpc","type":"endpoint"},{"seqId":182,"key":"vpc","text":"detail","iconName":"detail","href":"https://10.174.49.16/vpc/#/vpc/vpcmanager/vpcs","type":"endpoint"},{"seqId":183,"key":"elb","text":"detail","iconName":"detail","href":"https://10.174.49.16/ecm/#/elb/manager/elbList","type":"endpoint"},{"seqId":184,"key":"elb","text":"buy","iconName":"buy","href":"https://10.174.49.16/ecm/#/elb/createElb","type":"endpoint"},{"seqId":185,"key":"ces","text":"detail","iconName":"detail","href":"https://10.174.49.16/ces#ces/manager/dashboard","type":"endpoint"},{"seqId":190,"key":"bigdata","text":"buy","href":"https://10.174.49.16/console-emr/#/createCluster/config","type":"endpoint"},{"seqId":228,"key":"iam","text":"detail","href":"https://10.174.49.16/iam","type":"endpoint"},{"seqId":231,"key":"user_credential","text":"user_credential","href":"https://10.174.49.16/iam/#/myCredential","type":"iam"},{"seqId":233,"key":"assume_role","text":"assumeRole","href":"https://10.174.49.16/iam/#/switchRole","type":"iam"},{"seqId":188,"key":"ims","text":"detail","iconName":"detail","href":"https://10.174.49.16/ecm/#/ims/manager/imageList/selfImage","type":"endpoint"}]};

    var user = {"projectId":"087090c648064e0a8d8c243780ad91bf", "domainId":"207dd6e03292481bb74318e76bcd64fa","id":"d324524ce04b41858e6689f41dfcd4fe","name":"Stephan","region":"eastchina","roles":["te_admin","op_legacy","secu_admin","op_gated_RDS_GC666666","op_gated_vpn","op_gated_GC321","op_op_gated_vpn","op_gated_RDS_GC8888","op_gated_vbs","op_gated_shared_bandwitdh","op_gated_cae","op_gated_quickdeploy","op_cred", "op_suspended"],"userVersion":"new", "nonsupportRegions":["cn-northeast-1", "DeC", "westchina"]};

    var assumeRoles = {
        "account": {
            //"id": "10010",
            //"name": "中国联通"
        },
        "xrole_history": [
            {
                "name": "xroleName",
                "id": "xroleId",
                "domain_name": "domainName",
                "domain_id": "domainId",
                "projectId": "projectId"
            },
            {
                "name": "xroleName22",
                "id": "xroleId22",
                "domain_name": "domainName22",
                "domain_id": "domainId22",
                "projectId": "projectId22"
            }
        ]
    };
    var messageTypes = [{key:"test1", text: "公告"}, {key:"test2", text: "到期提醒"}, {key:"test3", text: "unChecked"}];

    var choices = {"userChoices":[{"value":"test3"}]};

    var projects = {
        "links": {
            "self": "http://10.145.97.31:31943/v3/projects?per_page=1000&page=1",
            "previous": null,
            "next": null
        },
        "projects": [
            {
                "description": "",
                "links": {
                    "self": "http://10.145.97.31:31943/v3/projects/0215ef11e49d4743be23dd97a1561e91"
                },
                "enabled": true,
                "id": "0215ef11e49d4743be23dd97a1561e91",
                "domain_id": "5c9f5525d9d24c5bbf91e74d86772029",
                "name": "eastchina"
            },
            {
                "description": "",
                "links": {
                    "self": "http://10.145.97.31:31943/v3/projects/0403a2a107464a64857690633c9acca0"
                },
                "enabled": true,
                "id": "0403a2a107464a64857690633c9acca0",
                "domain_id": "6008bf9b60524297a8fabbf157a26fe8",
                "name": "northchina"
            },
            {
                "description": "",
                "links": {
                    "self": "http://10.145.97.31:31943/v3/projects/0403a2a107464a64857690633c9acca0"
                },
                "enabled": true,
                "id": "0403a2a107464a64857690633c9acca0",
                "domain_id": "6008bf9b60524297a8fabbf157a26fe8",
                "name": "DeC_eastchina_vdcId"
            }
        ]
    };

    var accountInfo = {"sumAmount": 10000000.87, "debitAmount": 876.64, "bonusAmount": 888.92};

    fixture({
        //查询资源池列表
        "GET /rest/silvan/rest/v1.0/endpoints": function (original, response) {
            if(window.urlParams['lang'] === 'en-us') {
                response(200, "success", endpointsEn, {});
            } else {
                response(200, "success", endpoints, {});
            }

        },
        "GET /rest/silvan/rest/v1.0/users/{user_id}/endpoints": function (original, response) {
            if(window.urlParams['lang'] === 'en-us') {
                response(200, "success", favoriteEndpointsEn, {});
            } else {
                response(200, "success", favoriteEndpoints, {});
            }
        },
        "GET /rest/silvan/rest/v1.0/regions": function (original, response) {
            response(200, "success", regions, {});
        },
        "GET /rest/silvan/rest/v1.0/messages": function (original, response) {
            response(200, "success", messages, {});
        },
        "GET /rest/silvan/rest/v1.0/links": function (original, response) {
            response(200, "success", links, {});
        },
        "GET /me": function (original, response) {
            response(200, "success", user, {});
        },
        "GET /rest/iam/assumeRoles/{user_id}": function (original, response) {
            response(200, "success", assumeRoles, {});
        },
        "GET /rest/silvan/rest/v1.0/messageTypes": function(original, response) {
            response(200, "success", messageTypes, {});
        },
        "GET /rest/silvan/rest/v1.0/user_choices": function(original, response) {
            response(200, "success", choices, {});
        },
        "GET /console/rest/BSS/OpenApi/v1/accounts/sum/accountinfo": function (original, response) {
            response(200, "success", accountInfo, {});
        },
        "GET /rest/iam/v3/projects": function(original, response) {
            response(200, "success", projects, {});
        },
        /*createOrder获取regions*/
        "GET rest/api/v1/datacraft/regions": function(original, response) {
            response(200, "success", projects, {});
        },
        "GET rest/api/v1/datacraft/pipeliness" : function(original, response){
            return {
                "pipelineIdList": [
                    {
                        "pipelineName": "pipeline_5720_zm",
                        "pipelineId": "070ff1d4-6038-4b11-b16f-f04184d8b6bd",
                        "status": "inactive",
                        "schedule": {},
                        "isDeleted": 0
                    },
                    {
                        "pipelineName": "pipeline_7855",
                        "pipelineId": "e0290112-d436-4210-934d-e8d4dfff9273",
                        "status": "inactive",
                        "schedule": {},
                        "isDeleted": 0
                    },
                    {
                        "pipelineName": "pi_7790",
                        "pipelineId": "4dfcefbf-a73e-4395-8a43-4553af61684f",
                        "status": "inactive",
                        "schedule": {},
                        "isDeleted": 0
                    },
                    {
                        "pipelineName": "pipeline_7790",
                        "pipelineId": "1004dc13-ba12-4f90-b8e8-3e4ced4f3c03",
                        "status": "inactive",
                        "schedule": {},
                        "isDeleted": 0
                    },
                    {
                        "pipelineName": "pipeline_3587",
                        "pipelineId": "ce5945c2-dfbb-45c3-b4b3-a848a912f787",
                        "status": "inactive",
                        "schedule": {},
                        "isDeleted": 0
                    },
                    {
                        "pipelineName": "zhangshunyu_private",
                        "pipelineId": "53988c5e-8a0e-4f0e-8b79-b5352e55e9be",
                        "status": "on-scheduled",
                        "schedule": {
                            "startTime": "2017-07-11T11:10:53+08",
                            "endTime": "2017-07-12T11:09:53+08",
                            "interval": "15 minutes",
                            "id": "53988c5e-8a0e-4f0e-8b79-b5352e55e9be",
                            "scheduleType": "TIMER",
                            "type": "SCHEDULE"
                        },
                        "isDeleted": 0
                    },
                    {
                        "pipelineName": "pipeline_4339",
                        "pipelineId": "be6c0b2c-c0dc-4476-817f-0cad151cb953",
                        "status": "inactive",
                        "schedule": {},
                        "isDeleted": 0
                    },
                    {
                        "pipelineName": "pipeline_3210",
                        "pipelineId": "772c76f6-425b-4311-ae4e-932a8d94ebe8",
                        "status": "inactive",
                        "schedule": {},
                        "isDeleted": 0
                    },
                    {
                        "pipelineName": "pipeline_8276_zm",
                        "pipelineId": "deb6bedc-4a10-43ab-af45-79ea6ca77779",
                        "status": "on-scheduled",
                        "schedule": {},
                        "isDeleted": 0
                    },
                    {
                        "pipelineName": "pipeline_7731_zm",
                        "pipelineId": "3c28c5f2-9dd8-4cd2-83dc-e58bbf3ce92c",
                        "status": "on-scheduled",
                        "schedule": {},
                        "isDeleted": 0
                    }
                ],
                "total": 19
            };
        },
        "GET rest/api/v1/datacraft/bss-orders/subscribe-service/myregions" : function(original, response){
            var obj = {
                "regions": [
                    {
                        "dcId": "DC001014FDB1037830",
                        "regionId": "test",
                        "regionName": "测试数据",
                        "regionDesc": "",
                        "regionCode": "test",
                        "availableZones": []
                    },
                    {
                        "dcId": "DC001014FDB3605680",
                        "regionId": "test917",
                        "regionName": "checking",
                        "regionDesc": "",
                        "regionCode": "test917",
                        "availableZones": [
                            {
                                "availableZoneId": "4fc5b6bd30744d2e9e938dd24eba0100",
                                "availableZoneName": "zone",
                                "availableZoneType": 1,
                                "availableZoneCode": "az1"
                            }
                        ]
                    },
                    {
                        "dcId": "DC0010155438F50840",
                        "regionId": "testtets",
                        "regionName": "testtets",
                        "regionDesc": "",
                        "regionCode": "testtets",
                        "availableZones": []
                    },
                    {
                        "dcId": "DC0010155438F50847",
                        "regionId": "cn-north-1",
                        "regionName": "中国华南",
                        "regionDesc": "",
                        "regionCode": "southchina",
                        "availableZones": [
                            {
                                "availableZoneId": "12c47a78666b4e438cd0c692b9860387",
                                "availableZoneName": "az1.dc1",
                                "availableZoneType": 1,
                                "availableZoneCode": "az1.dc1"
                            },
                            {
                                "availableZoneId": "548100fbd534465ea8abe8e7d9746e32",
                                "availableZoneName": "az2.dc1",
                                "availableZoneType": 1,
                                "availableZoneCode": "az2.dc1"
                            },
                            {
                                "availableZoneId": "f84448fd537f46078dd8bd776747f573",
                                "availableZoneName": "kvmxen.dc1",
                                "availableZoneType": 1,
                                "availableZoneCode": "kvmxen.dc1"
                            }
                        ]
                    },
                    {
                        "dcId": "DC0010155438F50848",
                        "regionId": "eastchina",
                        "regionName": "中国华东",
                        "regionDesc": "",
                        "regionCode": "eastchina",
                        "availableZones": [
                            {
                                "availableZoneId": "5b971ea706874a3f8b1b07c5ee98cf35",
                                "availableZoneName": "az1.dc2",
                                "availableZoneType": 1,
                                "availableZoneCode": "az1dc2"
                            },
                            {
                                "availableZoneId": "e47ca97e1f1c47869609d15561f978e7",
                                "availableZoneName": "az1.dc1",
                                "availableZoneType": 1,
                                "availableZoneCode": "az1.dc1"
                            }
                        ]
                    },
                    {
                        "dcId": "DC0010155438F508480",
                        "regionId": "southchina11",
                        "regionName": "中国华南11",
                        "regionDesc": "",
                        "regionCode": "southchina11",
                        "availableZones": []
                    },
                    {
                        "dcId": "DC0010155438F50849",
                        "regionId": "northchina",
                        "regionName": "中国华北",
                        "regionDesc": "",
                        "regionCode": "northchina",
                        "availableZones": [
                            {
                                "availableZoneId": "091eaaf190494e2cbe7a4a75616bee78",
                                "availableZoneName": "az1.dc1",
                                "availableZoneType": 1,
                                "availableZoneCode": "az1.dc1"
                            }
                        ]
                    },
                    {
                        "dcId": "DC0010155E34C6A243",
                        "regionId": "dddddddddd",
                        "regionName": "dddd",
                        "regionDesc": "",
                        "regionCode": "dddddddddd",
                        "availableZones": []
                    },
                    {
                        "dcId": "DC00101571DB76C3F6",
                        "regionId": "IDC0001",
                        "regionName": "R5数据中心",
                        "regionDesc": "",
                        "regionCode": "IDC0001",
                        "availableZones": [
                            {
                                "availableZoneId": "4a490378f7454633a747bf01d0996481",
                                "availableZoneName": "zrZONE",
                                "availableZoneType": 1,
                                "availableZoneCode": "011111"
                            }
                        ]
                    },
                    {
                        "dcId": "DC00101574030B0177",
                        "regionId": "datacenter0919",
                        "regionName": "数据中心0919",
                        "regionDesc": "园区描述信息",
                        "regionCode": "datacenter0919",
                        "availableZones": [
                            {
                                "availableZoneId": "a0d58f24056e4ab9882c38c7789e7b42",
                                "availableZoneName": "Zone名称",
                                "availableZoneType": 1,
                                "availableZoneCode": "AZcode"
                            }
                        ]
                    },
                    {
                        "dcId": "DC00101574665B4753",
                        "regionId": "0920",
                        "regionName": "0920",
                        "regionDesc": "",
                        "regionCode": "0920",
                        "availableZones": []
                    },
                    {
                        "dcId": "DC001015885FC08E44",
                        "regionId": "111111",
                        "regionName": "testjf",
                        "regionDesc": "",
                        "regionCode": "111111",
                        "availableZones": []
                    },
                    {
                        "dcId": "DC0010158F222B4137",
                        "regionId": "region",
                        "regionName": "test1",
                        "regionDesc": "",
                        "regionCode": "region",
                        "availableZones": [
                            {
                                "availableZoneId": "57c096e6a8894676bef73821db89fd3d",
                                "availableZoneName": "test",
                                "availableZoneType": 1,
                                "availableZoneCode": "az"
                            }
                        ]
                    },
                    {
                        "dcId": "DC001015A6EB5B9243",
                        "regionId": "cn-xian-1",
                        "regionName": "中国西安",
                        "regionDesc": "",
                        "regionCode": "cn-xian-1",
                        "availableZones": [
                            {
                                "availableZoneId": "0df57bc75eb14a66b234955a4013ed6b",
                                "availableZoneName": "可用区5",
                                "availableZoneType": 1,
                                "availableZoneCode": "az5pod1"
                            },
                            {
                                "availableZoneId": "5489413890a643fc91b36d6d3b13c276",
                                "availableZoneName": "可用区2",
                                "availableZoneType": 1,
                                "availableZoneCode": "az2pod1"
                            },
                            {
                                "availableZoneId": "a68933eee6424258834e743dda3becc2",
                                "availableZoneName": "可用区3",
                                "availableZoneType": 1,
                                "availableZoneCode": "az3pod1"
                            },
                            {
                                "availableZoneId": "a96af40fa2aa413284f9ca973b22c622",
                                "availableZoneName": "可用区1",
                                "availableZoneType": 1,
                                "availableZoneCode": "az1pod1"
                            },
                            {
                                "availableZoneId": "e9317bc99c3d4b47a1f2a3f033b61bc4",
                                "availableZoneName": "可用区4",
                                "availableZoneType": 1,
                                "availableZoneCode": "az4pod1"
                            }
                        ]
                    },
                    {
                        "dcId": "DC001015AEB4F4ECD0",
                        "regionId": "cid-hws-hz-1",
                        "regionName": "CID HWS HangZhou 01",
                        "regionDesc": "",
                        "regionCode": "cid-hws-hz-1",
                        "availableZones": [
                            {
                                "availableZoneId": "2cdde0ba6a1b4aecbb89f9c09ff93baa",
                                "availableZoneName": "az1-dc1",
                                "availableZoneType": 1,
                                "availableZoneCode": "az1-dc1"
                            },
                            {
                                "availableZoneId": "a0baa57d10f04fec86835dfd6e23abd8",
                                "availableZoneName": "az2-dc2",
                                "availableZoneType": 1,
                                "availableZoneCode": "az2-dc2"
                            }
                        ]
                    },
                    {
                        "dcId": "DC001015B22545A5A9",
                        "regionId": "00000",
                        "regionName": "0000",
                        "regionDesc": "",
                        "regionCode": "00000",
                        "availableZones": []
                    },
                    {
                        "dcId": "DC001015C3EF3EDEC9",
                        "regionId": "test_111",
                        "regionName": "数据中心_测试数据",
                        "regionDesc": "test",
                        "regionCode": "test_111",
                        "availableZones": []
                    },
                    {
                        "dcId": "DC001015C438F0AF07",
                        "regionId": "12",
                        "regionName": "C85",
                        "regionDesc": "",
                        "regionCode": "12",
                        "availableZones": []
                    },
                    {
                        "dcId": "DC001015C439350EA1",
                        "regionId": "dd",
                        "regionName": "HZ-R3-DC",
                        "regionDesc": "",
                        "regionCode": "dd",
                        "availableZones": [
                            {
                                "availableZoneId": "e23318b8b23b4f24b84cc80957bbf34b",
                                "availableZoneName": "1234",
                                "availableZoneType": 1,
                                "availableZoneCode": "1234"
                            }
                        ]
                    },
                    {
                        "dcId": "DC001015C76216F873",
                        "regionId": "123456123456",
                        "regionName": "测试123",
                        "regionDesc": "",
                        "regionCode": "123456123456",
                        "availableZones": []
                    }
                ]
            };
            return obj;
        },
        "GET rest/api/v1/datacraft/monitor/getHistorylist" : function(original, response){
            var obj = {
                "pipelineInstances": [
                    {
                        "pipelineInstanceId": "e0290112-d436-4210-934d-e8d4dfff9273-20170711151817261-0",
                        "pipelineStatus": "SUCCEED",
                        "startTime": 1499757497261,
                        "endTime": 1499757603474
                    },
                    {
                        "pipelineInstanceId": "e0290112-d436-4210-934d-e8d4dfff9273-20170711150336672-0",
                        "pipelineStatus": "SUCCEED",
                        "startTime": 1499756616672,
                        "endTime": 1499756632435
                    },
                    {
                        "pipelineInstanceId": "e0290112-d436-4210-934d-e8d4dfff9273-20170711150035575-0",
                        "pipelineStatus": "SUCCEED",
                        "startTime": 1499756435575,
                        "endTime": 1499756511852
                    }
                ],
                "total": 3
            };
            return obj;
        },
        "GET rest/api/v1/datacraft/monitor/getActivitieslist" : function(original, response){
            var obj = {
                "flowInstances": [
                    {
                        "flowId": "4eb2c3a8-bd2b-4399-9507-bf9d1f6885cd",
                        "startTime": 1499680850898,
                        "endTime": 1499680851407,
                        "pipelineInstanceId": "343c33fa-b211-da3f-a624-3c4592230d24-20170710180050892-0",
                        "flowStatus": "SUCCEED",
                        "flowName": "DistCp_1957",
                        "type": "Distcp",
                        "executionLog": "lyp_test"
                    }
                ],
                "total": 1
            };
            return obj;
        },"GET rest/api/v1/pipeline/root/pipeline-detail" : function(original, response){
            var obj = {
                id:"4f8899ac-dcf5-4888-b060-ce3bcca657dd",
                startTime:"2017-07-11 19:43:14 GMT+08:00",
                endTime:"2017-07-11 19:59:14 GMT+08:00",
                interval: "15 minutes"

        };
            return obj;
        },"GET rest/api/v1/datacraft/logview" : function(original, response){
            var obj = {
                "loginfo": [
                    {
                        "infotmp": "4eb2c3a8-bd2b-4399-9507-bf9d1f6885cd4eb2c3a8-bd2b-4399-9507-bf9d1f6885cd4eb2c3a8-bd2b-4399-9507-bf9d1f6885cd4eb2c3a8-bd2b-4399-9507-bf9d1f6885cd4eb2c3a8-bd2b-4399-9507-bf9d1f6885cd数据调度服务 包年数据调度服务 包年数据调度服务 包年数据调度服务 包年数据调度服务 包年"

                    }
                ],
                "total": 1
            };
            return obj;
        },"GET rest/api/v1/datacraft/bss-orders/subscribe-service/myproducts?chargingMode=1" : function(original,response){
            var obj = 	{
                "products": [
                    {
                        "productId": "00301-66131-0--0",
                        "productName": "DPS服务 包年 华北区1",
                        "productDesc": "数据调度服务 包年",
                        "isTrial": 0,
                        "isPublic": 1,
                        "productStatus": 4,
                        "dcID": "ALL",
                        "dc": "ALL",
                        "regionIds": [
                            "southchina",
                            "eastchina",
                            "northchina",
                            "cn-xian-1"
                        ],
                        "availableZoneIds": [
                            "12c47a78666b4e438cd0c692b9860387",
                            "548100fbd534465ea8abe8e7d9746e32",
                            "f84448fd537f46078dd8bd776747f573",
                            "e47ca97e1f1c47869609d15561f978e7",
                            "091eaaf190494e2cbe7a4a75616bee78",
                            "0df57bc75eb14a66b234955a4013ed6b",
                            "5489413890a643fc91b36d6d3b13c276",
                            "a68933eee6424258834e743dda3becc2",
                            "a96af40fa2aa413284f9ca973b22c622",
                            "e9317bc99c3d4b47a1f2a3f033b61bc4"
                        ],
                        "productSpec": {
                            "specId": "000153-35002-0-productspec-GLOBAL",
                            "specName": "数据调度服务",
                            "resourceType": "233",
                            "specDetail": "数据调度服务",
                            "resourceSpecCode": "hws.resource.type.dps.periodic",
                            "resTypeId": 233,
                            "productSpecSysDesc": ""
                        },
                        "cloudServiceTypes": [
                            "hws.service.type.dps"
                        ],
                        "pricePlans": [
                            {
                                "pricePlanId": "00351-24050-0-plan-GLOBAL",
                                "chargingMode": 1,
                                "price": 850,
                                "validTime": "2017-05-04 09:15:15",
                                "expireTime": "2050-02-24 09:41:21",
                                "currencyUnit": 1,
                                "periodType": 3,
                                "periodNum": 1,
                                "isStepTariff": 0,
                                "tariffStepInfo": []
                            }
                        ]
                    },
                    {
                        "productId": "00301-66130-0--0",
                        "productName": "DPS服务 包月 华北区1",
                        "productDesc": "数据调度服务 包月",
                        "isTrial": 0,
                        "isPublic": 1,
                        "productStatus": 4,
                        "dcID": "ALL",
                        "dc": "ALL",
                        "regionIds": [
                            "southchina",
                            "eastchina",
                            "northchina",
                            "cn-xian-1"
                        ],
                        "availableZoneIds": [
                            "12c47a78666b4e438cd0c692b9860387",
                            "548100fbd534465ea8abe8e7d9746e32",
                            "f84448fd537f46078dd8bd776747f573",
                            "e47ca97e1f1c47869609d15561f978e7",
                            "091eaaf190494e2cbe7a4a75616bee78",
                            "0df57bc75eb14a66b234955a4013ed6b",
                            "5489413890a643fc91b36d6d3b13c276",
                            "a68933eee6424258834e743dda3becc2",
                            "a96af40fa2aa413284f9ca973b22c622",
                            "e9317bc99c3d4b47a1f2a3f033b61bc4"
                        ],
                        "productSpec": {
                            "specId": "000153-35002-0-productspec-GLOBAL",
                            "specName": "数据调度服务",
                            "resourceType": "233",
                            "specDetail": "数据调度服务",
                            "resourceSpecCode": "hws.resource.type.dps.periodic",
                            "resTypeId": 233,
                            "productSpecSysDesc": ""
                        },
                        "cloudServiceTypes": [
                            "hws.service.type.dps"
                        ],
                        "pricePlans": [
                            {
                                "pricePlanId": "00351-24049-0-plan-GLOBAL",
                                "chargingMode": 1,
                                "price": 85,
                                "validTime": "2017-05-04 09:15:15",
                                "expireTime": "2050-02-24 09:41:21",
                                "currencyUnit": 1,
                                "periodType": 2,
                                "periodNum": 1,
                                "isStepTariff": 0,
                                "tariffStepInfo": []
                            }
                        ]
                    }
                ]
            };
            return obj;
        },"GET rest/api/v1/datacraft/nifi-api/bss/api/get-quotas" : function(original,response){
            var obj = 	{
                "quotas":{
                    "resources": [
                        {
                            "type":"Max_Pipeline_Cout",
                            "min":0,
                            "max":0,
                            "quota":100,
                            "used":1
                        }
                    ]
                }
            };
            return obj;
        },"rest/api/v1/datacraft/bss-orders/subscribe-service/customerverified/mystatus" : function(original,response){
            var obj = 	{
                "verifiedStatus": 2,
                "isVerified": true,
                "retCode": 0,
                "retDesc": "success"
            };
            return obj;
        },"GET rest/api/v1/datacraft/getPipelineOrderInfo1/f9fcfcfa-b291-4a1f-a694-3c039a940d10":function(original, response){
            var obj={
                "orderInfoDTO": {
                    "orderId": "HWC15BTB009UPD",
                    "validTime": "2017-06-30 10:16:53 GMT+08:00",
                    "expireTime": "2017-07-29 23:59:59 GMT+08:00",
                    "billingType": "包年/包月",
                    "pipelineId": "f029e5bc-fe1e-48c6-8dd8-31e2a4ede977"
                }
            }
            return obj;
        }, "GET /rest/api/v1/datacraft/nifi-api/controller/process-group/d6e5a023-aa50-42a3-9bec-282359d614f7" : function(original, response){
            var obj = {
                "activities": [
                    {
                        "id": "ui_a14abf19-4b53-4230-a336-a1e185bd1bba",
                        "uri": "/nifi-api/controller/process-groups/null/processors/a14abf19-4b53-4230-a336-a1e185bd1bba",
                        "parentGroupId": "a1eb0778-4813-461e-a1c7-cd3127431f13",
                        "name": "ExecuteMR",
                        "type": "com.huawei.datacraft.activity.ExecuteMR",
                        "processorType": "INVOKE_ACTIVITY",
                        "state": "STOPPED",
                        "supportsParallelProcessing": true,
                        "supportsEventDriven": true,
                        "supportsBatching": false,
                        "persistsState": false,
                        "inputRequirement": "INPUT_FORBIDDEN",
                        "outputRequirement": "OUTPUT_FORBIDDEN",
                        "inPutType": [
                            ""
                        ],
                        "outPutType": [
                            ""
                        ],
                        "computeResource": [
                            "123"
                        ],
                        "position": {
                            "x": 220.99652862548828,
                            "y": 181.1944580078125
                        },
                        "style": {},
                        "relationships": [
                            {
                                "name": "Failure",
                                "description": "Failure",
                                "autoTerminate": false
                            },
                            {
                                "name": "Success",
                                "description": "Success",
                                "autoTerminate": false
                            }
                        ],
                        "config": {
                            "properties": {
                                "Cluster ID": null,
                                "Application Name": null,
                                "Jar Path": null,
                                "Parameter for Jar File": null,
                                "Input Data Path": null,
                                "Output Data Path": null,
                                "Log Path": null
                            },
                            "descriptors": {
                                "Cluster ID": {
                                    "name": "Cluster ID",
                                    "displayName": "Cluster ID",
                                    "description": "Cluster ID",
                                    "required": true,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                },
                                "Application Name": {
                                    "name": "Application Name",
                                    "displayName": "Application Name",
                                    "description": "Hadoop Application Name To Be Specified",
                                    "required": true,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                },
                                "Jar Path": {
                                    "name": "Jar Path",
                                    "displayName": "Jar Path",
                                    "description": "Jar Path",
                                    "required": true,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                },
                                "Parameter for Jar File": {
                                    "name": "Parameter for Jar File",
                                    "displayName": "Parameter for Jar File",
                                    "description": "Arguments",
                                    "required": false,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                },
                                "Input Data Path": {
                                    "name": "Input Data Path",
                                    "displayName": "Input Data Path",
                                    "description": "Source path from where the data should be copied",
                                    "required": false,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                },
                                "Output Data Path": {
                                    "name": "Output Data Path",
                                    "displayName": "Output Data Path",
                                    "description": "Destination path where the data should be placed",
                                    "required": false,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                },
                                "Log Path": {
                                    "name": "Log Path",
                                    "displayName": "Log Path",
                                    "description": "Address for storing job logs that record job running status.",
                                    "required": true,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                }
                            },
                            "defaultConcurrentTasks": {
                                "TIMER_DRIVEN": "1",
                                "EVENT_DRIVEN": "0",
                                "CRON_DRIVEN": "1"
                            },
                            "defaultSchedulingPeriod": {
                                "TIMER_DRIVEN": "0 sec",
                                "CRON_DRIVEN": "* * * * * ?"
                            }
                        },
                        "validationErrors": [
                            "'Cluster ID' is invalid because Cluster ID is required",
                            "'Application Name' is invalid because Application Name is required",
                            "'Jar Path' is invalid because Jar Path is required",
                            "'Log Path' is invalid because Log Path is required",
                            "'Relationship Success' is invalid because Relationship 'Success' is not connected to any component and is not auto-terminated",
                            "'Relationship Failure' is invalid because Relationship 'Failure' is not connected to any component and is not auto-terminated"
                        ],
                        "inputDataNode": [],
                        "outputDataNode": [],
                        "dependencies": []
                    },
                    {
                        "id": "ui_7495adfd-308d-4195-8d51-fbff71471d7c",
                        "uri": "/nifi-api/controller/process-groups/null/processors/7495adfd-308d-4195-8d51-fbff71471d7c",
                        "parentGroupId": "a1eb0778-4813-461e-a1c7-cd3127431f13",
                        "name": "ExecuteMR",
                        "type": "com.huawei.datacraft.activity.ExecuteMR",
                        "processorType": "INVOKE_ACTIVITY",
                        "state": "STOPPED",
                        "supportsParallelProcessing": true,
                        "supportsEventDriven": true,
                        "supportsBatching": false,
                        "persistsState": false,
                        "inputRequirement": "INPUT_FORBIDDEN",
                        "outputRequirement": "OUTPUT_FORBIDDEN",
                        "inPutType": [
                            ""
                        ],
                        "outPutType": [
                            ""
                        ],
                        "computeResource": [
                            "EBD"
                        ],
                        "position": {
                            "x": 666.9965515136719,
                            "y": 183.1875228881836
                        },
                        "style": {},
                        "relationships": [
                            {
                                "name": "Failure",
                                "description": "Failure",
                                "autoTerminate": false
                            },
                            {
                                "name": "Success",
                                "description": "Success",
                                "autoTerminate": false
                            }
                        ],
                        "config": {
                            "properties": {
                                "Cluster ID": null,
                                "Application Name": null,
                                "Jar Path": null,
                                "Parameter for Jar File": null,
                                "Input Data Path": null,
                                "Output Data Path": null,
                                "Log Path": null
                            },
                            "descriptors": {
                                "Cluster ID": {
                                    "name": "Cluster ID",
                                    "displayName": "Cluster ID",
                                    "description": "Cluster ID",
                                    "required": true,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                },
                                "Application Name": {
                                    "name": "Application Name",
                                    "displayName": "Application Name",
                                    "description": "Hadoop Application Name To Be Specified",
                                    "required": true,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                },
                                "Jar Path": {
                                    "name": "Jar Path",
                                    "displayName": "Jar Path",
                                    "description": "Jar Path",
                                    "required": true,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                },
                                "Parameter for Jar File": {
                                    "name": "Parameter for Jar File",
                                    "displayName": "Parameter for Jar File",
                                    "description": "Arguments",
                                    "required": false,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                },
                                "Input Data Path": {
                                    "name": "Input Data Path",
                                    "displayName": "Input Data Path",
                                    "description": "Source path from where the data should be copied",
                                    "required": false,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                },
                                "Output Data Path": {
                                    "name": "Output Data Path",
                                    "displayName": "Output Data Path",
                                    "description": "Destination path where the data should be placed",
                                    "required": false,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                },
                                "Log Path": {
                                    "name": "Log Path",
                                    "displayName": "Log Path",
                                    "description": "Address for storing job logs that record job running status.",
                                    "required": true,
                                    "sensitive": false,
                                    "dynamic": false,
                                    "supportsEl": false,
                                    "show": true
                                }
                            },
                            "defaultConcurrentTasks": {
                                "TIMER_DRIVEN": "1",
                                "EVENT_DRIVEN": "0",
                                "CRON_DRIVEN": "1"
                            },
                            "defaultSchedulingPeriod": {
                                "TIMER_DRIVEN": "0 sec",
                                "CRON_DRIVEN": "* * * * * ?"
                            }
                        },
                        "validationErrors": [
                            "'Cluster ID' is invalid because Cluster ID is required",
                            "'Application Name' is invalid because Application Name is required",
                            "'Jar Path' is invalid because Jar Path is required",
                            "'Log Path' is invalid because Log Path is required",
                            "'Relationship Success' is invalid because Relationship 'Success' is not connected to any component and is not auto-terminated",
                            "'Relationship Failure' is invalid because Relationship 'Failure' is not connected to any component and is not auto-terminated"
                        ],
                        "inputDataNode": [],
                        "outputDataNode": [],
                        "dependencies": [
                            "ui_a14abf19-4b53-4230-a336-a1e185bd1bba"
                        ]
                    }
                ]
            };

            return obj;
        }
    });

    return fixture;
});