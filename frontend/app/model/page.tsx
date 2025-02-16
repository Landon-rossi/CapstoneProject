'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NextPage } from 'next';

const ModelPage: NextPage = () => {
    const [modelOutput, setModelOutput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRunModel = async () => {
        // Clear any old output and set loading state
        setModelOutput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/runModel');
            const data = await response.json();

            if (data.error) {
                setModelOutput(`Error: ${data.error}`);
            } else {
                setModelOutput(data.output);
            }
        } catch (error: any) {
            console.error(`Error fetching model output: ${error.message}`);
            setModelOutput(`Error fetching model output: ${error.message}`);
        } finally {
            // End loading state
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-black to-yellow-600 text-white p-8">
            <header className="text-center py-16">
                <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400">
                    Run Your Python Model
                </h1>
                <p className="mt-4 text-lg sm:text-xl max-w-3xl mx-auto">
                    Click the button below to execute the Python script and see its output.
                </p>
            </header>

            <main className="px-4 sm:px-12">
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleRunModel}
                        // Disable the button if loading
                        disabled={isLoading}
                        // Apply different styles if loading
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
