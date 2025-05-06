'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function GeminiAI() {
    const [apiKey, setApiKey] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isApiKeySet, setIsApiKeySet] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSetApiKey = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        try {
            // First, let's check available models
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to get models from Gemini');
            }

            const data = await response.json();
            console.log('Available models:', data); // This will help us see what models are available
            
            setIsApiKeySet(true);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setError(`Failed to verify API key: ${errorMessage}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `You are an expert in solar wind and space weather. Provide detailed, accurate information about solar wind phenomena, their effects on Earth, and related space weather concepts. Keep explanations clear and engaging for both beginners and advanced learners.\n\nUser question: ${input}`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to get response from Gemini');
            }

            const data = await response.json();
            
            if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
                throw new Error('Invalid response format from Gemini');
            }

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.candidates[0].content.parts[0].text
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setError(errorMessage);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `I apologize, but I encountered an error: ${errorMessage}. Please check your API key and try again.`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const markdownComponents: Components = {
        h1: ({node, children}) => (
            <h1 className="text-2xl font-bold mb-4">{children}</h1>
        ),
        h2: ({node, children}) => (
            <h2 className="text-xl font-bold mb-3">{children}</h2>
        ),
        h3: ({node, children}) => (
            <h3 className="text-lg font-bold mb-2">{children}</h3>
        ),
        ul: ({node, children}) => (
            <ul className="list-disc pl-4 mb-4">{children}</ul>
        ),
        ol: ({node, children}) => (
            <ol className="list-decimal pl-4 mb-4">{children}</ol>
        ),
        p: ({node, children}) => (
            <p className="mb-4">{children}</p>
        ),
        strong: ({node, children}) => (
            <strong className="font-bold text-yellow-400">{children}</strong>
        ),
    };

    if (!isApiKeySet) {
        return (
            <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">Enter Your Google AI API Key</h3>
                <p className="text-sm text-gray-300 mb-4">
                    Get your API key from the{' '}
                    <a 
                        href="https://makersuite.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 underline"
                    >
                        Google AI Studio
                    </a>
                </p>
                <form onSubmit={handleSetApiKey} className="space-y-4">
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Google AI API key"
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition"
                    >
                        Set API Key
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Chat with Gemini Solar Wind Expert</h3>
            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                    {error}
                </div>
            )}
            <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg ${
                            message.role === 'user'
                                ? 'bg-yellow-500/20 ml-auto max-w-[80%]'
                                : 'bg-gray-700/50 mr-auto max-w-[80%]'
                        }`}
                    >
                        {message.role === 'assistant' ? (
                            <div className="prose prose-invert max-w-none">
                                <ReactMarkdown components={markdownComponents}>
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            message.content
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="bg-gray-700/50 p-3 rounded-lg mr-auto">
                        Thinking...
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about solar wind..."
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                />
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
} 