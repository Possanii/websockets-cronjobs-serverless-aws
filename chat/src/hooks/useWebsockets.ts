import { useRef, useState, useEffect, useCallback } from 'react';

interface IUseWebSocketsOptions {
  url: string;
  onMessage: <T extends Record<string, any>>(data: T) => void;
}

export function useWebsockets({ url, onMessage }: IUseWebSocketsOptions) {
  const websocket = useRef<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const memorizedOnMessage = useRef(onMessage);

  useEffect(() => {
    const ws = new WebSocket(url);
    websocket.current = ws;

    function handleNewMessage(event: MessageEvent<string>) {
      const data = JSON.parse(event.data);
      memorizedOnMessage.current(data);
    }

    function handleOpen() {
      setIsLoading(false);
    }

    function handleError() {
      setHasError(true);
    }

    ws.addEventListener('message', handleNewMessage);
    ws.addEventListener('open', handleOpen);
    ws.addEventListener('error', handleError);

    return () => {
      ws.removeEventListener('message', handleNewMessage);
      ws.removeEventListener('open', handleOpen);
      ws.removeEventListener('error', handleError);
      ws.close();
      websocket.current = null;
    };
  }, [url]);

  const sendMessage = useCallback(
    (data: { action: 'sendMessage'; [k: string]: any }) => {
      websocket.current?.send(JSON.stringify(data));
    },
    []
  );

  return { websocket, isLoading, sendMessage, hasError };
}
