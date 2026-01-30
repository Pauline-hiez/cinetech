/**
 * Page Séries
 * Affiche une grille de séries populaires avec pagination
 * Charge automatiquement des pages supplémentaires pour garantir 24 séries avec images
 */

// Importation des hooks React et composants
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner'; // Indicateur de chargement
import { fetchPopularSeries } from '../services/tmdb'; // Service API
import MovieCard from '../components/MovieCard'; // Carte de série (utilise le même composant que les films)
import Pagination from '../components/Pagination'; // Composant de pagination

// Nombre de séries à afficher par page
const SERIES_PER_PAGE = 24;

export default function Series() {
    // États pour gérer les séries et l'interface
    const [series, setSeries] = useState([]); // Liste des séries
    const [loading, setLoading] = useState(true); // Indicateur de chargement
    const [error, setError] = useState(null); // Message d'erreur
    const [page, setPage] = useState(1); // Page actuelle
    const [totalPages, setTotalPages] = useState(1); // Nombre total de pages

    /**
     * Effect pour charger les séries populaires avec images
     * Se déclenche à chaque changement de page
     */
    useEffect(() => {
        let isMounted = true; // Flag pour éviter les mises à jour sur composant démonté

        async function getPopularSeriesWithImages() {
            setLoading(true);
            setError(null);
            let seriesWithImage = []; // Séries avec affiches
            let apiPage = page; // Page API à interroger

            try {
                // Boucle pour charger suffisamment de séries avec images
                while (seriesWithImage.length < SERIES_PER_PAGE) {
                    const data = await fetchPopularSeries(apiPage);
                    if (isMounted && data.results) {
                        // Filtrage : ne garder que les séries avec affiche
                        const filtered = data.results.filter((serie) => serie.poster_path);
                        seriesWithImage = seriesWithImage.concat(filtered);

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
                // Limitation à exactement SERIES_PER_PAGE séries
                if (isMounted) setSeries(seriesWithImage.slice(0, SERIES_PER_PAGE));
            } catch (err) {
                if (isMounted) setError('Erreur lors du chargement des séries.');
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        getPopularSeriesWithImages();

        // Nettoyage : empêche les mises à jour après démontage
        return () => { isMounted = false; };
    }, [page]); // Dépendance : page

    // Affichage selon l'état
    if (loading) return <Spinner />; // Indicateur de chargement
    if (error) return <div>{error}</div>; // Message d'erreur

    return (
        <div className="px-2 sm:px-4">
            {/* Grille de séries */}
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
                {series.map((serie) => (
                    <MovieCard key={serie.id} movie={{
                        ...serie,
                        title: serie.name, // Utilisation de 'name' au lieu de 'title' pour les séries
                        release_date: serie.first_air_date // Utilisation de 'first_air_date' au lieu de 'release_date'
                    }} />
                ))}
            </div>

            {/* Pagination */}
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
