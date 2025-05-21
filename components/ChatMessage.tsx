import React, { useState } from "react";
import { User, ThumbsUp, ThumbsDown, Copy, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type MessageType = "user" | "bot";
type Reaction = "like" | "dislike" | null;

interface ChatMessageProps {
  message: string;
  type: MessageType;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, type, timestamp }) => {
  const [reaction, setReaction] = useState<Reaction>(null);
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleReaction = (newReaction: Reaction) => {
    // Toggle reaction if clicking the same button
    if (reaction === newReaction) {
      setReaction(null);
    } else {
      setReaction(newReaction);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex ${
        type === "user" ? "justify-end" : "justify-start"
      } mb-4 group relative`}
      onMouseEnter={() => type === "bot" && setShowActions(true)}
      onMouseLeave={() => type === "bot" && setShowActions(false)}
    >
      {type === "bot" && (
        <div className="mr-2 mt-0.5 flex-shrink-0">
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
            <span className="text-sm font-bold">G</span>
          </div>
        </div>
      )}
      
      <div className="max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-3 ${
            type === "user" 
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-sm"
              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700 shadow-sm"
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-between mt-1 px-2">
          {timestamp && (
            <p className="text-[10px] text-gray-500 opacity-70 group-hover:opacity-100 transition-opacity">
              {timestamp}
            </p>
          )}
          
          {type === "bot" && showActions && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex space-x-1"
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 rounded-full ${reaction === 'like' ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                onClick={() => handleReaction('like')}
              >
                <ThumbsUp size={13} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 rounded-full ${reaction === 'dislike' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                onClick={() => handleReaction('dislike')}
              >
                <ThumbsDown size={13} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 rounded-full ${copied ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                onClick={copyToClipboard}
              >
                <Copy size={13} />
                {copied && (
                  <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-[10px] bg-blue-500 text-white rounded px-1.5 py-0.5">
                    Copied!
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Share2 size={13} />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      
      {type === "user" && (
        <div className="ml-2 mt-0.5 flex-shrink-0">
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
            <User size={18} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;