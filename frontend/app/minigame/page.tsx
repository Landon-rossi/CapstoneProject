"use client";

import { useState, useEffect } from "react";
import ScientistDialogue from "@/app/minigame/components/ScientistDialogue";
import Game from "@/app/minigame/components/Game";

export default function Minigame() {
    const [showDialogue, setShowDialogue] = useState(false);
    const [dialogueMessage, setDialogueMessage] = useState("");
    const [currentWave, setCurrentWave] = useState(1);

    // Dialogue messages mapped to specific waves
    const waveDialogues: { [key: number]: string } = {
        1: "Great job! You survived the first wave!",
        3: "The solar winds are getting stronger. Stay sharp!",
        5: "This storm is massive! Hold your ground!",
    };

    // Function to handle wave completion
    const handleWaveCompletion = (wave: number) => {
        setCurrentWave(wave + 1); // Increase wave count

        if (waveDialogues[wave]) {
            setDialogueMessage(waveDialogues[wave]);
            setShowDialogue(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold">Solar Wind Defense Game</h1>

            {/* Game Component (Pass wave completion handler) */}
            <Game onWaveComplete={handleWaveCompletion} />

            {/* Scientist Dialogue Component */}
            <ScientistDialogue
                message={dialogueMessage}
                isVisible={showDialogue}
                onClose={() => setShowDialogue(false)}
                imageOpen="/minigame/scientist_open.png"
                imageClosed="/minigame/scientist_closed.png"
            />
        </div>
    );
}
