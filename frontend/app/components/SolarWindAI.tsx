"use client";

import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { FaRobot, FaUserCircle } from "react-icons/fa";

interface AIChatProps {
    model: string;
}

interface Message {
    sender: "user" | "ai";
    content: string;
}

const AIChat: React.FC<AIChatProps> = ({ model }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem(`chat_${model}`);
        if (saved) setMessages(JSON.parse(saved));
    }, [model]);

    useEffect(() => {
        localStorage.setItem(`chat_${model}`, JSON.stringify(messages));
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, [messages, model]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg: Message = { sender: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model, history: messages, prompt: input })
            });

            const data = await res.json();
            if (data.reply) {
                setMessages((prev) => [...prev, { sender: "ai", content: data.reply }]);
            } else {
                setMessages((prev) => [...prev, { sender: "ai", content: "⚠️ No response from AI." }]);
            }
        } catch (err) {
            setMessages((prev) => [...prev, { sender: "ai", content: "⚠️ Error contacting AI server." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Chat with Solar Wind Expert</h3>
            <div ref={chatContainerRef} className="h-[400px] overflow-y-auto mb-4 space-y-4 pr-2">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex items-start space-x-3 ${msg.sender === "user" ? "justify-end text-right" : "justify-start"}`}
                    >
                        {msg.sender === "ai" && <FaRobot className="text-yellow-400 mt-1" />}
                        <div className="bg-white/10 p-3 rounded-lg max-w-[75%] text-sm">
                            <div className="prose prose-sm prose-invert">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                        {msg.sender === "user" && <FaUserCircle className="text-blue-400 mt-1" />}
                    </div>
                ))}
                {loading && (
                    <div className="bg-gray-700/50 p-3 rounded-lg text-sm text-yellow-300">Thinking...</div>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about solar wind..."
                    className="flex-1 resize-none h-20 p-2 rounded text-black"
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded font-bold"
                >
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
};

export default AIChat;
