// src/services/signalRService.ts
import * as signalR from '@microsoft/signalr';

//Prod
//const API_Signal = "http://192.168.18.5:8080/notifyHub"

//Hmlg
const API_Signal = "https://localhost:7113/notifyHub"

let connection: signalR.HubConnection;

export function startSignalRConnection(userId: string, onMessage: (msg: string) => void) {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(API_Signal) 
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveNotification", onMessage);

  connection
    .start()
    .then(() => {      
      connection.invoke("RegisterUser", userId);
    })
    .catch();
}

export function stopSignalRConnection() {
  if (connection) {
    connection.stop().then();
  }
}
