import React from 'react';


// Bouton étoile favoris (remplace le coeur)
export default function FavoriteButton({ isFavorite = false, onClick }) {
    return (
        <button
            className="favorite-btn bg-none border-none p-0 cursor-pointer"
            onClick={onClick}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
            <svg
                className="w-9 h-9 transition-[filter] duration-[180ms]"
                width="36" height="36" viewBox="0 0 24 24"
                aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                style={{
                    filter: isFavorite
                        ? 'drop-shadow(0 0 8px #00c3ff) drop-shadow(0 0 16px #00c3ff80)'
                        : 'drop-shadow(0 0 6px #00c3ff80)',
                }}
            >
                <defs>
                    <linearGradient id="star-gradient" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#00c3ff" stopOpacity="0.55" />
                        <stop offset="80%" stopColor="#ffe066" stopOpacity="0.55" />
                    </linearGradient>
                </defs>
                <polygon
                    points="12,2 15,9 22,9.3 17,14.1 18.5,21 12,17.5 5.5,21 7,14.1 2,9.3 9,9"
                    fill={isFavorite ? '#00c3ff' : 'transparent'}
                    stroke="url(#star-gradient)"
                    strokeWidth="1.7"
                    style={{
                        filter: isFavorite
                            ? 'drop-shadow(0 0 8px #00c3ff) drop-shadow(0 0 16px #00c3ff80)'
                            : 'drop-shadow(0 0 6px #00c3ff80)',
                        transition: 'filter 0.18s',
                    }}
                />
            </svg>
        </button>
    );
}
