import { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 overflow-auto p-3 bg-light" style={{ minHeight: 0 }}>
        {messages.filter(m => m.role !== 'system').map((message) => (
          <div
            key={message.id}
            className={`mb-3 d-flex ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className={`p-3 rounded ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-white border'
              }`}
              style={{ maxWidth: '70%' }}
            >
              <div className="small mb-1">
                <strong>{message.role === 'user' ? 'You' : 'Nurse'}</strong>
              </div>
              <div>{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-3">
            <div className="bg-white border p-3 rounded" style={{ maxWidth: '70%' }}>
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-2">Nurse is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-top p-3 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Ask the nurse a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!input.trim() || isLoading}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
