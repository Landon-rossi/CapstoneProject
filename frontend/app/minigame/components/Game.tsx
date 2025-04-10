"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { drawGame } from "@/app/minigame/components/GameRender";

interface GameProps {
    waveNumber: number;
    stormType: "normal" | "high-speed" | "dense";
    onWaveCleared: () => void;
}

const Game: React.FC<GameProps> = ({ waveNumber, stormType, onWaveCleared }) => {
    const [magnetosphere, setMagnetosphere] = useState(100);
    const [solarWind, setSolarWind] = useState<{ x: number; y: number; speed: number }[]>([]);
    const [waveCleared, setWaveCleared] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gameLoopRef = useRef<number | null>(null);

    const earthPosition = { x: 750, y: 300 };
    const magnetosphereRadius = 60;

    const earthImg = useRef<HTMLImageElement | null>(null);
    const magnetosphereImg = useRef<HTMLImageElement | null>(null);
    const solarWindImg = useRef<HTMLImageElement | null>(null);
    const gameOverImg = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        earthImg.current = new Image();
        earthImg.current.src = "/minigame/chat_earth.png";

        magnetosphereImg.current = new Image();
        magnetosphereImg.current.src = "/minigame/chat_magsphere.png";

        solarWindImg.current = new Image();
        solarWindImg.current.src = "/minigame/chat_solar.png";

        gameOverImg.current = new Image();
        gameOverImg.current.src = "/minigame/game_over.png";
    }, []);

    const spawnSolarWind = useCallback((wave: number) => {
        if (gameOver) return;
        const numberOfWinds = wave * 2 * (stormType === "dense" ? 5 : 1);
        const newWinds = Array.from({ length: numberOfWinds }, () => ({
            x: -50,
            y: Math.random() * 500,
            speed: 1 + Math.random() * (stormType === "high-speed" ? 3 : 1),
        }));
        setSolarWind(newWinds);
        setWaveCleared(false);
    }, [gameOver, stormType]);

    // Call spawnSolarWind when waveNumber changes
    useEffect(() => {
        spawnSolarWind(waveNumber);
    }, [waveNumber, spawnSolarWind]);

    const updateGame = useCallback(() => {
        if (gameOver) return;

        setSolarWind((prevSolarWind) => {
            const updatedWind = prevSolarWind
                .map((wind) => {
                    const angle = Math.atan2(earthPosition.y - wind.y, earthPosition.x - wind.x);
                    return {
                        ...wind,
                        x: wind.x + Math.cos(angle) * wind.speed,
                        y: wind.y + Math.sin(angle) * wind.speed,
                    };
                })
                .filter((wind) => {
                    const distance = Math.sqrt(
                        Math.pow(wind.x - earthPosition.x, 2) + Math.pow(wind.y - earthPosition.y, 2)
                    );
                    if (distance < magnetosphereRadius) {
                        setMagnetosphere((prev) => {
                            const newHealth = Math.max(0, prev - 5);
                            if (newHealth === 0) {
                                setGameOver(true);
                            }
                            return newHealth;
                        });
                        return false;
                    }
                    return true;
                });

            if (updatedWind.length === 0 && !waveCleared) {
                setWaveCleared(true);
                onWaveCleared(); // Notify parent
            }

            return updatedWind;
        });

        setMagnetosphere((prev) => Math.min(100, prev + 0.01));
        gameLoopRef.current = requestAnimationFrame(updateGame);
    }, [waveCleared, gameOver, onWaveCleared]);

    useEffect(() => {
        if (!gameOver) {
            gameLoopRef.current = requestAnimationFrame(updateGame);
        }
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [updateGame, gameOver]);

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (gameOver) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        setSolarWind((prevSolarWind) =>
            prevSolarWind.filter((wind) => {
                const windCenterX = wind.x + 13;
                const windCenterY = wind.y + 13;
                const distance = Math.sqrt(Math.pow(windCenterX - clickX, 2) + Math.pow(windCenterY - clickY, 2));
                return distance > 15;
            })
        );
    };

    const draw = useCallback((ctx: CanvasRenderingContext2D) => {
        drawGame(ctx, earthImg, magnetosphereImg, solarWindImg, gameOverImg, solarWind, gameOver);
    }, [solarWind, gameOver]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) draw(ctx);
    }, [solarWind, magnetosphere, draw, gameOver]);

    const restartGame = () => {
        setMagnetosphere(100);
        setSolarWind([]);
        setGameOver(false);
    };

    return (
        <div>
            <canvas ref={canvasRef} width={800} height={600} className="border" onClick={handleCanvasClick} />
            <p>Wave: {waveNumber}</p>
            <p>Magnetosphere Health: {magnetosphere.toFixed(2)}</p>
            {gameOver && <p className="text-red-500 font-bold text-lg">GAME OVER</p>}
            {gameOver && <button onClick={restartGame} className="px-4 py-2 bg-blue-500 text-white font-bold rounded">Restart</button>}
        </div>
    );
};

export default Game;
