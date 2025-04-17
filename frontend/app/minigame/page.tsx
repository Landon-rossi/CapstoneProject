"use client";

import { useState } from "react";
import ScientistDialogue from "@/app/minigame/components/ScientistDialogue";
import Game from "@/app/minigame/components/Game";

// Function to generate forecast messages for each wave
const getForecastForWave = (wave: number) => {
    if (wave % 5 === 0) return { stormType: "dense", message: "Heads up! A dense solar wind is approaching.\n" };
    if (wave % 3 === 0) return { stormType: "high-speed", message: "Caution! High-speed solar winds incoming.\n" };
    return { stormType: "normal", message: "Solar wind levels are steady. Prepare as usual.\n" };
};

export default function GamePage() {
    const [waveNumber, setWaveNumber] = useState(1); // Track the current wave
    const [showDialogue, setShowDialogue] = useState(true); // Show dialogue for each wave
    const [readyForNextWave, setReadyForNextWave] = useState(false); // Enable Next Wave button when the wave is cleared
    const [gameStarted, setGameStarted] = useState(false); // Start the game logic

    // Get forecast based on the current wave number
    const forecast = getForecastForWave(waveNumber);
    const stormType = forecast.stormType as "normal" | "high-speed" | "dense";

    // Handle when a wave is cleared
    const handleWaveCleared = () => {
        setShowDialogue(true); // Show dialogue for next wave
        setReadyForNextWave(true); // Enable the "Next Wave" button
    };

    // Handle clicking "Next Wave" button to progress to the next wave
    const handleNextWaveClick = () => {
        setWaveNumber((prev) => prev + 1); // Increment the wave number
        setShowDialogue(false); // Hide dialogue and start game
        setReadyForNextWave(false); // Disable the Next Wave button until the wave is cleared
    };

    // Start the game with the first wave
    const startGame = () => {
        setGameStarted(true);
        setWaveNumber(1);
        setShowDialogue(false); // <<< Add this line
        setReadyForNextWave(false);
    };

    const handleRestart = () => {
        setWaveNumber(1);
        setShowDialogue(false);
        setReadyForNextWave(false);
        setGameStarted(true);
    };

    return (
        <div className="flex flex-col items-center space-y-6">
            {/* Start Game Button */}
            {!gameStarted && (
                <button
                    onClick={startGame}
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded mb-4"
                >
                    Start Game
                </button>
            )}

            {/* Scientist Dialogue */}
            {showDialogue && (
                <div className="max-w-xl">
                    <ScientistDialogue
                        message={forecast.message}
                        imageOpen="/minigame/scientist_open.png"
                        imageClosed="/minigame/scientist_closed.png"
                    />

                    {/* Next Wave Button */}
                    {readyForNextWave ? (
                        <button
                            onClick={handleNextWaveClick}
                            className="mt-4 px-6 py-2 bg-green-600 text-white font-bold rounded"
                        >
                            Next Wave
                        </button>
                    ) : (
                        <p className="mt-4 text-gray-500">Clearing solar winds...</p>
                    )}
                </div>
            )}

            {/* Game Component */}
            {!showDialogue && (
                <Game
                    key={waveNumber === 1 && !showDialogue ? "new" : "playing"}
                    waveNumber={waveNumber}
                    stormType={stormType}
                    onWaveCleared={handleWaveCleared}
                    onRestart={handleRestart}
                />
            )}
        </div>
    );
}
