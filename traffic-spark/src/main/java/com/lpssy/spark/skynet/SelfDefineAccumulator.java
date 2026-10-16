package com.lpssy.spark.skynet;

import com.lpssy.spark.constant.Constants;
import com.lpssy.spark.util.StringUtils;
import org.apache.spark.util.AccumulatorV2;
/**
 * 自定义累加器（Spark 新版 AccumulatorV2，输入/输出都是拼接字符串）。
 * 作用：在分布式统计"卡口与摄像头运行状态"时，把各个 Executor 分区各自算出的
 *      正常卡口数、异常卡口数、正常摄像头数、异常摄像头数、异常摄像头明细
 *      这 5 个指标，跨分区自动汇总成 Driver 端的一个最终结果。
 * 数据来源：MonitorFlowAnalyze.checkMonitorState() 每判定一个卡口状态就 add 一次。
 * 结果去向：最终由 saveMonitorState() 取出，写入 MySQL 的 monitor_state 表。
 * 内部格式：用 "|" 分隔字段、"=" 拼键值，例如
 *      normalMonitorCount=8|normalCameraCount=3|abnormalMonitorCount=1|abnormalMonitorCameraInfos=...
 */
public class SelfDefineAccumulator extends AccumulatorV2<String,String> {
    String returnResult = "";//累加器当前的值（一条拼接好的大字符串）

    /**
     * 与reset() 方法中保持一致，返回true。
     * @return
     */
    @Override
    public boolean isZero() {
        //normalMonitorCount=0|normalCameraCount=0|abnormalMonitorCount=0|abnormalCameraCount=0|abnormalMonitorCameraInfos=
        return "normalMonitorCount=0|normalCameraCount=0|abnormalMonitorCount=0|abnormalCameraCount=0|abnormalMonitorCameraInfos= ".equals(returnResult);
    }

    @Override
    public AccumulatorV2<String, String> copy() {
        SelfDefineAccumulator acc  = new SelfDefineAccumulator();
        acc.returnResult = this.returnResult;
        return acc;
    }

    /**
     * 每个分区初始值
     */
    @Override
    public void reset() {
        //normalMonitorCount=0|normalCameraCount=0|abnormalMonitorCount=0|abnormalCameraCount=0|abnormalMonitorCameraInfos=
        returnResult = Constants.FIELD_NORMAL_MONITOR_COUNT+"=0|"
                + Constants.FIELD_NORMAL_CAMERA_COUNT+"=0|"
                + Constants.FIELD_ABNORMAL_MONITOR_COUNT+"=0|"
                + Constants.FIELD_ABNORMAL_CAMERA_COUNT+"=0|"
                + Constants.FIELD_ABNORMAL_MONITOR_CAMERA_INFOS+"= ";
    }

    /**
     * 每个分区会拿着 reset 初始化的值 ，在各自的分区内相加
     * @param v
     */
    @Override
    public void add(String v) {
//        System.out.println("add returnResult ="+returnResult+", v="+v);
        returnResult = myAdd(returnResult,v);
    }

    /**
     * 每个分区最终的结果和初始值 returnResult=""  做累加
     * @param other
     */
    @Override
    public void merge(AccumulatorV2<String, String> other) {
        //这里初始值就是 "" ,每个分区之后都是一个大的字符串

        SelfDefineAccumulator accumulator = (SelfDefineAccumulator)other;
//        System.out.println("merge   returnResult="+returnResult+" , accumulator.returnResult="+accumulator.returnResult);
        returnResult = myAdd(returnResult,accumulator.returnResult);
    }

    @Override
    public String value() {
        return returnResult;
    }

/**
     * 核心合并算法：把两段"字段=值|字段=值"字符串按字段名合并累加。
     * 计数类字段（正常/异常卡口数、摄像头数）做整数相加；
     * 异常摄像头明细是字符串，用 "~" 把多段明细首尾拼起来。
     * @param v1 已累计的旧字符串
     * @param v2 本次新进来要累加的字符串
     * @return 合并后的新字符串
     */
    private String myAdd(String v1, String v2) {
//        System.out.println("myAdd v1="+v1);
//        System.out.println("myAdd v2="+v2);
        if(StringUtils.isEmpty(v1)){//v1 为空说明是第一次累加，直接采用 v2
            return v2;
        }
        String[] valArr = v2.split("\\|");//把新进来的 v2 按 "|" 拆成一个个 字段=值
        for (String string : valArr) {
            String[] fieldAndValArr = string.split("=");//再把每个 "字段=值" 拆成字段名和值
            String field = fieldAndValArr[0];
            String value = fieldAndValArr[1];
            String oldVal = StringUtils.getFieldFromConcatString(v1, "\\|", field);//从旧串里取出同名字段的旧值
            if(oldVal != null){
                //只有这个字段是string（异常摄像头明细），所以单独拿出来做字符串拼接
                if(Constants.FIELD_ABNORMAL_MONITOR_CAMERA_INFOS.equals(field)){
                    if(value.startsWith(" ~")) {//去掉新明细开头多余的 " ~"，避免拼接出双分隔符
                        value = value.substring(2);
                    }
                    v1 = StringUtils.setFieldInConcatString(v1, "\\|", field, oldVal + "~" + value);//用 "~" 连接多段异常明细
                }else{
                    //其余都是int类型，直接加减就可以：旧值 + 新值
                    int newVal = Integer.parseInt(oldVal)+Integer.parseInt(value);
                    v1 = StringUtils.setFieldInConcatString(v1, "\\|", field, String.valueOf(newVal));//写回合并后的计数值
                }
            }
        }
        return v1;
    }
}
