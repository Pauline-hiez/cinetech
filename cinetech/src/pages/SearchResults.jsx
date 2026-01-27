import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMoviesAndSeries } from '../services/tmdb';
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
        // Récupère toutes les pages de résultats TMDB (max 1000 résultats)
        async function fetchAllResults() {
            let allResults = [];
            let page = 1;
            let totalPages = 1;
            try {
                do {
                    const { results, total_pages } = await searchMoviesAndSeries(query, page);
                    if (Array.isArray(results)) {
                        allResults = allResults.concat(results.filter(m => m.poster_path));
                        totalPages = total_pages;
                        if (results.length < 20) break;
                    }
                    page++;
                } while (page <= totalPages && page <= 10); // Limite à 10 pages (200 résultats max)
            } catch (e) {
                setError('Erreur lors de la recherche.');
            }
            setResults(allResults);
            setLoading(false);
        }
        fetchAllResults();
    }, [query]);

    if (!query || query.length < 2) return <div>Veuillez entrer au moins 2 caractères.</div>;
    if (loading) return <div>Recherche en cours...</div>;
    if (error) return <div>{error}</div>;
    if (results.length === 0) return <div>Aucun résultat trouvé.</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '48px' }}>Résultats pour "{query}"</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                {results.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}
