'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ModelPage = () => {
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [modelImages, setModelImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInstalling, setIsInstalling] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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
            setCurrentImageIndex(0);  // Reset image index when running model
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % modelImages.length);
    };

    const previousImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + modelImages.length) % modelImages.length);
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
                    <div className="mt-8 flex flex-col items-center">
                        <div className="relative w-full max-w-3xl">
                            <img 
                                src={modelImages[currentImageIndex]} 
                                alt={`Model Output ${currentImageIndex}`} 
                                className="rounded-lg shadow-lg w-full h-auto"
                            />
                            {modelImages.length > 1 && (
                                <>
                                    <button
                                        onClick={previousImage}
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-l hover:bg-opacity-75"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-r hover:bg-opacity-75"
                                    >
                                        →
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            Image {currentImageIndex + 1} of {modelImages.length}
                        </div>
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
