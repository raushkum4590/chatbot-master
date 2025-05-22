"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Smile, Paperclip, Mic, Image, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGeminiSpeech } from "@/hooks/useGeminiSpeech";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInputGemini: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the Gemini speech hook
  const {
    isRecording,
    isProcessing,
    isSupported, 
    transcript,
    error,
    startRecording,
    stopRecording,
    resetTranscript
  } = useGeminiSpeech();

  // Use effect to track if component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update message with transcript when speech is detected
  useEffect(() => {
    if (!mounted) return;
    
    if (transcript) {
      // Only set the message if it's different from the current transcript
      setMessage(prev => {
        // If the transcript is already included in the message, don't add it again
        if (prev.includes(transcript)) {
          return prev;
        }
        return prev + (prev ? ' ' : '') + transcript;
      });
      
      // Reset the transcript to prepare for next recording
      resetTranscript();
    }
  }, [transcript, mounted, resetTranscript]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Show error if there's one
  useEffect(() => {
    if (error) {
      console.error("Gemini speech error:", error);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Stop speech recognition if active when submitting
    if (mounted && isRecording) {
      stopRecording();
    }
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset height after submission
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleRecording = () => {
    if (!mounted) return;
    
    if (!isSupported) {
      alert("Audio recording is not supported in your browser. Please try a different browser.");
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  // Mock emojis for the emoji picker
  const emojis = [
    "😊", "😂", "❤️", "🙌", "👍", "🎉", 
    "🤔", "😎", "😍", "🔥", "👏", "✨", 
    "🌟", "💯", "🙏", "😢", "😭", "😡",
    "🤩", "🥳", "🎓", "📚", "🏫", "❓", 
    "🎯", "👨‍🎓", "👩‍🎓", "💻", "📝", "🧠"
  ];

  // If not mounted yet, don't render anything to avoid hydration issues
  if (!mounted) {
    return (
      <div className="sticky bottom-0 p-3 flex items-end gap-2 h-16 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl"/>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 p-3 flex items-end gap-2 relative"
      aria-label="Chat input form"
    >
      {/* Emoji picker */}
      <AnimatePresence>
        {isEmojiPickerOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-10"
          >
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-8 h-8 text-xl flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => addEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative flex-1 flex items-end bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
        {isRecording && (
          <div className="absolute top-0 left-0 right-0 py-1 px-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 text-xs flex items-center justify-center">
            <span className="animate-pulse mr-1">●</span> Recording... Speak now
          </div>
        )}
        {isProcessing && (
          <div className="absolute top-0 left-0 right-0 py-1 px-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-200 text-xs flex items-center justify-center">
            <span className="mr-1">⏳</span> Processing with Gemini AI...
          </div>
        )}
        {!isRecording && !isProcessing && isSupported && (
          <div className="absolute top-0 left-0 right-0 py-1 px-2 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-200 text-xs flex items-center justify-center opacity-80">
            Click the microphone icon to use Gemini voice input
          </div>
        )}
        
        <div className="flex items-center p-2 self-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-blue-500 h-8 w-8 rounded-full"
            aria-label="Add emoji"
            disabled={disabled}
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
          >
            <Smile size={18} />
          </Button>
          <div className="relative">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={(e) => {
                // Handle file upload logic here
                console.log(e.target.files?.[0]);
              }} 
            />
          </div>
          
          {isSupported ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full ${
                isRecording || isProcessing 
                  ? 'bg-red-100 text-red-500 animate-pulse' 
                  : 'text-gray-500 hover:text-blue-500'
              }`}
              aria-label={isRecording ? "Stop recording" : "Start voice recording"}
              onClick={toggleRecording}
              disabled={disabled || isProcessing}
            >
              <Mic size={18} />
              {isRecording && <span className="sr-only">Recording in progress</span>}
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-gray-400"
              aria-label="Voice input not supported"
              disabled={true}
              title="Voice input is not supported in your browser"
            >
              <Mic size={18} />
              <span className="sr-only">Voice input not supported</span>
            </Button>
          )}
        </div>
        
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 max-h-[120px] resize-none overflow-y-auto px-3 py-3 focus:outline-none bg-transparent dark:text-white"
          rows={1}
          disabled={disabled}
          aria-label="Message input"
        />
        
        <div className="flex items-center p-2 self-end">
          
        </div>
      </div>
      
      <motion.div 
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          type="submit"
          disabled={!message.trim() && !isRecording || disabled}
          className={`rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-md ${
            isRecording 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }`}
          aria-label={isRecording ? "Stop recording and send" : "Send message"}
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">{isRecording ? "Send recording" : "Send"}</span>
        </Button>
      </motion.div>
    </form>  );
};

export default ChatInputGemini;
