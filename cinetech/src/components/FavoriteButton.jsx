import React, { useState } from 'react';

// Un simple bouton coeur SVG, blanc par défaut, rouge si actif
export default function FavoriteButton({ isFavorite = false, onClick }) {
    return (
        <button
            className="favorite-btn"
            onClick={onClick}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 3,
                padding: 0,
            }}
        >
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill={isFavorite ? '#e63946' : 'white'}
                stroke="#e63946"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))' }}
            >
                <path d="M12 21s-6.2-5.3-8.5-8.1C1.7 10.2 2.2 7.1 5 5.6c2.1-1.1 4.2-.1 5.5 1.3C11.8 5.5 13.9 4.5 16 5.6c2.8 1.5 3.3 4.6 1.5 7.3C18.2 15.7 12 21 12 21z" />
            </svg>
        </button>
    );
}
