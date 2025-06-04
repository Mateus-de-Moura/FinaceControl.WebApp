// src/services/signalRService.ts
import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection;

export function startSignalRConnection(userId: string, onMessage: (msg: string) => void) {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7113/notifyHub") 
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveNotification", onMessage);

  connection
    .start()
    .then(() => {
      console.log("✅ Conectado ao SignalR Hub");
      connection.invoke("RegisterUser", userId);
    })
    .catch(err => console.error("❌ Erro ao conectar ao SignalR Hub", err));
}

export function stopSignalRConnection() {
  if (connection) {
    connection.stop().then(() => console.log("🔌 SignalR desconectado"));
  }
}
