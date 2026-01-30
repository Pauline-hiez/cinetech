/**
 * Composant StarryBackground (Fond étoilé animé)
 * Crée un fond d'étoiles animées avec effet de scintillement
 * Utilise Canvas pour le rendu et s'adapte au redimensionnement
 */

import { useEffect, useRef } from 'react';

const StarryBackground = () => {
    // Référence au canvas HTML
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d'); // Contexte 2D pour le dessin
        let animationFrameId; // ID de l'animation pour nettoyage
        let stars = []; // Tableau contenant toutes les étoiles

        /**
         * Ajuste la taille du canvas à celle de la fenêtre
         */
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        /**
         * Classe représentant une étoile individuelle
         * Gère sa position, taille, vitesse et effet de scintillement
         */
        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Étoiles plus petites sur mobile
                const isMobile = window.innerWidth < 768;
                this.size = isMobile
                    ? Math.random() * 1 + 0.3
                    : Math.random() * 1 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                // Opacité minimale plus élevée
                this.opacity = Math.random() * 0.5 + 0.5;
                this.fadeSpeed = (Math.random() * 0.02) + 0.005;
                this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Effet de scintillement
                this.opacity += this.fadeSpeed * this.fadeDirection;
                // Opacité min/max ajustée pour meilleure visibilité
                if (this.opacity <= 0.4 || this.opacity >= 1) {
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
            // Plus d'étoiles sur mobile pour meilleure visibilité
            const starCount = Math.floor((canvas.width * canvas.height) / 2000);
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
