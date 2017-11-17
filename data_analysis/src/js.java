/**
 * Created by zhao on 2017/7/16.
 */
public class js {
    private String function;
    private String button;
    private String url;
    private String text;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @Override
    public String toString() {
        return "js{" +
                "function='" + function + '\'' +
                ", button='" + button + '\'' +
                ", url='" + url + '\'' +
                ", text='" + text + '\'' +
                '}';
    }

    public String getFunction() {
        return function;
    }

    public void setFunction(String function) {
        this.function = function;
    }

    public js(String function, String button, String url) {
        this.function = function;
        this.button = button;
        this.url = url;
    }



    public js() {
    }

    public js( String button, String url) {
        this.button = button;
        this.url = url;
    }


    public String getButton() {
        return button;
    }

    public void setButton(String button) {
        this.button = button;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

}
