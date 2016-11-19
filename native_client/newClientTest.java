import java.io.*;
import java.net.*;


public class newClientTest {

  public static void main(String[] args) {
    try {
      StringBuilder result = new StringBuilder();
      String urlString =  new String("http://localhost:8080/newClient");
      URL url = new URL(urlString);
      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("GET");


      BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
      String line;
      while ((line = rd.readLine()) != null) {
         result.append(line);
      }
      rd.close();
      System.out.println("localhost:8080/newSession/" + result.toString());
    } catch (Exception e) {
      System.out.println(e);

    }

  }
}
