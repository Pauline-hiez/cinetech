import React, { useEffect, useRef } from 'react';

const StarryBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let stars = [];

        // Ajuster la taille du canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // Créer une étoile
        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random();
                this.fadeSpeed = (Math.random() * 0.02) + 0.005;
                this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Effet de scintillement
                this.opacity += this.fadeSpeed * this.fadeDirection;
                if (this.opacity <= 0.2 || this.opacity >= 1) {
                    this.fadeDirection *= -1;
                }

                // Réapparaître de l'autre côté
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Initialiser les étoiles
        const initStars = () => {
            stars = [];
            const starCount = Math.floor((canvas.width * canvas.height) / 3000);
            for (let i = 0; i < starCount; i++) {
                stars.push(new Star());
            }
        };

        // Animation
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.update();
                star.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        // Initialisation
        resizeCanvas();
        initStars();
        animate();

        // Gestion du redimensionnement
        window.addEventListener('resize', () => {
            resizeCanvas();
            initStars();
        });

        // Nettoyage
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <>
            <div
                className="fixed top-0 left-0 w-full h-full pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, #020617, #1f2937)',
                    zIndex: 0
                }}
            />
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-full pointer-events-none"
                style={{ background: 'transparent', zIndex: 1 }}
            />
        </>
    );
};

export default StarryBackground;
