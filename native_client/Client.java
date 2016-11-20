

public class Client {

    public static void main(String args[]) {
        String baseUrl = "localhost:8080/";
        WebClient webClient = new WebClient(baseUrl);
        webClient.connect();
        System.out.println(baseUrl+"newSession/"+webClient.getMyToken());

        // used for testing
        ConsoleManager consoleManager = new ConsoleManager(webClient);
        consoleManager.listen();
    }
    
}
