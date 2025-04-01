"use client";

import { useState, useEffect } from "react";
import ScientistDialogue from "@/app/minigame/components/ScientistDialogue";
import Game from "@/app/minigame/components/Game";

export default function Minigame() {
    const [showDialogue, setShowDialogue] = useState(false);
    const [dialogueMessage, setDialogueMessage] = useState("");
    const [currentWave, setCurrentWave] = useState(1);
    const [stormType, setStormType] = useState<"normal" | "high-speed" | "dense">("normal");
    const [gameStarted, setGameStarted] = useState(false);

    // Dialogue messages mapped to specific waves.
    const waveDialogues: { [key: number]: string } = {
        1: "Click on the solar winds!",
        2: "Great job! You survived the first wave!",
        3: "Did you know that High Velocity solar winds interacting with the Earth's atmosphere can create auroras?",
        4: "Our AI model has classified this storm as High Velocity!\n" +
            "These winds move at over 500km/s\n" +
            "and occur from Coronal Mass Ejections (CMEs).",
        5: "CMEs are large eruptions of plasma from the Sun's corona.\n" +
            "Those High Velocity solar winds could have disrupted\n" +
            "radio, satellites, and power grids if you hadn't stopped them!",
        6: "This storm is Dense. Watch out, there will be many more solar winds incoming!",
    };

    // Function to handle wave completion
    const handleWaveCompletion = (wave: number) => {
        setCurrentWave(wave + 1); // Increase wave count

        if (waveDialogues[wave]) {
            setDialogueMessage(waveDialogues[wave]);
            setShowDialogue(true);
        }

        if (wave === 3) {
            setStormType("high-speed");
        } else if (wave === 5) {
            setStormType("dense");
        } else {
            setStormType("normal");
        }
    };

    // Start the game
    const startGame = () => {
        setGameStarted(true);
        handleWaveCompletion(1); // Start the game with wave 1 dialogue
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold">Solar Wind Defense Game</h1>

            {!gameStarted && (
                <button
                    onClick={startGame}
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded mb-4"
                >
                    Start Game
                </button>
            )}

            {/* Game Component (Pass stormType directly) */}
            {gameStarted && <Game onWaveComplete={handleWaveCompletion} stormType={stormType} />}

            {/* Scientist Dialogue Component */}
            <ScientistDialogue
                message={dialogueMessage}
                isVisible={showDialogue}
                onClose={() => {
                    setShowDialogue(false);
                    if (gameStarted) {
                        handleWaveCompletion(currentWave); // Proceed to the next wave when the dialogue is closed
                    }
                }}
                imageOpen="/minigame/scientist_open.png"
                imageClosed="/minigame/scientist_closed.png"
            />
        </div>
    );
}
