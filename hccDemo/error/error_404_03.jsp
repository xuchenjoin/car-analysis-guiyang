<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<%
String contextPath = request.getContextPath();
%>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>华为企业云服务</title>
    <link rel="icon" type="image/x-icon" href="<%=contextPath%>/error/images/favicon.ico">
    <link rel="stylesheet" type="text/css" href="<%=contextPath%>/error/css/error.css"/>

    <script>
        function changeLang(lang) {
            if ('en-us' === lang) {
                document.title = "Huawei Enterprise Cloud";
                document.getElementById('zh-content').style.display = "none";
                document.getElementById('en-content').style.display = "block";
            } else {
                document.title = "华为企业云服务";
                document.getElementById('zh-content').style.display = "block";
                document.getElementById('en-content').style.display = "none";
            }
        }

        window.onload = function () {
            function trimEmpty(value) {
                if (!value) {
                    return '';
                }
                return value.replace(/(^\s*)|(\s*$)/g, '');
            }

            var result;
            if (document.cookie) {
                var consoleCookies = document.cookie.split(';');
                var cookie;
                for (var i = 0; i < consoleCookies.length; i++) {
                    cookie = consoleCookies[i].split('=');
                    if (cookie && cookie.length >= 2 && 'locale' === trimEmpty(cookie[0])) {
                        result = trimEmpty(cookie[1]);
                    }
                }
            }

            changeLang(result);
        };
    </script>
</head>

<body class="error-404">

<div id="zh-content">
    <div class=" head-wrap">
        <div class="container">
            <div class="col-hw-5 head-logo">
                <a class="navbar-brand" href="/" name="logo">
                    <img src="<%=contextPath%>/error/images/logo.png" alt="logo" title="首页">
                </a>
            </div>
            <div class="pull-right">
                <a href="http://support.hwclouds.com">帮助中心</a>
            </div>
        </div>
    </div>

    <div class="module-error">
        <div class="error-main clearfix">
            <div class="label label_03"></div>
            <div class="info padding-top20">
                <h3 class="title">很抱歉，您访问的页面已失效。</h3>

                <div class="oper">
                    <p>&#8226;&nbsp;进入<a href="http://www.hwclouds.com/">华为企业云门户</a></p>
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="container">
            <span class="copyright">版权所有 © 华为软件技术有限公司 2015。 保留一切权利。苏ICP备09062682号- 13</span>
            <span class="laws">
            <a target="_blank" href="http://www.hwclouds.com/declaration/statement.html">法律声明</a>
            <span>|</span>
            <a target="_blank" href="http://www.hwclouds.com/declaration/sa_prp.html">隐私保护</a>
            <span>|</span>
            <a target="_blank" href="http://www.hwclouds.com/declaration/sa_nisr.html">入网信息安全责任书</a>
            <span>|</span>
            <a target="_blank" href="http://www.hwclouds.com/declaration/sa_cua.html">法律协议</a>
            </span>
        </div>
    </div>
</div>

<div id="en-content">
    <div class=" head-wrap">
        <div class="container">
            <div class="col-hw-5 head-logo">
                <a class="navbar-brand" href="/" name="logo">
                    <img src="<%=contextPath%>/error/images/logo.png" alt="logo" title="Home Page">
                </a>
            </div>
            <div class="pull-right">
                <a href="http://support.hwclouds.com">Help Center</a>
            </div>
        </div>
    </div>

    <div class="module-error">
        <div class="error-main clearfix">
            <div class="label label_03"></div>
            <div class="info padding-top20">
                <h3 class="title">The page has expired</h3>
                <div class="oper">
                    <p>&#8226;&nbsp;Enter <a href="http://www.hwclouds.com/">Huawei Enterprise Cloud Portal</a></p>
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="container">
            <span class="copyright">Copyright © Huawei Technologies Co., Ltd. 2015. All rights reserved.</span>
            <span class="laws">
            <a target="_blank" href="http://www.hwclouds.com/declaration/statement.html">Legal Statement</a>
            <span>|</span>
            <a target="_blank" href="http://www.hwclouds.com/declaration/sa_prp.html">Privacy Protection</a>
            <span>|</span>
            <a target="_blank" href="http://www.hwclouds.com/declaration/sa_nisr.html">Network Access Security Responsibility</a>
            <span>|</span>
            <a target="_blank" href="http://www.hwclouds.com/declaration/sa_cua.html">Legal Agreement</a>
            </span>
        </div>
    </div>
</div>
</body>

</html>



