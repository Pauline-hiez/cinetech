/**
 * Page Films
 * Affiche une grille de films populaires avec pagination
 * Charge automatiquement des pages supplémentaires pour garantir 24 films avec images
 */

// Importation des hooks React et composants
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner'; // Indicateur de chargement
import { fetchPopularMovies } from '../services/tmdb'; // Service API
import MovieCard from '../components/MovieCard'; // Carte de film
import Pagination from '../components/Pagination'; // Composant de pagination

// Nombre de films à afficher par page
const MOVIES_PER_PAGE = 24;

function Movies() {
    // États pour gérer les films et l'interface
    const [movies, setMovies] = useState([]); // Liste des films
    const [loading, setLoading] = useState(true); // Indicateur de chargement
    const [error, setError] = useState(null); // Message d'erreur
    const [page, setPage] = useState(1); // Page actuelle
    const [totalPages, setTotalPages] = useState(1); // Nombre total de pages

    /**
     * Effect pour charger les films populaires avec images
     * Se déclenche à chaque changement de page
     */
    useEffect(() => {
        let isMounted = true; // Flag pour éviter les mises à jour sur composant démonté

        async function getPopularMoviesWithImages() {
            setLoading(true);
            setError(null);
            let moviesWithImage = []; // Films avec affiches
            let apiPage = page; // Page API à interroger

            try {
                // Boucle pour charger suffisamment de films avec images
                while (moviesWithImage.length < MOVIES_PER_PAGE) {
                    const data = await fetchPopularMovies(apiPage);
                    if (isMounted && data.results) {
                        // Filtrage : ne garder que les films avec affiche
                        const filtered = data.results.filter((movie) => movie.poster_path);
                        moviesWithImage = moviesWithImage.concat(filtered);

                        // Sauvegarde du nombre total de pages (première itération)
                        if (apiPage === 1) {
                            setTotalPages(data.total_pages);
                        }

                        // Arrêt si fin des pages
                        if (data.page >= data.total_pages) break;
                        apiPage++;
                    } else {
                        break;
                    }
                }
                // Limitation à exactement MOVIES_PER_PAGE films
                if (isMounted) setMovies(moviesWithImage.slice(0, MOVIES_PER_PAGE));
            } catch (err) {
                if (isMounted) setError('Erreur lors du chargement des films.');
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        getPopularMoviesWithImages();

        // Nettoyage : empêche les mises à jour après démontage
        return () => { isMounted = false; };
    }, [page]); // Dépendance : page

    // Affichage selon l'état
    if (loading) return <Spinner />; // Indicateur de chargement
    if (error) return <div>{error}</div>; // Message d'erreur

    return (
        <div className="px-2 sm:px-4">
            {/* Grille de films */}
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {/* Pagination */}
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}

export default Movies;
