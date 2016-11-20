

public class WebClient {

    private String baseUrl;

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
        System.out.println("Checking with server for unique id.");
        // TODO
    }

    // Request a challenge from the server
    public void requestChallenge() {
        System.out.println("Requesting challenge");
        // TODO
    }

    // Send the response to the challenge from the server
    public void sendResponse() {
        System.out.println("Sending response.");
        // TODO
    }

    // Log the user out when the device is disconnected
    public void logout() {
        System.out.println("Logging user out.");
        // TODO
    }
    
}
