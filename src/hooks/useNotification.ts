// src/hooks/useNotification.ts
import { useEffect } from 'react';
import { startSignalRConnection, stopSignalRConnection } from '../Signal/signalRService';

export function useNotification(userId: string, onNotify: (msg: string) => void) {
  useEffect(() => {
    if (!userId) return;

    startSignalRConnection(userId, onNotify);

    return () => {
      stopSignalRConnection();
    };
  }, [userId, onNotify]);
}
