import React, { useState, useEffect, useRef } from 'react';
import { getChatResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{
        role: 'model',
        text: "Hello! I'm your AI Skin Health Assistant. How can I help you today? You can ask me general questions about skincare, skin conditions, or healthy habits."
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const responseStream = await getChatResponse(input);
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        modelResponse += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = modelResponse;
            return newMessages;
        });
      }

    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = 'Sorry, I encountered an error. Please check your connection or API key and try again.';
      setError(errorMessage);
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 flex flex-col" style={{height: '70vh'}}>
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-700">AI Health Assistant</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <Bot size={20} />
              </div>
            )}
            <div className={`px-4 py-2 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-800'}`}>
               <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.role === 'user' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                <User size={20} />
              </div>
            )}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Bot size={20} />
                </div>
                <div className="px-4 py-3 rounded-lg bg-slate-100 text-slate-800">
                    <Loader2 className="animate-spin h-5 w-5 text-slate-500" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about skin health..."
            className="flex-grow block w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
