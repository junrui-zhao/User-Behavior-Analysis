import java.util.Date;

/**
 * Created by zhao on 2017/7/18.
 */
public class ShortLog {

    private String ip;
    private Date time;
    private String url;

    public ShortLog(String ip, Date time,String url) {
        this.ip = ip;
        this.time = time;
        this.url = url;
    }

    @Override
    public String toString() {
        return "ShortLog{" +
                "ip='" + ip + '\'' +
                ", time=" + time +
                ", url='" + url + '\'' +
                '}';
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }


}
