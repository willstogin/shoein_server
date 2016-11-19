import java.io.*;
import java.net.*;


public class requestChallengeTester {

  public static void main(String[] args) {
    try {
      StringBuilder result = new StringBuilder();
      String urlString =  new String("http://localhost:8080/request_challenge"+"?uid=armbar&perm_pk=armbar&temp_pk=armbar");
      URL url = new URL(urlString);
      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("POST");
      String urlParameters = "uid=armbar&cn=&locale=&caller=&num=12345";




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
