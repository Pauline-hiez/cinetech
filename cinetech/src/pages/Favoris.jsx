
import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';

export default function Favoris() {
    const [favoris, setFavoris] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('favoris') || '[]');
        setFavoris(stored);
        // Pour mettre à jour si favoris change ailleurs (ex: autre onglet)
        const handleStorage = () => {
            setFavoris(JSON.parse(localStorage.getItem('favoris') || '[]'));
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <div>
            {favoris.length === 0 ? (
                <p style={{ color: '#fff' }}>Aucun favori pour le moment.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                    {[...favoris].reverse().map((media) => (
                        <MovieCard key={media.id} movie={media} />
                    ))}
                </div>
            )}
        </div>
    );
}
