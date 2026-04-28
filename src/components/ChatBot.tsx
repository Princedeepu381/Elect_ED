"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Minimize2 } from "lucide-react";
import styles from "./ChatBot.module.css";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am your ElectEd AI Guide. How can I help you navigate the Indian election process today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Upstream service error");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let assistantMessage = "";
      const decoder = new TextDecoder();
      
      // Add empty message for streaming and clear loading early
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      setIsLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantMessage;
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Please try again later." }]);
      setIsLoading(false);
    }
  };

  // Simple formatter for bold text and line breaks
  const formatMessage = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={styles.wrapper}>
      {!isOpen ? (
        <button 
          className={styles.launcher} 
          onClick={() => setIsOpen(true)}
          aria-label="Open ElectED AI Assistant"
          title="Ask AI Assistant"
        >
          <MessageSquare size={24} />
          <span className={styles.launcherText}>ASK AI</span>
        </button>
      ) : (
        <div className={`${styles.chatWindow} fade-in-up`}>
          <header className={styles.chatHeader}>
            <div className={styles.headerTitle}>
              <Bot size={20} className={styles.botIcon} />
              <div>
                <div className={styles.botName}>ELECTED AI</div>
                <div className={styles.botStatus}>ONLINE</div>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <Minimize2 size={18} />
            </button>
          </header>

          <div 
            className={styles.messages} 
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-label="Chat history"
          >
            {messages.map((m, i) => (
              <div key={i} className={`${styles.messageRow} ${m.role === 'user' ? styles.userRow : styles.assistantRow}`}>
                <div className={styles.avatar}>
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={styles.bubble}>{formatMessage(m.content)}</div>
              </div>
            ))}
            {isLoading && (
              <div className={styles.assistantRow}>
                <div className={styles.avatar}><Bot size={14} /></div>
                <div className={styles.bubble}>Processing...</div>
              </div>
            )}
          </div>

          <footer className={styles.inputArea}>
            <input 
              type="text" 
              placeholder="ASK ABOUT LAWS, DATES, OR PROCESSES..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              aria-label="Ask about election laws, dates, or processes"
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading}
              aria-label="Send message"
              title="Send message"
            >
              <Send size={18} />
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
