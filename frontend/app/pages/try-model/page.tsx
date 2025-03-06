'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NextPage } from 'next';

const ModelPage: NextPage = () => {
    const [modelOutput, setModelOutput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<string>('modelA');

    const handleRunModel = async () => {
        setModelOutput('');
        setIsLoading(true);

        try {
            const response = await fetch(`/api/runModel?model=${selectedModel}`);
            const data = await response.json();
            if (data.error) {
                setModelOutput(`Error: ${data.error}`);
            } else {
                setModelOutput(data.output);
            }
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            setModelOutput(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-black to-yellow-600 text-white p-8">
            <header className="text-center py-16">
                <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400">
                    Select and Run a Model
                </h1>
            </header>
            <main className="px-4 sm:px-12">
                <div className="flex justify-center space-x-4">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="rounded-full px-4 py-2 text-black"
                    >
                        <option value="modelA">Model A</option>
                        <option value="modelB">Model B</option>
                        {/* Add more models as needed */}
                    </select>
                    <button
                        onClick={handleRunModel}
                        disabled={isLoading}
                        className={`rounded-full px-6 py-3 font-bold transition ${
                            isLoading
                                ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
                                : 'bg-yellow-500 text-black hover:bg-yellow-400'
                        }`}
                    >
                        {isLoading ? 'Loading...' : 'Run Model'}
                    </button>
                </div>

                {modelOutput && (
                    <div className="mt-8 bg-white/10 p-4 rounded-md">
                        <h2 className="text-yellow-400 font-semibold mb-2">Model Output:</h2>
                        <pre className="whitespace-pre-wrap">{modelOutput}</pre>
                    </div>
                )}
            </main>

            <footer className="text-center mt-16">
                <Link
                    href="/"
                    className="rounded-full px-6 py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition"
                >
                    Back to Home
                </Link>
            </footer>
        </div>
    );
};

export default ModelPage;
