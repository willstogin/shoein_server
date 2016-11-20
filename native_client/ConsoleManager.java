import java.util.Scanner;

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
        Scanner scan = new Scanner(System.in);
        boolean loop = true;
        System.out.println("Enter the following commands to interacet with the API:\n requestChallenge, sendResponse, logout, exit");
        while (loop) {
            String command = scan.next();
            switch(command){
                case "requestChallenge":
                    System.out.println("Enter uid");
                    String uid = scan.next();

                    System.out.println("Enter perm_pk");
                    String perm_pk = scan.next();

                    System.out.println("Enter temp_pk");
                    String temp_pk = scan.next();

                    this.webClient.requestChallenge(uid, perm_pk, temp_pk);
                    break;
                case "sendResponse":
                    System.out.println("Enter uid");
                    String res_uid = scan.next();

                    System.out.println("Enter perm_response");
                    String perm_response = scan.next();

                    System.out.println("Enter temp_response");
                    String temp_response = scan.next();


                    this.webClient.sendResponse(res_uid, perm_response, temp_response);
                    break;
                case "logout":
                    this.webClient.logout();
                    break;
                case "exit":
                    loop = false;
                    break;
                default:
                    System.out.println(command +" is not a valid command");
            }
        }

    }
}
