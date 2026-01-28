import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { useLocation } from 'react-router-dom';
import { searchMoviesAndSeries } from '../services/tmdb';
import MovieCard from '../components/MovieCard';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
    const params = useQuery();
    const query = params.get('q') || '';
    const type = params.get('type') || '';
    const year = params.get('year') || '';
    const genre = params.get('genre') || '';
    const country = params.get('country') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Si aucun critère n'est renseigné, ne rien afficher
        if (!query && !type && !year && !genre && !country) {
            setResults([]);
            return;
        }
        setLoading(true);
        setError(null);
        async function fetchAllResults() {
            let allResults = [];
            let page = 1;
            let totalPages = 1;
            try {
                do {
                    // Recherche combinée : si query, sinon recherche par filtres
                    let res;
                    if (query) {
                        res = await searchMoviesAndSeries(query, page);
                    } else {
                        // Recherche par filtres : type, year, genre, country
                        // On utilise discover/movie ou discover/tv selon le type
                        const API_KEY = process.env.REACT_APP_API_KEY;
                        const BASE_URL = 'https://api.themoviedb.org/3';
                        let url = '';
                        let headers = {
                            Authorization: `Bearer ${API_KEY}`,
                            'Content-Type': 'application/json',
                        };
                        if (type === 'tv') {
                            url = `${BASE_URL}/discover/tv?page=${page}`;
                            if (year) url += `&first_air_date_year=${year}`;
                            if (genre) url += `&with_genres=${genre}`;
                            if (country) url += `&with_origin_country=${country}`;
                        } else {
                            url = `${BASE_URL}/discover/movie?page=${page}`;
                            if (year) url += `&primary_release_year=${year}`;
                            if (genre) url += `&with_genres=${genre}`;
                            if (country) url += `&with_origin_country=${country}`;
                        }
                        const response = await fetch(url, { headers });
                        const data = await response.json();
                        res = { results: data.results || [], total_pages: data.total_pages || 1 };
                    }
                    const { results, total_pages } = res;
                    if (Array.isArray(results)) {
                        allResults = allResults.concat(results.filter(m => m.poster_path));
                        totalPages = total_pages;
                        if (results.length < 20) break;
                    }
                    page++;
                } while (page <= totalPages && page <= 10);
            } catch (e) {
                setError('Erreur lors de la recherche.');
            }
            setResults(allResults);
            setLoading(false);
        }
        fetchAllResults();
    }, [query, type, year, genre, country]);

    if (!query && !type && !year && !genre && !country) return <div>Veuillez sélectionner un filtre ou entrer une recherche.</div>;
    if (loading) return <Spinner />;
    if (error) return <div>{error}</div>;
    if (results.length === 0) return <div>Aucun résultat trouvé.</div>;

    // Affichage du titre selon recherche ou filtres
    let titre = '';
    if (query) {
        titre = `Résultats pour "${query}"`;
    } else {
        let t = type === 'tv' ? 'Séries' : type === 'movie' ? 'Films' : 'Films et séries';
        let y = year ? ` de ${year}` : '';
        let g = genre ? `, genre ${genre}` : '';
        let c = country ? `, pays ${country}` : '';
        titre = `${t}${y}${g}${c}`;
    }

    return (
        <div>
            <h2 style={{ marginBottom: '48px' }}>{titre}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                {results.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}
