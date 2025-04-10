export const drawGame = (
    ctx: CanvasRenderingContext2D,
    earthImg: React.MutableRefObject<HTMLImageElement | null>,
    magnetosphereImg: React.MutableRefObject<HTMLImageElement | null>,
    solarWindImg: React.MutableRefObject<HTMLImageElement | null>,
    gameOverImg: React.MutableRefObject<HTMLImageElement | null>,
    solarWind: { x: number; y: number; speed: number }[],
    gameOver: boolean
) => {
    ctx.clearRect(0, 0, 800, 600);

    if (earthImg.current) {
        ctx.drawImage(earthImg.current, 650, 150, 300, 300);
    }

    if (magnetosphereImg.current && !gameOver) {
        ctx.drawImage(magnetosphereImg.current, 595, 136, 350, 350);
    }

    solarWind.forEach((wind) => {
        if (solarWindImg.current) {
            ctx.drawImage(solarWindImg.current, wind.x, wind.y, 35, 35);
        }
    });

    if (gameOver) {
        if (gameOverImg.current) {
            ctx.drawImage(gameOverImg.current, 250, 150, 300, 300);
        }
        // TODO: Draw a destroyed Earth here (add a new image or modify existing rendering)
    }
};
