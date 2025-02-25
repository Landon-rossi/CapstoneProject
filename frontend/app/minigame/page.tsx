"use client"

import { useEffect, useRef, useState } from "react";

const SolarWindGame = () => {
    // State for tracking the player's score
    const [score, setScore] = useState(0);
    // State for managing the game's difficulty level
    const [difficulty, setDifficulty] = useState(1);
    // State for storing the positions of solar winds
    const [solarWinds, setSolarWinds] = useState<{ x: number; y: number }[]>([]);
    // Reference to the game area div for positioning calculations
    const gameAreaRef = useRef<HTMLDivElement>(null);
    // Reference to the mouse's current position
    const mousePositionRef = useRef({ x: 0, y: 0 });
    // State to track if the game is over
    const [isGameOver, setIsGameOver] = useState(false);
    // State for tracking the random fun fact
    const [randomFact, setRandomFact] = useState<string>("");

    // Fun facts about solar winds
    const solarWindFacts: { [key: number]: string } = {
        1: "Solar winds are streams of charged particles released from the upper atmosphere of the Sun, known as the corona.",
        2: "The speed of solar winds can range from 300 to 800 km/s depending on solar activity.",
        3: "Solar wind can impact Earth's magnetic field, creating phenomena such as auroras or geomagnetic storms.",
        4: "Solar winds are responsible for shaping the tails of comets and affect the behavior of the entire solar system.",
        5: "Solar winds have been responsible for stripping the atmosphere of Mars, possibly contributing to the planet's current state.",
        6: "The interaction of solar winds with Earth's magnetic field creates the Van Allen radiation belts.",
        7: "Solar winds can influence space weather and may disrupt satellite communications and power grids on Earth.",
        8: "The intensity of solar wind increases during solar storms, which are associated with sunspots.",
        9: "Solar winds are not constant; they vary depending on the Sun's activity cycle, known as the solar cycle.",
        10: "While solar winds are invisible to the naked eye, their effects are clearly seen in the form of auroras and geomagnetic storms.",
    };


    // Handle mouse movement and update the mouse position
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (gameAreaRef.current) {
                const rect = gameAreaRef.current.getBoundingClientRect();
                mousePositionRef.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                };
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Spawn new solar winds at increasing rates as difficulty increases, with a maximum spawn interval of 3 seconds
    useEffect(() => {
        const spawnSolarWind = () => {
            setSolarWinds((prev) => [
                ...prev,
                { x: Math.random() * 100, y: 0 }, // Random horizontal position, starting at the top
            ]);
        };

        // Spawn immediately at the start
        spawnSolarWind();

        if (isGameOver) {
            return; // Stop spawning new solar winds if the game is over
        }

        const interval = setInterval(spawnSolarWind, Math.max(3000 / difficulty, 500)); // Ensure interval doesn't exceed 3 seconds or drop below 500ms
        return () => clearInterval(interval);
    }, [difficulty, isGameOver]);

    // Main game loop to update positions of solar winds and check for collisions
    useEffect(() => {
        if (isGameOver) {
            return; // Stop spawning new solar winds if the game is over
        }

        const gameLoop = setInterval(() => {
            setSolarWinds((prev) => {
                const updated = prev.map((wind) => ({ ...wind, y: wind.y + difficulty })); // Move solar winds down

                // Check for collision with the mouse (Earth)
                for (const wind of updated) {
                    const dx = mousePositionRef.current.x - wind.x * window.innerWidth / 100;
                    const dy = mousePositionRef.current.y - wind.y * window.innerHeight / 100;
                    if (Math.sqrt(dx * dx + dy * dy) < 24) { // 24 is the combined radius of Earth and solar wind
                        setIsGameOver(true);
                        return []; // Clear all solar winds on game over
                    }
                }

                // Filter out solar winds that have reached the bottom
                const remaining = updated.filter((wind) => wind.y < 100);

                // Update the score for each solar wind that exits the screen
                setScore((prevScore) => prevScore + (updated.length - remaining.length));

                return remaining;
            });

            // Gradually increase the difficulty over time
            setDifficulty((prev) => Math.min(10, prev + 0.001));
        }, 50);

        return () => clearInterval(gameLoop);
    }, [difficulty, isGameOver]);

    useEffect(() => {
        if (isGameOver) {
            // Pick a random fact only when the game is over
            const randomFactIndex = Math.floor(Math.random() * Object.keys(solarWindFacts).length) + 1;
            setRandomFact(solarWindFacts[randomFactIndex]);
        }
    }, [solarWindFacts, isGameOver]); // Trigger only when the game is over

    // Restart the game by resetting all states
    const restartGame = () => {
        setScore(0);
        setDifficulty(1);
        setSolarWinds([]);
        setIsGameOver(false);
    };

    return (
        <div
            ref={gameAreaRef}
            className="relative w-screen h-screen bg-black overflow-hidden"
        >
            <div
                style={{
                    width: '100%', // Full-width container
                    height: '300px', // Adjust height as needed to control how much is shown
                    overflow: 'hidden', // Crop the image
                    position: 'absolute', // Position at the top
                    top: '0', // Align to the top
                    left: '0', // Center horizontally
                }}
            >
                {/* Sun image displaying the bottom quarter */}
                <img
                    src="/sun-icon.png"
                    alt="Sun"
                    style={{
                        width: '100%', // Stretch the image across the container
                        height: 'auto', // Maintain aspect ratio
                        position: 'absolute', // Needed for positioning
                        bottom: '0', // Align the bottom of the image with the bottom of the container
                    }}
                />
            </div>


            {/* Display game over screen if the game is over */}
            {isGameOver ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white text-2xl">
                    <p>Game Over</p>
                    <p>Final Score: {score}</p>
                    <p className="mt-4">{randomFact}</p> {/* Display the fun fact */}
                    <button
                        onClick={restartGame}
                        className="mt-4 px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600"
                    >
                        Restart
                    </button>
                </div>
            ) : (
                <>
                    {/* Render the player's Earth controlled by the mouse */}
                    <img
                        src="/earth-icon.png"
                        alt="Earth"
                        className="absolute w-8 h-8 pointer-events-none"
                        style={{
                            transform: `translate(${mousePositionRef.current.x - 16}px, ${mousePositionRef.current.y - 16}px)`,
                        }}
                    />
                    {/* Render the solar winds */}
                    {solarWinds.map((wind, index) => (
                        <img
                            key={index}
                            src="/solar-wind-icon.png"
                            alt="Solar Wind"
                            className="absolute w-6 h-6"
                            style={{
                                transform: `translate(${wind.x}vw, ${wind.y}vh)`,
                                boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)', // Glow effect
                            }}
                        />
                    ))}
                    {/* Display the current score */}
                    <div className="absolute top-4 left-4 text-white text-xl">Score: {score}</div>
                </>
            )}
        </div>
    );
};

export default SolarWindGame;