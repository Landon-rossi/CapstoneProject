'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ModelPage = () => {
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [modelImages, setModelImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInstalling, setIsInstalling] = useState<boolean>(false);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch('/api/models');
                const data = await response.json();
                if (data.models) {
                    setModels(data.models);
                } else {
                    console.error('Error fetching models:', data.error);
                }
            } catch (error: any) {
                console.error('Error:', error.message);
            }
        };
        fetchModels();
    }, []);

    const handleModelSelect = async (model: string) => {
        setSelectedModel(model);
        setIsInstalling(true);
        setModelImages([]);

        try {
            const response = await fetch(`/api/installModel?model=${model}`);
            const data = await response.json();

            if (data.error) {
                console.error(`Installation Error: ${data.error}`);
            } else {
                console.log(data.message);
            }
        } catch (error: any) {
            console.error(`Installation Error: ${error.message}`);
        } finally {
            setIsInstalling(false);
        }
    };

    const handleRunModel = async () => {
        if (!selectedModel || isInstalling) return;

        setIsLoading(true);
        setModelImages([]);

        try {
            const response = await fetch(`/api/runModel?model=${selectedModel}`);
            const data = await response.json();

            if (data.images) {
                console.log("Received image paths:", data.images);

                setModelImages(
                    data.images.map((img: string) => `/graphs/${img.trim()}?t=${new Date().getTime()}`)
                );
            } else {
                console.error('Error fetching images:', data.error);
            }
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
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
                        onChange={(e) => handleModelSelect(e.target.value)}
                        className="rounded-full px-4 py-2 text-black"
                    >
                        <option value="">Select a model</option>
                        {models.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>

                {isInstalling && (
                    <p className="text-center text-yellow-300 mt-4">
                        Installing {selectedModel}... Please wait.
                    </p>
                )}

                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleRunModel}
                        disabled={!selectedModel || isInstalling || isLoading}
                        className={`rounded-full px-6 py-3 font-bold transition ${
                            !selectedModel || isInstalling || isLoading
                                ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
                                : 'bg-yellow-500 text-black hover:bg-yellow-400'
                        }`}
                    >
                        {isLoading ? 'Loading...' : 'Run Model'}
                    </button>
                </div>

                {modelImages.length > 0 && (
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        {modelImages.map((img, index) => (
                            <img key={index} src={img} alt={`Model Output ${index}`} className="rounded-lg shadow-lg w-full h-auto" />
                        ))}
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
