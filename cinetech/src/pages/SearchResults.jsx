/**
 * Page des résultats de recherche
 * Affiche les films/séries selon les critères de recherche ou filtres
 * Supporte la recherche par mot-clé, type, année, genre et pays
 */

// Importation des hooks React et du routing
import { useEffect, useState } from 'react';
import { genres as GENRES } from '../components/SearchFilters'; // Liste des genres
import Spinner from '../components/Spinner';
import { useLocation } from 'react-router-dom';
import { searchMoviesAndSeries } from '../services/tmdb';
import MovieCard from '../components/MovieCard';

/**
 * Hook personnalisé pour extraire les paramètres de l'URL
 */
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
    // Extraction des paramètres de recherche depuis l'URL
    const params = useQuery();
    const query = params.get('q') || ''; // Mot-clé de recherche
    const type = params.get('type') || ''; // Type: movie ou tv
    const year = params.get('year') || ''; // Année de sortie
    const genre = params.get('genre') || ''; // ID du genre
    const country = params.get('country') || ''; // Code pays

    // États pour gérer les résultats
    const [results, setResults] = useState([]); // Résultats de recherche
    const [loading, setLoading] = useState(false); // Indicateur de chargement
    const [error, setError] = useState(null); // Message d'erreur

    /**
     * Effect pour effectuer la recherche
     * Se déclenche à chaque changement de critères
     */
    useEffect(() => {
        // Si aucun critère, ne rien afficher
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
                // Boucle pour charger plusieurs pages de résultats
                do {
                    let res;

                    if (query) {
                        // Recherche par mot-clé
                        res = await searchMoviesAndSeries(query, page);
                    } else {
                        // Recherche par filtres (genre, année, pays)
                        const API_KEY = process.env.REACT_APP_API_KEY;
                        const BASE_URL = 'https://api.themoviedb.org/3';
                        let url = '';
                        let headers = {
                            Authorization: `Bearer ${API_KEY}`,
                            'Content-Type': 'application/json',
                        };

                        // Construction de l'URL selon le type
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

                        // Requête API
                        const response = await fetch(url, { headers });
                        const data = await response.json();
                        res = { results: data.results || [], total_pages: data.total_pages || 1 };
                    }

                    const { results, total_pages } = res;
                    if (Array.isArray(results)) {
                        // Filtrage : ne garder que les films/séries avec affiche
                        allResults = allResults.concat(results.filter(m => m.poster_path));
                        totalPages = total_pages;
                        // Arrêt si moins de 20 résultats (page incomplète)
                        if (results.length < 20) break;
                    }
                    page++;
                } while (page <= totalPages && page <= 10); // Limite à 10 pages

            } catch (e) {
                setError('Erreur lors de la recherche.');
            }

            setResults(allResults);
            setLoading(false);
        }

        fetchAllResults();
    }, [query, type, year, genre, country]); // Dépendances : critères de recherche

    // Gestion des différents états d'affichage
    if (!query && !type && !year && !genre && !country) return <div>Veuillez sélectionner un filtre ou entrer une recherche.</div>;
    if (loading) return <Spinner />;
    if (error) return <div>{error}</div>;
    if (results.length === 0) return <div>Aucun résultat trouvé.</div>;

    /**
     * Construction du titre dynamique selon les critères
     */
    let titre = '';
    if (query) {
        // Recherche par mot-clé
        titre = `Résultats pour "${query}"`;
    } else {
        // Recherche par filtres
        let t = type === 'tv' ? 'Séries' : type === 'movie' ? 'Films' : 'Films et séries';
        let y = year ? ` de ${year}` : '';
        let genreName = '';
        if (genre) {
            const found = GENRES.find(g => String(g.id) === String(genre));
            genreName = found ? found.name : genre;
        }
        let g = genreName ? `, genre ${genreName}` : '';
        let c = country ? `, pays ${country}` : '';
        titre = `${t}${y}${g}${c}`;
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4">
            {/* Titre des résultats */}
            <h2 className="mb-8 md:mb-12 text-center text-xl md:text-2xl">{titre}</h2>

            {/* Grille des résultats */}
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
                {results.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}
