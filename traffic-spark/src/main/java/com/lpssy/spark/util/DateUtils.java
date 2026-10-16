package com.lpssy.spark.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 日期时间工具类
 * 作用：统一管理项目中所有日期/时间的格式与换算——时间先后比较、求时间差(秒)、
 *       取"日期_小时"段、取当天/昨天日期、各种格式的解析与输出，
 *       以及把某一次过车时刻归到它所在的"5分钟时间窗"。
 * 数据流向：纯内存工具类；输入是时间字符串或Date对象，输出是字符串/boolean/int。
 * @author Administrator
 *
 */
public class DateUtils {

    public static final SimpleDateFormat TIME_FORMAT =
            new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); // 过车时间格式：年-月-日 时:分:秒
    public static final SimpleDateFormat DATE_FORMAT =
            new SimpleDateFormat("yyyy-MM-dd"); // 日期格式：年-月-日，用于任务日期范围/结果date字段
    public static final SimpleDateFormat DATEKEY_FORMAT =
            new SimpleDateFormat("yyyyMMdd"); // 日期key格式：连写无分隔，常用于分区/数据目录

    /**
     * 判断一个时间是否在另一个时间之前
     * @param time1 第一个时间
     * @param time2 第二个时间
     * @return 判断结果
     */
    public static boolean before(String time1, String time2) {
        try {
            Date dateTime1 = TIME_FORMAT.parse(time1);
            Date dateTime2 = TIME_FORMAT.parse(time2);

            if(dateTime1.before(dateTime2)) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 判断一个时间是否在另一个时间之后
     * @param time1 第一个时间
     * @param time2 第二个时间
     * @return 判断结果
     */
    public static boolean after(String time1, String time2) {
        try {
            Date dateTime1 = TIME_FORMAT.parse(time1);
            Date dateTime2 = TIME_FORMAT.parse(time2);

            if(dateTime1.after(dateTime2)) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 计算时间差值（单位为秒）
     * @param time1 时间1
     * @param time2 时间2
     * @return 差值
     */
    public static int minus(String time1, String time2) {
        try {
            Date datetime1 = TIME_FORMAT.parse(time1);
            Date datetime2 = TIME_FORMAT.parse(time2);

            long millisecond = datetime1.getTime() - datetime2.getTime();

            return Integer.valueOf(String.valueOf(millisecond / 1000));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    /**
     * 获取年月日和小时
     * @param datetime 时间（yyyy-MM-dd HH:mm:ss）
     * @return 结果（yyyy-MM-dd_HH）
     */
    public static String getDateHour(String datetime) {
        String date = datetime.split(" ")[0];
        String hourMinuteSecond = datetime.split(" ")[1];
        String hour = hourMinuteSecond.split(":")[0];
        return date + "_" + hour;
    }

    /**
     * 获取当天日期（yyyy-MM-dd）
     * @return 当天日期
     */
    public static String getTodayDate() {
        return DATE_FORMAT.format(new Date());
    }

    /**
     * 获取昨天的日期（yyyy-MM-dd）
     * @return 昨天的日期
     */
    public static String getYesterdayDate() {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.DAY_OF_YEAR, -1);

        Date date = cal.getTime();

        return DATE_FORMAT.format(date);
    }

    /**
     * 格式化日期（yyyy-MM-dd）
     * @param date Date对象
     * @return 格式化后的日期
     */
    public static String formatDate(Date date) {
        return DATE_FORMAT.format(date);
    }

    /**
     * 格式化时间（yyyy-MM-dd HH:mm:ss）
     * @param date Date对象
     * @return 格式化后的时间
     */
    public static String formatTime(Date date) {
        return TIME_FORMAT.format(date);
    }

    /**
     * 解析时间字符串
     * @param time 时间字符串
     * @return Date
     */
    public static Date parseTime(String time) {
        try {
            return TIME_FORMAT.parse(time);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 格式化日期key
     * @param date
     * @return  yyyyMMdd
     */
    public static String formatDateKey(Date date) {
        return DATEKEY_FORMAT.format(date);
    }

    /**
     * 格式化日期key	(yyyyMMdd)
     * @param datekey
     * @return
     */
    public static Date parseDateKey(String datekey) {
        try {
            return DATEKEY_FORMAT.parse(datekey);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 格式化时间，保留到分钟级别
     * 
     * @param date
     * @return  yyyyMMddHHmm --201701012301
     */
    public static String formatTimeMinute(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmm");
        return sdf.format(date);
    }
    
    /**
     * 把某个过车时刻归到它所在的"5分钟时间窗"，返回形如 "yyyy-MM-dd HH:mm~HH:mm" 的区间串。
     * 例如 10:07 落在 10:05~10:10；若分钟凑整后正好顶到整点则右区间跨到下一小时的:00。
     * @param dateTime 过车时间，格式 yyyy-MM-dd HH:mm:ss
     * @return 所属5分钟区间字符串，用于按"卡口+5分钟窗"聚合过车车辆
     */
	public static String getRangeTime(String dateTime) {
		 String date = dateTime.split(" ")[0];
		 String hour = dateTime.split(" ")[1].split(":")[0];
		 int minute = StringUtils.convertStringtoInt(dateTime.split(" ")[1].split(":")[1]);
//		 String second = dateTime.split(" ")[1].split(":")[2];
		 if(minute+(5-minute % 5) == 60){
			 return date+" "+hour+":"+StringUtils.fulfuill((minute-(minute % 5))+"")+"~"+date+" "+StringUtils.fulfuill((Integer.parseInt(hour)+1)+"")+":00";
		 }
		 return date+" "+hour+":"+StringUtils.fulfuill((minute-(minute % 5))+"") +"~" + date+" "+hour+":"+StringUtils.fulfuill((minute+(5-minute % 5))+"");
	}
}
