import { Loader2, SendIcon } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { useEffect, useRef, useState } from 'react';
import { useWebsockets } from './hooks/useWebsockets';

export function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { websocket, isLoading, sendMessage } = useWebsockets({
    url: 'wss://zlhmtsr6s0.execute-api.us-east-1.amazonaws.com/dev',
    onMessage: (payload: Record<string, any>) => {
      setMessages((prev) => prev.concat(payload.message));
    },
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const lastMessage = containerRef.current.lastElementChild;

    lastMessage?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!websocket.current) return;

    sendMessage({ action: 'sendMessage', message });

    setMessage('');
  }

  return (
    <div className="h-screen grid place-items-center bg-zinc-200">
      <div className="w-full max-w-xl space-y-10">
        {isLoading ? (
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="animate-spin" />
            <span>Joining on chat...</span>
          </div>
        ) : (
          <>
            <div
              className="bg-white max-h-96 overflow-y-auto rounded-lg shadow-md shadow-black/5 p-6 space-y-4"
              ref={containerRef}
            >
              {messages.map((msg, index) => (
                <div key={index} className="bg-zinc-50 border rounded-md p-3">
                  {msg}
                </div>
              ))}
            </div>

            <form className="flex items-center gap-4" onSubmit={handleSubmit}>
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              <Button>
                Send <SendIcon className="size-5" />
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
