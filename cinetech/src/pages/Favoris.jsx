
import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';

export default function Favoris() {
    const [favoris, setFavoris] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('favoris') || '[]');
        setFavoris(stored);
        const handleStorage = () => {
            setFavoris(JSON.parse(localStorage.getItem('favoris') || '[]'));
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const favorisFilms = favoris.filter(f => f.media_type === 'movie' || (!f.media_type && f.title && (!f.name || f.title && !f.name)));
    const favorisSeries = favoris.filter(f => f.media_type === 'tv' || (!f.media_type && f.name));

    return (
        <div>
            <h1 style={{ color: '#fff', marginBottom: 40, marginTop: 0, fontWeight: 700, fontSize: '2.2rem', textAlign: 'center' }}>Mes favoris</h1>
            {favoris.length === 0 ? (
                <p style={{ color: '#fff' }}>Aucun favori pour le moment.</p>
            ) : (
                <>
                    <h2 style={{ marginBottom: 24 }}>Films</h2>
                    {favorisFilms.length === 0 ? <p style={{ color: '#fff' }}>Aucun film en favori.</p> : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: 48 }}>
                            {[...favorisFilms].reverse().map((media) => (
                                <MovieCard key={media.id + '-movie'} movie={media} />
                            ))}
                        </div>
                    )}
                    <h2 style={{ marginBottom: 24 }}>Séries</h2>
                    {favorisSeries.length === 0 ? <p style={{ color: '#fff' }}>Aucune série en favori.</p> : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                            {[...favorisSeries].reverse().map((media) => (
                                <MovieCard key={media.id + '-tv'} movie={media} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
