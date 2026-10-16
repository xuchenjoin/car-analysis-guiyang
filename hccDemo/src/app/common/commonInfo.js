
define(function (_) {
    var urlPreFix = "https://" + window.location.host;
    var urlAccountCloud="https://account.hwclouds.com";
    var rootPath =urlPreFix+"/dps/";
    var restApiPath=urlPreFix+"/dps/rest/";
    var baseUrl = "http://support.hwclouds.com/";
    var baseUrls = "https://support.hwclouds.com/";
    var tefbaseurl="https://docs.otc.t-systems.com/";
    var urlhwclouds="http://www.hwclouds.com/";
    var locallang =window.urlParams.lang.toLowerCase();
    
   /* locallang = "zh-cn";*/
    if(locallang == "en-us"){
    	var baseLocal = "en-us/";
    	var helpPagePath=baseUrl+baseLocal+"usermanual-dps/";
    	var helpPagePaths=baseUrls+baseLocal+"usermanual-dps/";
    	
    	var publicEventProtocolPageUrl = "http://www.hwclouds.com/en-us/declaration/fsa_test.html";//公测协议英文地址
    } else {
    	var baseLocal = "";
    	var helpPagePath=baseUrl+baseLocal+"usermanual-dps/";
    	var helpPagePaths=baseUrls+baseLocal+"usermanual-dps/";
    	
    	var publicEventProtocolPageUrl = "http://www.hwclouds.com/declaration/fsa_test.html";//公测协议地址
    }
    
    var faqUrl = baseUrl+baseLocal+"bigdata_faq/index.html";
    var helpBaseUrl = baseUrl+baseLocal;
    if(locallang == "en-us"){
        var AgrementLangFirst = "en_us";
        var AgrementLangAfter = "en_";
    }else if(locallang == "zh-cn"){
        var AgrementLangFirst = "";
        var AgrementLangAfter = "";
    }
    var commonInfo =
    {
        "language":locallang,
        "urlPreFix":urlPreFix,
        "rootPath":rootPath,
        "restApiPath":restApiPath,
        //申请扩大配额
        "applyMoreQuotaPage":"/usercenter/?locale="+locallang+"#/userindex/createfeedback",
        
        //项目列表
        "dpsPipelineListPageUrl":{
            "hws":{
                helpPagePath:helpPagePath+locallang+"_topic_0032989643.html"
            },
            /*西电只有英文资料，小语种无资料*/
            "tef":{
                helpPagePath:tefbaseurl+"en-us/usermanual/dps/en-us"+"_topic_0032989643.html"
            }
        },
        //告警列表
        "dpsAlarmListPageUrl":helpPagePath+locallang+"_topic_0032989648.html",
        //操作日志
        "dpsOperationLogsListPageUrl":helpPagePath+locallang+"_topic_0032989649.html",
        //申请证书
        "dpsApplyCertificateUrl":helpPagePath+locallang+"_topic_0054868192.html",
        
        //页面地址
        "publicEventPageUrl":rootPath+"#/public",                                        //公测页面地址
        "publicEventProtocolPageUrl":publicEventProtocolPageUrl,//公测协议地址
        //计费页面
        "dps_price":"http://support.hwclouds.com/pro_price/#mod_price_16",
        //DPS服务协议
        "dpsServiceAgreementPage":urlhwclouds+"declaration/tsa_"+AgrementLangAfter+"dps.html",

    };
    return commonInfo;
});