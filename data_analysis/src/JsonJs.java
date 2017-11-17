import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhao on 2017/7/16.
 */
public class JsonJs {


    public static List<js> getJsonJs() {
        List<js> jsList = new ArrayList<>();
        try {
            FileInputStream fis = null;
            InputStreamReader isr = null;
            BufferedReader br = null;
            //List<js> jsList = new ArrayList<>();
            String str = "";
            List<String[]> func_urls = new ArrayList<>();
            fis = new FileInputStream("dblib.js");
            isr = new InputStreamReader(fis);
            br = new BufferedReader(isr);
            String function = "";
            String varclass = "";
            String url = "";
            while ((str = br.readLine()) != null) {
                String[] func_url = new String[2];
                if (str.contains(".Index = function ()")) {
                    String[] row = str.split("\\.");
                    varclass = row[0];
                }
                 if (str.contains("function _")) {
                    String[] row = str.split("\\s+");
                    String func = row[2];
                    function = varclass + "." + func.substring(0,func.indexOf("(")).replaceAll("\\s+","");
                }
                if (str.contains("url:")) {

                    if (str.contains("\"")) {
                        url = str.substring(str.indexOf("\"")+1,str.indexOf("\"",str.indexOf("\"")+1));
                    } else {
                        url = str.substring(str.indexOf("\'")+1,str.indexOf("\'",str.indexOf("\'")+1));
                    }
                    func_url[0] = function;
                    func_url[1] = url;
                    if (function.length() != 0) func_urls.add(func_url);
                    function = "";
                }
                if (str.contains("unbind().bind") && str.contains("function") == false) {
                    //String newstr = str.replaceAll("\\s+","");
                    String[] row = str.split("\\.");
                    String button = row[0].substring(row[0].indexOf("#")+1,row[0].length()-2).replaceAll("\\s+","");
                    function = varclass + "." + row[2].substring(row[2].indexOf(",")+1,row[2].length()-2).replaceAll("\\s+","");
                    jsList.add(new js(function,button,null));
                }

            }
            for (String[] strings : func_urls) {
//                System.out.println(strings[0] + "," +strings[1]);
                for (js item : jsList) {
                    if (item.getFunction().equals(strings[0]))
                        item.setUrl(strings[1]);
                }
            }





        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }


        try {
            JsonReader reader = null;
            InputStream in= null;
            in = new FileInputStream(new File("json"));
            reader = Json.createReader(in);
            JsonObject obj = reader.readObject();
            JsonArray results = obj.getJsonArray("edges");
            String button = "";
            String text = "";
            for (JsonObject result : results.getValuesAs(JsonObject.class)) {
                if (result.getString("text").length() > 1){
                    text = result.getString("text").replaceAll("\\s+","");
                    String element = result.getString("element");
                    int id = element.indexOf("id=");
                    int comm = element.indexOf(",",id);
//                    System.out.println("id:" + id);
//                    System.out.println(",:" +comm);
                    if (comm != -1 && id != -1) {
                        button = element.substring(id+3,comm);
                    }
                    if (comm == -1 && id != -1){
                        button = element.substring(id+3,element.length()-2);
                    }
                    for (js item : jsList) {
                        if (item.getButton().equals(button)){
                            item.setText(text);
                        }
                        //System.out.println(item.toString());
                        //System.out.println(re.values());
                    }
//                    System.out.println(element.substring(element.indexOf("id=")+3,element.indexOf(",")element.length()-2));

                }

            }

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        try {
            PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("js-json.txt")));
            for (js item : jsList) {
                System.out.println(item.toString());
                out.println(item.toString());
                //System.out.println(re.values());
            }
            if (out != null) {
                out.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }


        return jsList;
    }

    public static boolean isContainKey(List<js> list, String key) {
        for (js item : list ){
            if (item.getFunction().equals(key))
                return true;
        }
        return false;
    }



}
