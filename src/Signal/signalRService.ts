// src/services/signalRService.ts
import * as signalR from '@microsoft/signalr';

// Prod
const API_Signal = "http://localhost:8080/notifyHub";

// let connection global
let connection: signalR.HubConnection | null = null;

// fila de mensagens que tentamos enviar antes da conexão estar pronta
const pendingInvokes: Array<() => Promise<void>> = [];

/**
 * Inicia a conexão SignalR e registra o usuário
 * @param userId Id do usuário
 * @param onMessage Callback para receber mensagens
 */
export async function startSignalRConnection(
  userId: string,
  onMessage: (msg: string) => void
) {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(API_Signal)
      .withAutomaticReconnect([0, 2000, 5000, 10000]) // reconexões automáticas
      .build();

    // listener para receber mensagens
    connection.on("ReceiveNotification", onMessage);

    // listener quando a conexão fechar
    connection.onclose(async () => {
      console.warn("SignalR connection closed. Reconnecting...");
      await tryStartConnection(userId);
    });
  }

  // inicia a conexão
  await tryStartConnection(userId);
}

/**
 * Tenta iniciar a conexão e processa a fila de invokes pendentes
 */
async function tryStartConnection(userId: string) {
  if (!connection) return;

  try {
    await connection.start();
    console.log("SignalR Connected.");

    // registra o usuário
    await safeInvoke(() => connection!.invoke("RegisterUser", userId));

    // processa mensagens pendentes
    while (pendingInvokes.length > 0) {
      const fn = pendingInvokes.shift()!;
      await safeInvoke(fn);
    }
  } catch (err) {
    console.error("SignalR connection failed:", err);
    // tenta reconectar em 5s
    setTimeout(() => tryStartConnection(userId), 5000);
  }
}

/**
 * Executa invoke de forma segura, só se a conexão estiver pronta
 */
async function safeInvoke(fn: () => Promise<void>) {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    try {
      await fn();
    } catch (err) {
      console.error("Error invoking SignalR method:", err);
    }
  } else {
    // se não estiver conectado, coloca na fila
    pendingInvokes.push(fn);
  }
}

/**
 * Envia notificação via SignalR
 */
export async function sendNotification(msg: string) {
  await safeInvoke(() =>
    connection!.invoke("ReceiveNotification", msg)
  );
}

/**
 * Para a conexão SignalR
 */
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