"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Smile, Paperclip, Mic, Image, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);  // Speech recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition({
    clearTranscriptOnListen: true,
    commands: []
  });  // Show warning message if browser doesn't support speech recognition
  useEffect(() => {
    if (mounted) {
      if (!browserSupportsSpeechRecognition) {
        console.warn("This browser doesn't support speech recognition.");
        
        // Try to detect why it might not be supported
        if (typeof window !== 'undefined') {
          const hasSpeechRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
          console.log("SpeechRecognition API check:", hasSpeechRecognition);
          
          if (!window.isSecureContext) {
            console.error("Speech recognition requires a secure context (HTTPS)");
          }
        }
      } else {
        console.log("Speech recognition is supported by this browser");
      }
      
      // Log browser details for debugging
      if (typeof window !== 'undefined') {
        console.log("Browser info:", {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          vendor: navigator.vendor,
          language: navigator.language,
          secure: window.isSecureContext,
          protocol: window.location.protocol,
          hasSpeechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
          hasWebkitSpeechRecognition: !!(window.webkitSpeechRecognition)
        });
      }
    }
  }, [browserSupportsSpeechRecognition, mounted]);
  // Set mounted state once component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
    
    // Check if we're in a secure context (required for speech recognition)
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      console.error("Speech recognition requires a secure context (HTTPS)");
    }
    
    // Check microphone permission on mount
    if (mounted && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          console.log("Microphone permission granted");
        })
        .catch(err => {
          console.error("Microphone permission denied:", err);
          alert("Please allow microphone access for speech recognition to work.");
        });
    }
  }, [mounted]);// Update message with transcript when speech is detected
  useEffect(() => {
    if (!mounted) return; // Only run on client side
    
    if (transcript) {
      console.log("Transcript received:", transcript);
      
      // Handle transcript properly
      setMessage(prev => {
        // Don't add duplicate text if the transcript is already in the message
        if (prev.includes(transcript)) {
          return prev;
        }
        
        // Add the transcript with proper spacing
        return prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + transcript;
      });
      
      // Don't reset transcript immediately to prevent losing parts of longer statements
      if (!listening) {
        resetTranscript();
      }
    }
  }, [transcript, listening, mounted, resetTranscript]);

  // Sync isRecording with listening state
  useEffect(() => {
    if (mounted) {
      setIsRecording(listening);
    }
  }, [listening, mounted]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Stop speech recognition if active when submitting
    if (mounted && listening) {
      console.log("Stopping speech recognition during form submission");
      SpeechRecognition.stopListening();
      setIsRecording(false);
    }
    
    if (message.trim() && !disabled) {
      console.log("Sending message:", message.trim());
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
  };  const toggleRecording = () => {
    if (!mounted) return; // Only run on client side
    
    // Check for secure context
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      console.error("Speech recognition requires a secure connection (HTTPS)");
      alert("Speech recognition requires a secure connection (HTTPS). Please switch to a secure connection.");
      return;
    }
    
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser doesn't support speech recognition");
      alert("Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.");
      
      // Open the diagnostics page in a new tab
      window.open("/speech-diagnostics", "_blank");
      return;
    }
    
    if (!isMicrophoneAvailable) {
      console.error("Microphone is not available");
      alert("Microphone access is required for speech recognition. Please allow microphone access in your browser settings.");
      return;
    }

    try {
      if (listening) {
        console.log("Stopping speech recognition");
        SpeechRecognition.stopListening();
      } else {
        console.log("Starting speech recognition");
        resetTranscript();
        SpeechRecognition.startListening({ 
          continuous: true,
          language: 'en-US',
          interimResults: true
        });
      }
      setIsRecording(!isRecording);
    } catch (err) {
      console.error("Error toggling speech recognition:", err);
      alert(`Speech recognition failed: ${err.message}. Please try again or use text input.`);
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
  // Don't render the full component if not mounted yet (to avoid hydration issues)
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
      className="sticky bottom-0 p-3 flex items-end gap-2"
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
        {listening && (
          <div className="absolute top-0 left-0 right-0 py-1 px-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 text-xs flex items-center justify-center">
            <span className="animate-pulse mr-1">●</span> Listening... Speak now
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${listening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-blue-500'}`}
            aria-label={listening ? "Stop recording" : "Start voice recording"}
            onClick={toggleRecording}
            disabled={disabled}
          >
            <Mic size={18} />
            {listening && <span className="sr-only">Recording in progress</span>}
          </Button>
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-blue-500 h-8 w-8 rounded-full"
            aria-label="Test Speech"
            onClick={() => setMessage(prev => 
              prev + (prev ? ' ' : '') + "What is the average GPA of admitted students?"
            )}
            title="Insert test question about GPA"
          >
            <span className="text-xs">GPA</span>
          </Button>
        </div>
      </div>
      
      <motion.div 
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          type="submit"
          disabled={!message.trim() && !listening || disabled}
          className={`rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-md ${
            listening 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }`}
          aria-label={listening ? "Send recording" : "Send message"}
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">{listening ? "Send recording" : "Send"}</span>
        </Button>
      </motion.div>
    </form>
  );
};

export default ChatInput;
