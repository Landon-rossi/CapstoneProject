// page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Types for graph metadata and outputs
type GraphEntry = {
    id: string;
    label: string;
    script: string;
    params?: { [key: string]: string };
};

type OutputEntry = {
    graphId: string;
    images: string[];
};

const ModelPage = () => {
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [graphRegistry, setGraphRegistry] = useState<GraphEntry[]>([]);
    const [completedGraphs, setCompletedGraphs] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInstalling, setIsInstalling] = useState<boolean>(false);
    const [paramValues, setParamValues] = useState<{ [key: string]: string }>({});
    const [outputGraphs, setOutputGraphs] = useState<OutputEntry[]>([]);
    const [currentGraphIndexMap, setCurrentGraphIndexMap] = useState<{ [key: string]: number }>({});
    const [history, setHistory] = useState<{ id: string, paramValues: any, outputGraphs: any, completedGraphs: any }[]>([]);
    const [selectedHistoryId, setSelectedHistoryId] = useState<string>('');
    const [liveState, setLiveState] = useState<{
        paramValues: any;
        outputGraphs: any;
        completedGraphs: any;
    } | null>(null);


    // Fetches available models from frontend/app/models when the page loads
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

    // Handles model selection: installs it and loads its graph registry
    const handleModelSelect = async (model: string) => {
        setSelectedModel(model);
        setIsInstalling(true);

        // Clear previous state
        setHistory([]);
        setSelectedHistoryId('');
        setOutputGraphs([]);
        setGraphRegistry([]);
        setCompletedGraphs([]);
        setParamValues({});
        setCurrentGraphIndexMap({});

        try {
            // SAFELY call installModel and always parse JSON
            const response = await fetch(`/api/installModel?model=${model}`);
            const text = await response.text();
            let data;

            try {
                data = JSON.parse(text);
            } catch {
                console.error("❌ Non-JSON response from installModel:\n", text);
                throw new Error("Failed to parse installModel response");
            }

            if (data.error) {
                console.error(`Installation Error: ${data.error}`);
            } else {
                console.log(data.message);
            }

            // Load graph registry even if install was skipped
            const registryPath = `/models_graph_registry/${model}/graph_registry.json`;
            try {
                const res = await fetch(registryPath);
                const json = await res.json();
                setGraphRegistry(json.graphs || []);

                // Initialize default param values
                if (json.graphs?.length > 0) {
                    const initialParams: { [key: string]: string } = {};
                    json.graphs.forEach((g: any) => {
                        Object.entries(g.params || {}).forEach(([key, val]) => {
                            if (typeof val === "string") {
                                initialParams[`${g.id}-${key}`] = val;
                            }
                        });
                    });
                    setParamValues(initialParams);
                }
            } catch {
                console.error("⚠️ No graph registry found for this model.");
                setGraphRegistry([]);
            }
        } catch (error: any) {
            console.error(`Installation Error: ${error.message}`);
        } finally {
            // ✅ Always reset installing state!
            setIsInstalling(false);
        }
    };

    // Runs individual portions of model in sequential order
    const runIndividualGraph = async (graphId: string, params: { [key: string]: string }) => {
        if (!selectedModel) return;
        setIsLoading(true);

        const stepIndex = graphRegistry.findIndex(g => g.id === graphId);

        // Build query string with model, step, and param values
        const query = new URLSearchParams({ model: selectedModel, step: (stepIndex + 1).toString() });
        for (const key in params) {
            const fullKey = `${graphId}-${key}`;
            query.append(key, paramValues[fullKey] ?? params[key]);
        }
        const queryStr = query.toString();

        const alreadyCompleted = completedGraphs.includes(graphId);

        // Save history if editing a completed step or a historical version
        if (alreadyCompleted) {
            setHistory((prev) => [
                ...prev,
                {
                    id: `Version ${prev.length + 1}`,
                    paramValues: { ...paramValues },
                    outputGraphs: [...outputGraphs],
                    completedGraphs: [...completedGraphs]
                }
            ]);
        } else if (selectedHistoryId && liveState) {
            setHistory((prev) => [
                ...prev,
                {
                    id: `Version ${prev.length + 1}`,
                    paramValues: { ...liveState.paramValues },
                    outputGraphs: [...liveState.outputGraphs],
                    completedGraphs: [...liveState.completedGraphs]
                }
            ]);
        }

        try {
            const res = await fetch(`/api/runModel?${queryStr}`);
            let data;

            // Check if response is JSON or HTML error
            try {
                data = await res.json();
            } catch (jsonErr) {
                const text = await res.text();
                console.error("❌ Server returned non-JSON response:", text);
                throw new Error("Invalid response format from /api/runModel");
            }

            if (!res.ok || data.error) {
                throw new Error(data?.error || "Graph execution failed.");
            }

            if (data.images) {
                // Replace this step and clear future steps
                setOutputGraphs((prev) => [
                    ...prev.slice(0, stepIndex),
                    {
                        graphId,
                        images: data.images.map((img: string) => `/graphs/${img.trim()}?t=${Date.now()}`)
                    }
                ]);

                setCompletedGraphs((prev) => [
                    ...prev.slice(0, stepIndex),
                    graphId
                ]);

                setCurrentGraphIndexMap((prev) => {
                    const newMap: { [key: string]: number } = {};
                    Object.entries(prev).forEach(([key, val]) => {
                        const index = graphRegistry.findIndex((g) => g.id === key);
                        if (index < stepIndex) {
                            newMap[key] = val;
                        }
                    });
                    newMap[graphId] = 0;
                    return newMap;
                });

                setLiveState({
                    paramValues: { ...paramValues },
                    outputGraphs: [
                        ...outputGraphs.slice(0, stepIndex),
                        {
                            graphId,
                            images: data.images.map((img: string) => `/graphs/${img.trim()}?t=${Date.now()}`)
                        }
                    ],
                    completedGraphs: [...completedGraphs.slice(0, stepIndex), graphId]
                });

                setSelectedHistoryId('');
            } else {
                console.error("Error running graph:", data.error);
            }
        } catch (error: any) {
            console.error("Run graph error:", error.message);
        } finally {
            setIsLoading(false);
        }
    };


    // Runs all graphs (default run_model.py)
    const runDefaultModel = async () => {
        if (!selectedModel || isInstalling) return;

        setIsLoading(true);
        setOutputGraphs([]);
        setCompletedGraphs([]);

        try {
            const response = await fetch(`/api/runModel?model=${selectedModel}`);
            const raw = await response.text(); // ✅ Only read body once

            let data;
            try {
                data = JSON.parse(raw);
            } catch {
                console.error("❌ Response was not JSON:\n", raw);
                throw new Error("Server returned non-JSON response. Check backend.");
            }

            if (!response.ok || data.error) {
                console.error("Run model error:", data?.error || "Request failed");
                return;
            }

            if (data.images) {
                setOutputGraphs([
                    {
                        graphId: 'default_run',
                        images: data.images.map((img: string) => `/graphs/${img.trim()}?t=${Date.now()}`)
                    }
                ]);
            } else {
                console.error('Error fetching images:', data.error);
            }
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const nextImage = (graphId: string) => {
        setCurrentGraphIndexMap((prev) => {
            const total = outputGraphs.find(g => g.graphId === graphId)?.images.length || 1;
            const next = ((prev[graphId] ?? 0) + 1) % total;
            return { ...prev, [graphId]: next };
        });
    };

    const previousImage = (graphId: string) => {
        setCurrentGraphIndexMap((prev) => {
            const total = outputGraphs.find(g => g.graphId === graphId)?.images.length || 1;
            const prevIndex = ((prev[graphId] ?? 0) - 1 + total) % total;
            return { ...prev, [graphId]: prevIndex };
        });
    };

    // Page layout
    return (
        <div className="flex min-h-screen bg-gradient-to-b from-indigo-900 via-black to-yellow-600 text-white">
            {/* LEFT PANEL: Sticky Controls */}
            <div className="w-[350px] h-screen flex flex-col border-r border-yellow-400 bg-black/40">
                <div className="flex-1 overflow-y-auto p-4">
                    <h1 className="text-2xl font-bold mb-6 text-yellow-300 text-center">
                        Model: Input Parameters
                    </h1>
                    {/*Model History*/}
                    {history.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-yellow-300 font-bold mb-1">History</label>
                            <select
                                value={selectedHistoryId}
                                onChange={(e) => {
                                    const val = e.target.value;

                                    if (val === '__current__' && liveState) {
                                        // Restore working current version
                                        setParamValues(liveState.paramValues);
                                        setOutputGraphs(liveState.outputGraphs);
                                        setCompletedGraphs(liveState.completedGraphs);
                                        setSelectedHistoryId('');
                                    } else {
                                        const snapshot = history.find(h => h.id === val);
                                        if (snapshot) {
                                            setParamValues(snapshot.paramValues);
                                            setOutputGraphs(snapshot.outputGraphs);
                                            setCompletedGraphs(snapshot.completedGraphs);
                                            setSelectedHistoryId(snapshot.id);
                                        }
                                    }
                                }}
                                className="w-full rounded px-3 py-2 text-black"
                            >
                                <option value="">Select previous version</option>
                                {liveState &&
                                    <option value="__current__">Current
                                        Version</option>}
                                {history.map((h) => (
                                    <option key={h.id}
                                            value={h.id}>{h.id}</option>
                                ))}
                            </select>

                        </div>
                    )}

                    {/* Model dropdown */}
                    <select
                        value={selectedModel}
                        onChange={(e) => handleModelSelect(e.target.value)}
                        className="w-full mb-4 rounded px-4 py-2 text-black"
                    >
                        <option value="">Select a model</option>
                        {models.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>

                    {isInstalling && (
                        <p className="text-yellow-300 mb-4">Installing {selectedModel}...</p>
                    )}

                    {!isInstalling && selectedModel && (
                        <>
                            <button
                                onClick={runDefaultModel}
                                disabled={isLoading}
                                className="w-full mb-6 rounded px-4 py-2 font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition disabled:bg-gray-400 disabled:text-gray-800"
                            >
                                {isLoading ? 'Loading...' : 'Run Default Model'}
                            </button>

                            {graphRegistry.map((graph, index) => {
                                const isDisabled = isLoading || (index > 0 && !completedGraphs.includes(graphRegistry[index - 1].id));
                                const params = graph.params || {};
                                return (
                                    <div key={graph.id} className="mb-6">
                                        <button
                                            onClick={() => runIndividualGraph(graph.id, params)}
                                            disabled={isDisabled}
                                            className={`w-full rounded px-4 py-2 font-bold transition mb-2 ${
                                                isDisabled
                                                    ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
                                                    : 'bg-indigo-500 text-white hover:bg-indigo-400'
                                            }`}
                                        >
                                            {graph.label}
                                        </button>
                                        {!isDisabled && Object.entries(params).map(([key, defaultVal]) => {
                                            const inputKey = `${graph.id}-${key}`;
                                            return (
                                                <div key={inputKey} className="flex items-center space-x-2 mb-2">
                                                    <label className="w-1/3 text-right">{key}</label>
                                                    <input
                                                        type="number"
                                                        className="w-2/3 px-2 py-1 text-black rounded"
                                                        value={paramValues[inputKey] ?? defaultVal}
                                                        onChange={(e) =>
                                                            setParamValues((prev) => ({
                                                                ...prev,
                                                                [inputKey]: e.target.value
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
                <footer className="text-center p-4 border-t border-yellow-400">
                    <Link
                        href="/"
                        className="rounded-full px-6 py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition"
                    >
                        Back to Home
                    </Link>
                </footer>
            </div>

            {/* RIGHT PANEL: Graph Outputs */}
            <div className="flex-1 p-8 space-y-8">
                {outputGraphs.map(({ graphId, images }, index) => {
                    const currentIndex = currentGraphIndexMap[graphId] ?? 0;
                    return (
                        <div key={`${graphId}-${index}`} className="bg-white/5 p-4 rounded shadow-md">
                            <h2 className="text-xl font-bold mb-4 text-yellow-400 border-b pb-1 border-yellow-500">
                                {graphId}
                            </h2>
                            {images.length > 0 && (
                                <div className="relative w-full max-w-xl mx-auto">
                                    <img
                                        src={images[currentIndex]}
                                        alt={`${graphId} output ${currentIndex}`}
                                        className="w-full max-w-sm rounded shadow mx-auto"
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => previousImage(graphId)}
                                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l hover:bg-opacity-75"
                                            >
                                                ←
                                            </button>
                                            <button
                                                onClick={() => nextImage(graphId)}
                                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r hover:bg-opacity-75"
                                            >
                                                →
                                            </button>
                                        </>
                                    )}
                                    <div className="mt-2 text-center">
                                        Image {currentIndex + 1} of {images.length}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ModelPage;
