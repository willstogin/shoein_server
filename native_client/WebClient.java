import java.io.*;
import java.net.*;

public class WebClient {

    private String baseUrl; //ends with /

    private String myToken;
    private String permChallenge;
    private String tempChallenge;

    public WebClient(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    /////////////
    // Getters //
    /////////////

    public String getMyToken() {
        return myToken;
    }

    public String getPermChallenge() {
        return permChallenge;
    }

    public String getTempChallenge() {
        return tempChallenge;
    }

    ///////////////////////////////
    // Interface with web server //
    ///////////////////////////////

    // Get a unique id from the server
    public void connect() {
        System.out.println("Checking with server for unique token.");

        try {
          StringBuilder result = new StringBuilder();
          URL url = new URL(this.baseUrl + "newClient");
          HttpURLConnection conn = (HttpURLConnection) url.openConnection();
          conn.setRequestMethod("GET");

          BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
          String line;
          while ((line = rd.readLine()) != null) {
             result.append(line);
          }
          rd.close();
          //System.out.println("localhost:8080/newSession/" + result.toString());
          this.myToken = result.toString();
          System.out.println("Token received from server " + this.myToken);
        } catch (Exception e) {
          System.out.println(e);
        }
    }

    // Request a challenge from the server
    public void requestChallenge(String uid, String perm_pk, String temp_pk) {
        System.out.println("Requesting challenge");

        try {
          StringBuilder result = new StringBuilder();
          String urlString =  new String(
              this.baseUrl + "request_challenge"+
              "?uid="+uid+
              "&perm_pk="+perm_pk+
              "&temp_pk="+temp_pk+
              "&token="+this.myToken);

          URL url = new URL(urlString);
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

    // Send the response to the challenge from the server
    public void sendResponse(String uid, String perm_response, String temp_response) {
        System.out.println("Sending response.");

        try {
          StringBuilder result = new StringBuilder();
          String urlString =  new String(
              this.baseUrl + "response"+
              "?uid="+uid+
              "&perm_response="+perm_response+
              "&temp_response="+temp_response+
              "&token="+this.myToken);

          URL url = new URL(urlString);
          HttpURLConnection conn = (HttpURLConnection) url.openConnection();
          conn.setRequestMethod("POST");

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

    // Log the user out when the device is disconnected
    public void logout() {
        System.out.println("Logging user out.");
        
        try {
          StringBuilder result = new StringBuilder();
          String urlString =  new String(
              this.baseUrl + "shoeDisconnected"+
              "&token="+this.myToken);

          URL url = new URL(urlString);
          HttpURLConnection conn = (HttpURLConnection) url.openConnection();
          conn.setRequestMethod("POST");

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
