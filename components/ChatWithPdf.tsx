"use client";

import { FormEvent, useEffect, useState, useRef, useTransition } from "react";
import { Button } from "./ui/button";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { Loader } from "lucide-react";
import { askQuestion } from "@/actions/askQuestion";
import { format } from "date-fns";
import { User } from "@clerk/nextjs";
import { Bot } from "lucide-react";
import Image from "next/image";

// import {  } from "react"

// message
export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};

function ChatWithPdf({ id }: { id: string }) {
  const { user } = useUser();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]); // Fix: should be array
  const [isPending, startTransition] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [snapshot, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user?.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    if (!snapshot) return;

    // console.log(
    //   "Snapshot data:",
    //   snapshot.docs.map((doc) => doc.data())
    // );

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "ai" && lastMessage.message === "Thinking...") {
      return;
    }

    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();
      return {
        id: doc.id,
        role,
        message,
        createdAt: createdAt.toDate(),
      };
    });
    // Only update messages if they're different to prevent unnecessary re-renders
    if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
      setMessages(newMessages);
    }
  }, [snapshot]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const q = input;
    setInput("");

    // optimistic ui update
    setMessages((prev: Message[]) => [
      ...prev,
      {
        role: "human",
        message: q,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "Thinking...",
        createdAt: new Date(),
      },
    ]);

    startTransition(async () => {
      const { success, message } = await askQuestion(id, q);
      console.debug("[ChatWithPdf] Received answer from askQuestion:", {
        success,
        message,
      });

      if (!success) {
        // toast
        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: "ai",
              message: `Whoops...${message}`,
              createdAt: new Date(),
            },
          ])
        );
      } else {
        // Replace the last 'Thinking...' message with the real answer
        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: "ai",
              message: message || "Sorry, I couldn't understand the document.",
              createdAt: new Date(),
            },
          ])
        );
        setTimeout(() => {
          const container = document.querySelector(".custom-scrollbar");
          if (container) container.scrollTop = container.scrollHeight;
        }, 100);
      }
    });
  };

  // Show welcome message when no messages exist and we've finished loading
  const showWelcomeMessage = messages.length === 0 && !loading && snapshot;

  return (
    <div className="h-full">
      <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-7rem)] w-full bg-gradient-to-b from-white via-[#f8fbff] to-[#ecf7ff] border-l border-gray-200">
        {/* Header */}
        <div className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
          <h2 className="font-semibold text-base md:text-lg bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-transparent bg-clip-text">
            Chat with PDF
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 space-y-2 sm:space-y-3 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-t-4 border-t-[#00f2fe] border-gray-200 rounded-full animate-spin mb-2"></div>
                <p className="text-sm text-gray-500">Loading chat history...</p>
              </div>
            </div>
          ) : showWelcomeMessage ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6 max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-[#00f2fe] to-[#4facfe] flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Welcome to PDF Chat</h3>
                <p className="text-xs sm:text-sm text-gray-500 px-2">Ask me anything about this document and I&apos;ll help you find the information you need.</p>
              </div>
            </div>
          ) : null}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${
                msg.role === "human" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "ai" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00f2fe] to-[#4facfe] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm shadow-sm ${
                  msg.role === "human"
                    ? "bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-white"
                    : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                {msg.role === "ai" && msg.message === "Thinking..." ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-t-2 border-t-[#00f2fe] border-gray-200 rounded-full animate-spin"></div>
                    <span>Thinking...</span>
                  </div>
                ) : (
                  <div>{msg.message}</div>
                )}
                <div
                  className={`text-[10px] mt-1 ${
                    msg.role === "human"
                      ? "text-white/70 text-right"
                      : "text-gray-400 text-left"
                  }`}
                >
                  {msg.createdAt &&
                    format(
                      typeof msg.createdAt === "string"
                        ? new Date(msg.createdAt)
                        : msg.createdAt,
                      "hh:mm a"
                    )}
                </div>
              </div>
              {msg.role === "human" && (
                <div className="flex-shrink-0">
                  {user?.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      width={32} 
                      height={32}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400 bg-gray-100 rounded-full p-1 border border-gray-200" />
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomOfChatRef} />
        </div>

        {/* Input */}
        <div className="p-2 sticky bottom-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this document..."
              disabled={isPending}
              className={`flex-1 px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#4facfe] ${
                isPending ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
              }`}
            />
            <Button
              type="submit"
              disabled={!input || isPending}
              className={`bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-white px-3 sm:px-4 py-2 text-sm rounded-lg ${
                isPending ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isPending ? (
                <div className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </div>
              ) : (
                'Send'
              )}
            </Button>
          </form>
          <p className="text-[10px] text-gray-400 mt-1 text-center sm:text-left">
            AI may produce inaccurate information. Verify important details.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatWithPdf;
