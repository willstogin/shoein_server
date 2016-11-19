import java.io.*;
import java.net.*;


public class requestChallengeTester {

  public static void main(String[] args) {
    try {
      StringBuilder result = new StringBuilder();
      URL url = new URL("http://localhost:8080/request_challenge", "armbar");
      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("GET");
      BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
      String line;
      while ((line = rd.readLine()) != null) {
         result.append(line);
      }
      rd.close();
      System.out.println(result.toString());
    } catch (Exception e) {
      System.out.println(e);

    }

  }
}
