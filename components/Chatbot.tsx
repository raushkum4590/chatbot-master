"use client";
import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2, Moon, Sun, X, MessageSquare } from "lucide-react";

interface Message {
  text: string;
  type: "user" | "bot";
  timestamp?: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm Grace College's AI assistant. How can I help you with information about our programs, admissions, facilities, or other inquiries?",
      type: "bot",
      timestamp: getCurrentTime(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Set initial dark mode preference based on system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, type: "user", timestamp: getCurrentTime() }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, type: "bot", timestamp: getCurrentTime() }]);
      if (!isOpen) setUnreadCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          type: "bot",
          timestamp: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([{
      text: "Hi there! I'm Grace College's AI assistant. How can I help you with information about our programs, admissions, facilities, or other inquiries?",
      type: "bot",
      timestamp: getCurrentTime(),
    }]);
  };

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      setIsOpen(true);
    }
  };

  // If minimized, show only the floating button
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${
            isDarkMode 
              ? "bg-gradient-to-br from-blue-700 to-indigo-800" 
              : "bg-gradient-to-br from-blue-500 to-indigo-600"
          } text-white`}
          onClick={toggleMinimized}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <MessageSquare size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </motion.button>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 flex justify-center items-center z-50 ${isDarkMode ? 'dark' : ''}`}>
      {/* Gradient background layer with improved colors */}
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? "bg-gradient-to-tr from-[#0f172a]/95 via-[#1e3a8a]/85 to-[#3b82f6]/75" 
          : "bg-gradient-to-tr from-[#1e3a8a]/90 via-[#3b82f6]/80 to-[#93c5fd]/70"
      }`}></div>
      {/* Semi‑transparent overlay with reduced opacity for better readability */}
      <div className="absolute inset-0 bg-black opacity-10"></div>

      {/* Chat container with enhanced glass morphism effect */}
      <div className="relative w-full h-full max-w-3xl mx-4 my-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.15)] dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-white/20 dark:border-white/10">
        {/* Header with improved styling */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl font-bold">G</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Grace College Assistant</h3>
              <p className="text-xs opacity-75">Engineering Excellence in Tamil Nadu</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
           
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen((o) => !o)}
              className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
              aria-label={isOpen ? "Collapse chat" : "Expand chat"}
            >
              {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMinimized}
              className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
              aria-label="Minimize chat"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Messages with improved animation */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
              ref={chatContainerRef}
              style={{ scrollBehavior: "smooth" }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatMessage 
                    key={idx} 
                    message={msg.text} 
                    type={msg.type} 
                    timestamp={msg.timestamp}
                  />
                </motion.div>
              ))}
              
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                    G
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 inline-flex space-x-1.5">
                    <motion.span 
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-2.5 h-2.5 bg-blue-500 rounded-full" 
                    />
                    <motion.span 
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                      className="w-2.5 h-2.5 bg-blue-500 rounded-full" 
                    />
                    <motion.span 
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                      className="w-2.5 h-2.5 bg-blue-500 rounded-full" 
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}        </AnimatePresence>        {/* Input & suggestions with improved styling */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm">
          <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
          <SuggestedQuestions onSelectQuestion={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
