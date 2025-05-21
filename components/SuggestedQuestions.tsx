"use client";
import React from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelectQuestion }) => {
  const questions = [
    "What programs do you offer?",
    "How can I apply for admission?",
    "What are the eligibility criteria?",
    "What facilities do you have?",
    "Can I get a scholarship?",
    "What is the application deadline?",
    "Where is the campus located?",
    "Are there internship opportunities?",
  ];

  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <div className="py-3 px-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle size={16} className="text-blue-500" />
        <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
          Suggested questions
        </p>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-2 overflow-x-auto pb-1.5 custom-scrollbar"
      >
        {questions.map((question, index) => (
          <motion.button
            key={index}
            variants={item}
            whileHover={{ 
              scale: 1.03, 
              backgroundColor: "rgba(59, 130, 246, 0.1)", 
              transition: { duration: 0.2 } 
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectQuestion(question)}
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 
            dark:from-blue-900/30 dark:to-blue-800/40
            text-blue-800 dark:text-blue-200 text-sm transition-all duration-300 
            border border-blue-200/70 dark:border-blue-800/50 
            shadow-sm hover:shadow-md flex-shrink-0 whitespace-nowrap"
          >
            {question}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default SuggestedQuestions;
