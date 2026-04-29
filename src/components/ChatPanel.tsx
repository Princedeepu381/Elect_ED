"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ChatPanel.module.css";
import { Send, X, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your ElectEd AI Assistant. Ask me anything about the election process in India!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || "Failed to get response from AI");
      }

      // Handle potential non-streaming response for robustness
      const reader = response.body?.getReader();
      if (!reader) {
        const text = await response.text();
        setMessages(prev => [...prev, { role: "assistant", content: text }]);
        setIsLoading(false);
        return;
      }

      let assistantMessage = "";
      const decoder = new TextDecoder();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          assistantMessage += chunk;
          
          setMessages(prev => {
            const newMessages = [...prev];
            const last = newMessages[newMessages.length - 1];
            if (last.role === "assistant") {
              last.content = assistantMessage;
            } else {
              newMessages.push({ role: "assistant", content: assistantMessage });
            }
            return newMessages;
          });
        }
      } catch (err) {
        console.error("Stream read error:", err);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again later." }]);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.titleWrapper}>
            <div className={styles.botIcon}>
              <Bot size={20} />
            </div>
            <div>
              <h3>Election Assistant</h3>
              <span className={styles.status}>Online • Powered by Gemini</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close Election Assistant">
            <X size={20} />
          </button>
        </header>

        <div className={styles.messagesContainer}>
          {messages.map((msg, i) => (
            <div key={i} className={`${styles.messageWrapper} ${styles[msg.role]}`}>
              <div className={styles.avatar}>
                {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={styles.messageContent}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1].role === "user" && (
            <div className={`${styles.messageWrapper} ${styles.assistant}`}>
              <div className={styles.avatar}>
                <Bot size={16} />
              </div>
              <div className={styles.messageContent}>
                <Loader2 size={16} className={styles.spinner} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className={styles.inputArea} onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about registration, EVMs, etc..."
            disabled={isLoading}
          />
          <button type="submit" disabled={!input.trim() || isLoading} className={styles.sendBtn} aria-label="Send message">
            {isLoading ? <Loader2 size={18} className={styles.spinner} /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
