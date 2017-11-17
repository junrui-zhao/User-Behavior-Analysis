import java.util.Date;

/**
 * Created by zhao on 2017/7/11.
 */
public class Log {
    private String ip;
    private String sessionId;
    private Date time;
    private String stay;
    private String protocol;
    private String method;
    private String state;
    private String dest;
    private String refer;
    private String browser;

    @Override
    public String toString() {
        return "Log{" +
                "ip='" + ip + '\'' +
                ", sessionId='" + sessionId + '\'' +
                ", time='" + time + '\'' +
                ", dest='" + dest + '\'' +
                ", refer='" + refer + '\'' +
                '}';
    }

    public Log(String ip, String sessionId, Date time, String stay, String protocol,
               String method, String state, String dest, String refer, String browser) {
        this.ip = ip;
        this.sessionId = sessionId;
        this.time = time;
        this.stay = stay;
        this.protocol = protocol;
        this.method = method;
        this.state = state;
        this.dest = dest;
        this.refer = refer;
        this.browser = browser;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public String getStay() {
        return stay;
    }

    public void setStay(String stay) {
        this.stay = stay;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDest() {
        return dest;
    }

    public void setDest(String dest) {
        this.dest = dest;
    }

    public String getRefer() {
        return refer;
    }

    public void setRefer(String refer) {
        this.refer = refer;
    }

    public String getBrowser() {
        return browser;
    }

    public void setBrowser(String browser) {
        this.browser = browser;
    }
}
