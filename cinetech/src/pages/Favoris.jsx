
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
            <h1 className="text-[#aee1f9] mb-10 mt-0 font-bold text-[2.2rem] text-center">Mes favoris</h1>
            {favoris.length === 0 ? (
                <p className="text-white">Aucun favori pour le moment.</p>
            ) : (
                <>
                    <h2 className="mb-6 text-center text-2xl md:text-3xl font-bold text-[#aee1f9]">Films</h2>
                    {favorisFilms.length === 0 ? <p className="text-white">Aucun film en favori.</p> : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem', justifyContent: 'center' }}>
                            {[...favorisFilms].reverse().map((media) => (
                                <MovieCard key={media.id + '-movie'} movie={media} />
                            ))}
                        </div>
                    )}
                    <h2 className="mb-6 text-center text-2xl md:text-3xl font-bold text-[#aee1f9]">Séries</h2>
                    {favorisSeries.length === 0 ? <p className="text-white">Aucune série en favori.</p> : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
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
