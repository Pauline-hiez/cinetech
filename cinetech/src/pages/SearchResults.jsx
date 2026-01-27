import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
    const query = useQuery().get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }
        setLoading(true);
        setError(null);
        searchMovies(query)
            .then(res => setResults(res.filter(m => m.poster_path)))
            .catch(() => setError('Erreur lors de la recherche.'))
            .finally(() => setLoading(false));
    }, [query]);

    if (!query || query.length < 2) return <div>Veuillez entrer au moins 2 caractères.</div>;
    if (loading) return <div>Recherche en cours...</div>;
    if (error) return <div>{error}</div>;
    if (results.length === 0) return <div>Aucun résultat trouvé.</div>;

    return (
        <div>
            <h2>Résultats pour "{query}"</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                {results.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}
