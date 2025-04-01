"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface GameProps {
    onWaveComplete: (wave: number) => void;
    stormType: "normal" | "high-speed" | "dense"; // New storm type from forecast
}

const Game: React.FC<GameProps> = ({ onWaveComplete, stormType }) => {
    // Game objects
    const [magnetosphere, setMagnetosphere] = useState(100);
    const [solarWind, setSolarWind] = useState<{ x: number; y: number; speed: number }[]>([]);

    // Wave management
    const [waveNumber, setWaveNumber] = useState(1);
    const [waveCleared, setWaveCleared] = useState(false);
    const [showNextWaveButton, setShowNextWaveButton] = useState(false); // State to show "Next Wave" button

    const [gameOver, setGameOver] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gameLoopRef = useRef<number | null>(null);

    const earthPosition = { x: 750, y: 300 };
    const magnetosphereRadius = 60;

    // Load images
    const earthImg = useRef<HTMLImageElement | null>(null);
    const magnetosphereImg = useRef<HTMLImageElement | null>(null);
    const solarWindImg = useRef<HTMLImageElement | null>(null);
    const gameOverImg = useRef<HTMLImageElement | null>(null);
    //**Load Images**//
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

    //**Spawn Solar Winds**//
    const spawnSolarWind = useCallback((wave: number) => {
        if (gameOver) return;
        const numberOfWinds = wave * 2 * (stormType === "dense" ? 100 : 1);
        const newWinds = Array.from({ length: numberOfWinds }, () => ({
            x: -50,
            y: Math.random() * 500,
            speed: 1 + Math.random() * (stormType === "high-speed" ? 2 : 1),
        }));
        setSolarWind(newWinds);
        setWaveCleared(false);
    }, [gameOver, stormType]);

    useEffect(() => {
        spawnSolarWind(waveNumber);
    }, [waveNumber, spawnSolarWind]);

    //**Handle Game States**//
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
                setWaveCleared(true); // Mark the wave as cleared when all solar wind is destroyed
                setShowNextWaveButton(true); // Show "Next Wave" button
            }

            return updatedWind;
        });

        setMagnetosphere((prev) => Math.min(100, prev + 0.01)); // Slowly regenerate the magnetosphere
        gameLoopRef.current = requestAnimationFrame(updateGame);
    }, [waveCleared, gameOver, stormType]);

    //**Handle Start Next Wave**//
    const nextWave = () => {
        setWaveNumber((prevWave) => {
            const nextWave = prevWave + 1;
            onWaveComplete(nextWave); // Notify parent of wave completion
            setShowNextWaveButton(false); // Hide the "Next Wave" button once clicked
            spawnSolarWind(nextWave);
            return nextWave;
        });
    };

    // useEffect(() => {
    //     if (waveCleared && !gameOver) {
    //         setTimeout(() => {
    //             setWaveNumber((prevWave) => {
    //                 const nextWave = prevWave + 1;
    //                 onWaveComplete(prevWave);
    //                 return nextWave;
    //             });
    //         }, 500);
    //     }
    // }, [waveCleared, onWaveComplete, gameOver]);

    //**Handle Game Over**//
    useEffect(() => {
        if (!gameOver) {
            gameLoopRef.current = requestAnimationFrame(updateGame);
        }
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [updateGame, gameOver]);

    //**Handle User Input**//
    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (gameOver) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        setSolarWind((prevSolarWind) =>
            prevSolarWind.filter((wind) => {
                const distance = Math.sqrt(Math.pow(wind.x - clickX, 2) + Math.pow(wind.y - clickY, 2));
                return distance > 15; // Remove if click is close enough
            })
        );
    };


    //**Handle Game Rendering**//
    const draw = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, 800, 600);

        if (earthImg.current) {
            ctx.drawImage(earthImg.current, 700, 250, 100, 100);
        }

        if (magnetosphereImg.current && !gameOver) {
            ctx.drawImage(magnetosphereImg.current, 670, 225, 160, 160);
        }

        solarWind.forEach((wind) => {
            if (solarWindImg.current) {
                ctx.drawImage(solarWindImg.current, wind.x, wind.y, 20, 20);
            }
        });

        if (gameOver) {
            if (gameOverImg.current) {
                ctx.drawImage(gameOverImg.current, 250, 150, 300, 300);
            }
            // FIX ME: DRAW A DESTROYED EARTH HERE
        }
    }, [solarWind, gameOver]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) draw(ctx);
    }, [solarWind, magnetosphere, draw, gameOver]);

    const restartGame = () => {
        setMagnetosphere(100);
        setWaveNumber(1);
        setSolarWind([]);
        setGameOver(false);
    };

    return (
        <div>
            <canvas ref={canvasRef} width={800} height={600} className="border" onClick={handleCanvasClick} />
            <p>Wave: {waveNumber}</p>
            <p>Magnetosphere Health: {magnetosphere.toFixed(2)}</p>
            {showNextWaveButton && !gameOver && (
                <button onClick={nextWave} className="px-4 py-2 bg-green-500 text-white font-bold rounded">Next Wave</button>
            )}
            {gameOver && <p className="text-red-500 font-bold text-lg">GAME OVER</p>}
            {gameOver && <button onClick={restartGame} className="px-4 py-2 bg-blue-500 text-white font-bold rounded">Restart</button>}
        </div>
    );
};

export default Game;
