

public class ConsoleManager {

    private WebClient webClient;

    public ConsoleManager(WebClient webClient) {
        this.webClient = webClient;
    }

    /*
     * List of events:
     * shoe connected
     *   get the shoe uid, perm_pk, temp_pk
     *   save the shoe uid
     *   webServer.requestChallenge(...)
     *   get the challenges from webServer and send to the device
     * response
     *   get the perm_response, temp_response
     *   webServer.sendResponse(...)
     * shoe disconnected
     *   webServer.logout()
     */


    // This method contains the main loop, listening to the console for commands.
    public void listen() {
        // TODO implement the loop!

        // Listen for an event
    }
}
