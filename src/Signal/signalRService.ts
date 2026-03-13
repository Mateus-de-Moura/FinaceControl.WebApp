// src/services/signalRService.ts
import * as signalR from '@microsoft/signalr';

const API_Signal = "http://localhost:8080/notifyHub";

let connection: signalR.HubConnection | null = null;
const pendingInvokes: Array<() => Promise<void>> = [];

export async function startSignalRConnection(
  userId: string,
  onMessage: (msg: string) => void
) {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(API_Signal)
      .withAutomaticReconnect([0, 2000, 5000, 10000]) // reconexão automática
      .build();

    connection.on("ReceiveNotification", onMessage);

    // NÃO chame start() dentro de onclose
    connection.onreconnected(() => {
      console.log("SignalR reconnected.");
      processPendingInvokes();
    });

    connection.onreconnecting((error) => {
      console.warn("SignalR reconnecting...", error);
    });

    connection.onclose(() => {
      console.warn("SignalR connection closed.");
    });
  }

  // inicia a conexão somente se estiver desconectada
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    try {
      await connection.start();
      console.log("SignalR Connected.");
      await safeInvoke(() => connection!.invoke("RegisterUser", userId));
      processPendingInvokes();
    } catch (err) {
      console.error("SignalR connection failed:", err);
      setTimeout(() => startSignalRConnection(userId, onMessage), 5000);
    }
  }
}

async function safeInvoke(fn: () => Promise<void>) {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    try {
      await fn();
    } catch (err) {
      console.error("Error invoking SignalR method:", err);
    }
  } else {
    pendingInvokes.push(fn);
  }
}

function processPendingInvokes() {
  while (pendingInvokes.length > 0) {
    const fn = pendingInvokes.shift()!;
    safeInvoke(fn);
  }
}

export async function sendNotification(msg: string) {
  await safeInvoke(() =>
    connection!.invoke("ReceiveNotification", msg)
  );
}

export async function stopSignalRConnection() {
  if (connection) {
    try {
      await connection.stop();
      console.log("SignalR Disconnected.");
      connection = null;
    } catch (err) {
      console.error("Error stopping SignalR connection:", err);
    }
  }
}