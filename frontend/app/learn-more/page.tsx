"use client";

import { useState, useEffect, useRef } from "react";

import Link from "next/link";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// Define the Message type
interface Message {
    sender: "user" | "ai";
    content: string;
}

// Initialize the GoogleGenAI instance
const ai = new GoogleGenAI({ apiKey: "AIzaSyDPdkXHtJitay5xjkF101yi-mMimqsgvCQ" });

// Function to handle chat messages
const handleChat = async (message: string, messages: Message[]) => {
    const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: messages.map((msg: Message) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        })),
        config: {
            systemInstruction: "You are an AI expert on solar wind. Provide detailed and accurate information about solar wind and related topics. Use the information from the website as context.",
        },
    });

    const response = await chat.sendMessage({
        message,
    });

    return response.text || "";
};

export default function LearnMore() {
    const [selectedModel, setSelectedModel] = useState("");
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);

    // State to manage API key and connection status
    const [apiKey, setApiKey] = useState("AIzaSyDPdkXHtJitay5xjkF101yi-mMimqsgvCQ");
    const [apiStatus, setApiStatus] = useState(true);

    // Update the sendMessage function to use handleChat
    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg: Message = { sender: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const aiResponse = await handleChat(input, messages);
            setMessages((prev) => [...prev, { sender: "ai", content: aiResponse }]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Error contacting AI server:', errorMessage);
            setMessages((prev) => [...prev, { sender: "ai", content: `⚠️ Error contacting AI server: ${errorMessage}` }]);
        } finally {
            setLoading(false);
        }
    };

    // Add type for the event parameter in handleKeyDown
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Function to check if the API is working
    const checkApiStatus = async () => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: "Test",
            });
            setApiStatus(!!response.text);
        } catch (err) {
            setApiStatus(false);
        }
    };

    // Use effect to check API status on component mount
    useEffect(() => {
        checkApiStatus();
    }, [apiKey]);

    // Function to handle API key submission
    const handleApiKeySubmit = async () => {
        await checkApiStatus();
        if (!apiStatus) {
            alert("The API key is invalid or the API is not responding. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-black to-yellow-600 text-white p-8">
            <header className="text-center py-12">
                <h1 className="text-5xl font-extrabold text-yellow-400">Welcome to Learn More</h1>
                <p className="mt-4 text-lg max-w-3xl mx-auto opacity-75">
                    This page is your gateway to understanding the science behind solar wind and space weather. Here,
                    you will learn about the fundamental principles of solar activity, its effects on Earth, and how AI
                    plays a role in predicting and mitigating its impact. Additionally, we will introduce our project
                    methodologies and how we use AI to enhance solar wind forecasting.
                </p>
            </header>

            <section className="text-center py-8">
                <h2 className="text-4xl font-bold text-yellow-400">Solar Wind 101</h2>
                <p className="mt-2 text-lg opacity-75">Start your journey by understanding what solar wind is and how it
                    influences our planet.</p>
            </section>

            <main className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-12">
                <Link href="/learn-more/solar-wind-explained"
                      className="group block p-6 bg-yellow-500/10 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-yellow-500/20">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-yellow-300 group-hover:text-yellow-400">Solar Wind</h3>
                        <p className="mt-2 text-sm opacity-75 group-hover:opacity-100">What is it? Where does it come
                            from?</p>
                    </div>
                </Link>

                <Link href="/learn-more/solar-wind-effects"
                      className="group block p-6 bg-yellow-500/10 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-yellow-500/20">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-yellow-300 group-hover:text-yellow-400">Earth's
                            Impact</h3>
                        <p className="mt-2 text-sm opacity-75 group-hover:opacity-100">How does it affect our
                            planet?</p>
                    </div>
                </Link>

                <Link href="/learn-more/ai-space-weather"
                      className="group block p-6 bg-yellow-500/10 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-yellow-500/20">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-yellow-300 group-hover:text-yellow-400">AI & Space</h3>
                        <p className="mt-2 text-sm opacity-75 group-hover:opacity-100">How AI is predicting space
                            weather.</p>
                    </div>
                </Link>
            </main>

            <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-12 mt-12">
                <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-yellow-400">The Sun's Magnetic Field</h3>
                    <p className="mt-2 text-sm opacity-75">How the sun's magnetic forces shape the solar system.</p>
                </div>
                <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-yellow-400">Geomagnetic Storms</h3>
                    <p className="mt-2 text-sm opacity-75">Understanding solar storms and their impact on
                        technology.</p>
                </div>
                <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-yellow-400">Space Weather Predictions</h3>
                    <p className="mt-2 text-sm opacity-75">How scientists predict solar activity and mitigate risks.</p>
                </div>
            </section>

            {!apiStatus && (
                <div className="bg-red-500 text-white p-4 rounded mb-4">
                    <p>The API is not responding. Please enter a valid API key:</p>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="mt-2 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none w-full"
                    />
                    <button
                        onClick={handleApiKeySubmit}
                        className="mt-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-bold"
                    >
                        Submit
                    </button>
                </div>
            )}

            <section className="mt-12 px-4 sm:px-12">
                <h2 className="text-4xl font-bold text-yellow-400 text-center mb-8">
                    Chat with Our AI Solar Wind Expert
                </h2>

                <div className="max-w-3xl mx-auto bg-black/40 p-6 rounded-lg shadow-md">
                    <div ref={chatContainerRef} className="h-[400px] overflow-y-auto mb-4 space-y-4 pr-2">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex items-start space-x-3 ${msg.sender === "user" ? "justify-end text-right" : "justify-start"}`}
                            >
                                <div className="bg-white/10 p-3 rounded-lg max-w-[75%] text-sm">
                                    <strong>{msg.sender === "user" ? "You" : "AI"}:</strong>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
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
                            placeholder="Ask about solar wind or our project..."
                            className="flex-1 resize-none h-16 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !apiStatus}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-bold"
                        >
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>
            </section>

            <footer className="text-center mt-16">
                <Link
                    href="/frontend/public"
                    className="rounded-full px-6 py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition"
                >
                    Back to Home
                </Link>
            </footer>
        </div>
    );
}
