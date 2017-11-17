import java.io.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


public class Main {

    /**
     * 输入文件-->短log文件的ip划分-->输出文件
     * 删除无效行，按IP划分，存入map中
     * 输入文件：1.txt
     * 输出文件：shortresult1.txt
     * @return 关键字为ip，值为List<ShortLog>的map
     */
    public static Map<String,List<ShortLog>> ipSeperate() {
        FileInputStream fis = null;
        InputStreamReader isr = null;
        BufferedReader br = null;
        PrintWriter out = null;
        BufferedWriter bw = null;
        FileWriter fw = null;
        Map<String,List<ShortLog>> resultMap = new HashMap<>();
        try {
            String str = "";
            fis = new FileInputStream("1.txt");
            isr = new InputStreamReader(fis);
            br = new BufferedReader(isr);
            out = new PrintWriter(new BufferedWriter(new FileWriter("shortresult1.txt")));

            while ((str = br.readLine()) != null) {
                String[] row = str.split("\\s");
                String ip = row[0];
                String strtime = row[1];
                SimpleDateFormat dateFormat = new SimpleDateFormat("[dd/MMM/yyyy:HH:mm:ss",Locale.US);
                Date time = dateFormat.parse(strtime);
                String addr = row[4];
                String status = row[6];
                if (addr.contains(".js") || addr.contains(".css") || addr.contains(".png")
                        || addr.contains(".gif") || addr.contains("ico") || addr.contains(".jpg")){
                    continue;
                }
                if(status.matches("[1-3]+.*") == false) {
                    continue;
                }
                if(resultMap.containsKey(ip)) {
                    resultMap.get(ip).add(new ShortLog(ip,time,addr));
                } else {
                    if (ip.equals("0:0:0:0:0:0:0:1")) {
                        if (resultMap.containsKey("127.0.0.1")) {
                            resultMap.get("127.0.0.1").add(new ShortLog(ip,time,addr));
                        } else {
                            List<ShortLog> list = new ArrayList<>();
                            list.add(new ShortLog(ip,time,addr));
                            resultMap.put("127.0.0.1",list);
                        }
                    } else {
                        List<ShortLog> list = new ArrayList<>();
                        list.add(new ShortLog(ip,time,addr));
                        resultMap.put(ip,list);
                    }
                }
            }
            if (br != null) {
                br.close();
            }
            for (Map.Entry<String,List<ShortLog>> entry : resultMap.entrySet()) {
                out.println(entry.getKey());
                for (ShortLog item : entry.getValue()) {
                    out.println(item.toString());
                    if (item.getUrl().contains("jsessionid"))
                        out.println();
                }
                out.println();
            }
            if (out != null) {
                out.close();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return resultMap;
    }

    /**
     * 计算两次时间间隔分钟数
     * @param newTime
     * @param oldTime
     * @return 分钟数
     */
    public static long getSpan(Date newTime, Date oldTime) {
        long timeSpan = 0;
        long diff = newTime.getTime() - oldTime.getTime();
        long nd = 1000*24*60*60;//一天的毫秒数
        long nh = 1000*60*60;//一小时的毫秒数
        long nm = 1000*60;//一分钟的毫秒数
        timeSpan= diff%nd%nh/nm;//计算差多少分钟
        return timeSpan;
    }

    public static String isMatched(List<js> jsList, String url) {
        for (js item : jsList) {
            if (url.equals(item.getUrl())) {
                String js = "[" + item.getFunction() + "," + item.getText() + "]";
                return js;
            }
        }
        return null;
    }

    /**
     * 短日志文件的分析
     * 1.划分IP
     * 2.根据js和json文件生成字典
     * 3.输出日志文件信息和用户行为信息-->输出文件
     * 输出文件：shortresult2.txt
     */
    public static void shortLogAnalysis(){
        PrintWriter out = null;
        BufferedWriter bw = null;
        FileWriter fw = null;
        try {
            out = new PrintWriter(new BufferedWriter(new FileWriter("shortresult2.txt")));
            Map<String,List<ShortLog>> ipSeperate = ipSeperate();
            List<js> jsonJs = JsonJs.getJsonJs();
            for (Map.Entry<String,List<ShortLog>> entry : ipSeperate.entrySet()) {
                out.println("-------------------------------------------------");
                out.println(entry.getKey());
                Date oldTime = entry.getValue().get(0).getTime();
                for (ShortLog item : entry.getValue()) {
                    Date newTime = item.getTime();
                    if (getSpan(newTime,oldTime) > 30) {
                        out.println();
                    }
                    String url = item.getUrl().substring(1);
                    String matchStr = isMatched(jsonJs,url);
                    if ( matchStr != null) {
                        out.println(item.toString() + "    " + matchStr);
                    }
                    else out.println(item.toString());
                    oldTime = newTime;
                    if (item.getUrl().contains("jsessionid"))
                        out.println();
                }
                out.println();
            }
            if (out != null) {
                out.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 长日志文件的分析
     * 1.输入文件-->划分IP和session-->输出文件1
     * 2.根据js和json文件生成字典
     * 3.输出日志文件信息和用户行为信息-->输出文件2
     * 输入文件：localhost_access_particular_log.2017-07-10.txt
     * 输出文件1：longresult1.txt
     * 输出文件2：longresult2.txt
     */
    public static void longLogAnalysis(){
        FileInputStream fis = null;
        InputStreamReader isr = null;
        BufferedReader br = null;
        PrintWriter out = null;
        BufferedWriter bw = null;
        FileWriter fw = null;
        Map<String, Map<String,List<Log>>> ipSeperate = new HashMap<String, Map<String,List<Log>>>();
        try{
            String str = "";
            String str1 = "";
            fis = new FileInputStream("localhost_access_particular_log.2017-07-10.txt");
            isr = new InputStreamReader(fis);
            br = new BufferedReader(isr);
            out = new PrintWriter(new BufferedWriter(new FileWriter("longresult1.txt")));
            while ((str = br.readLine()) != null)  {
                String[] row = str.split("\\s");
                String ip = row[0].replaceAll("\"","");
                //System.out.println(ip);
                String strtime = row[2];
                SimpleDateFormat dateFormat = new SimpleDateFormat("[dd/MMM/yyyy:HH:mm:ss",Locale.US);
                Date time = dateFormat.parse(strtime);
                String sessionId = row[1];
                String addr = row[8];
                String http = row[7];
                StringBuffer browser = new StringBuffer();
                if (addr.contains(".js") || addr.contains(".css") || addr.contains(".png")
                        || addr.contains(".gif") || addr.contains("ico") || addr.contains(".jpg")){

                } else {
                    if (http.matches("[1-3]+.*")) { //删除无效状态码的记录
                        for (int i = 11; i < row.length; i++) { //整理浏览器字段格式
                            browser.append(row[i]);
                        }
                        Log log = new Log(ip,row[1],time,row[4],row[5],row[6],row[7],row[8],row[9],browser.toString());
                        if(ipSeperate.containsKey(ip)) {
                            //ipSeperate.get(ip).add(log);
                            if(ipSeperate.get(ip).containsKey(sessionId)) {
                                ipSeperate.get(ip).get(sessionId).add(log);
                            } else {
                                List<Log> list = new ArrayList<Log>();
                                list.add(log);
                                ipSeperate.get(ip).put(sessionId,list);
                            }
                        } else {
                            if (ip.equals("0:0:0:0:0:0:0:1")) {
                                if (ipSeperate.containsKey("127.0.0.1")) {
                                    //ipSeperate.get("127.0.0.1").add(log);
                                    if(ipSeperate.get("127.0.0.1").containsKey(sessionId)) {
                                        ipSeperate.get("127.0.0.1").get(sessionId).add(log);
                                    } else {
                                        List<Log> list = new ArrayList<Log>();
                                        list.add(log);
                                        ipSeperate.get("127.0.0.1").put(sessionId,list);
                                    }
                                } else {

                                    Map<String, List<Log>> map = new HashMap<String,List<Log>>();
                                    List<Log> list = new ArrayList<>();
                                    list.add(log);
                                    map.put(sessionId,list);
                                    ipSeperate.put("127.0.0.1",map);
                                }
                            } else {
                                Map<String, List<Log>> map = new HashMap<String,List<Log>>();
                                List<Log> list = new ArrayList<>();
                                list.add(log);
                                map.put(sessionId,list);
                                ipSeperate.put(ip,map);
                            }

                        }

                    }
                }
            }
            if (br!=null) {
                br.close();
            }
            for (Map.Entry<String, Map<String,List<Log>>> entry : ipSeperate.entrySet()) {
                out.println("----------------------------------------------------------");
                out.println(entry.getKey());
                for (Map.Entry<String,List<Log>> en : entry.getValue().entrySet()) {
                    out.println(en.getKey());
                    for (Log log : en.getValue()) {
                        out.println(log.toString());
                    }
                    out.println();
                }
                out.println();
            }
            if (out != null) {
                out.close();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        /**
         * 根据js和json生成的字典遍历日志文件
         */
        try {
            out = new PrintWriter(new BufferedWriter(new FileWriter("longresult2.txt")));

            List<js> jsonJs = JsonJs.getJsonJs(); //js和json生成的字典
            for (Map.Entry<String,Map<String,List<Log>>> entry : ipSeperate.entrySet()) {
                out.println("---------------------------------------");
                out.println(entry.getKey());
                for (Map.Entry<String,List<Log>> en : entry.getValue().entrySet()) {
                    out.println(en.getKey());
                    for (Log log : en.getValue()){
                        String isMatched = isMatched(jsonJs,log.getDest().substring(1));
                        if (isMatched != null) {
                            out.println(log.toString() + "    [" + isMatched + "]");
                        }
                        else out.println(log.toString());
                    }
                    out.println();
                }
                out.println();
            }
            if (out != null) {
                out.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
    public static void main(String[] args) {

        shortLogAnalysis();
        //longLogAnalysis();

    }
}

