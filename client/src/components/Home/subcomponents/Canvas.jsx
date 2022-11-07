import { useRef, useEffect } from "react";

// Yeah well I obviously didn't write the canvas code, but I had to adapt it to 'react' and understand it to fix some buggy behavior
// original code is here: https://codepen.io/jh3y/pen/GGmPKd
function Canvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        // console.log("CANVAS useEffect");

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // requestAnimationFrame;

        const OPTIONS = {
            AMOUNT: 100,
            UPPER_LIMIT: 5,
            LOWER_LIMIT: 1,
        };

        const UPPER_SIZE = 10;
        const LOWER_SIZE = 4;

        const doIt = () => Math.random() > 0.5;

        const update = (p) =>
            doIt()
                ? Math.max(OPTIONS.LOWER_LIMIT, p - 1)
                : Math.min(p + 1, OPTIONS.UPPER_LIMIT);

        const reset = (p) => {
            p.x = p.startX;
            p.y = p.startY;
        };

        const floored = (r) => Math.floor(Math.random() * r);

        const genParticles = () =>
            new Array(OPTIONS.AMOUNT).fill().map(() => {
                const size = floored(UPPER_SIZE) + LOWER_SIZE;
                const c = document.createElement("canvas");
                const ctx = c.getContext("2d");
                const r = (Math.PI / 180) * floored(360);
                const color = `rgba(255,${
                    100 + Math.floor(Math.random() * 70)
                }, 0, ${Math.random()})`;

                const xDelayed = doIt();
                const startX = xDelayed
                    ? -(size + floored(canvas.width))
                    : floored(canvas.width * 0.25);
                const startY = xDelayed
                    ? size +
                      floored(canvas.height * 0.25) +
                      Math.floor(canvas.height * 0.75)
                    : canvas.height + size + floored(canvas.height);
                c.height = size;
                c.width = size;
                context.globalCompositeOperation = "multiply";
                ctx.translate(size / 2, size / 2);
                ctx.rotate(r);
                ctx.translate(-(size / 2), -(size / 2));
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, size, size);
                return {
                    x: startX,
                    y: startY,
                    startY,
                    startX,
                    c,
                    r,
                    vx: floored(OPTIONS.UPPER_LIMIT / 4),
                    vy: floored(OPTIONS.UPPER_LIMIT / 4),
                    size,
                };
            });

        let particles = genParticles();
        // console.log("particles.length :", particles.length);

        let FRAME_COUNT = 0;

        const draw = () => {
            if (
                canvas.width !== window.innerWidth ||
                canvas.height !== window.innerHeight
            ) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                particles = genParticles();
            }
            // context.restore();
            for (const particle of particles) {
                context.clearRect(
                    particle.x,
                    particle.y,
                    particle.size,
                    particle.size
                );
                FRAME_COUNT++;
                if (particle.y < canvas.height || particle.startX < 0)
                    particle.x += particle.vx;
                if (particle.x > 0 || particle.startY > canvas.height)
                    particle.y -= particle.vy;
                if (FRAME_COUNT % 11 === 0 && doIt())
                    particle.vx = update(particle.vx);
                if (FRAME_COUNT % 13 === 0 && doIt())
                    particle.vy = update(particle.vy);
                context.drawImage(particle.c, particle.x, particle.y);
                if (particle.x > canvas.width || particle.y < -particle.size)
                    reset(particle);
            }
            requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
    }, []);

    return <canvas id="canvas" ref={canvasRef} />;
}

export default Canvas;
