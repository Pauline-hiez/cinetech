/**
 * Page Favoris
 * Affiche la liste des films et séries ajoutés aux favoris par l'utilisateur
 * Les favoris sont stockés dans le localStorage
 */

// Importation des hooks React
import { useEffect, useState } from 'react';
// Importation du composant pour afficher chaque film/série
import MovieCard from '../components/MovieCard';

export default function Favoris() {
    // État pour stocker la liste des favoris
    const [favoris, setFavoris] = useState([]);

    /**
     * Effect pour charger les favoris depuis le localStorage
     * et écouter les changements (ajout/suppression depuis d'autres pages)
     */
    useEffect(() => {
        // Chargement initial des favoris
        const stored = JSON.parse(localStorage.getItem('favoris') || '[]');
        setFavoris(stored);

        // Fonction pour mettre à jour les favoris lors d'un changement
        const handleStorage = () => {
            setFavoris(JSON.parse(localStorage.getItem('favoris') || '[]'));
        };

        // Écoute de l'événement 'storage' pour synchroniser les favoris
        window.addEventListener('storage', handleStorage);

        // Nettoyage : suppression de l'écouteur au démontage du composant
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Séparation des favoris entre films et séries
    // Films : ceux avec media_type='movie' ou qui ont un 'title' mais pas de 'name'
    const favorisFilms = favoris.filter(f => f.media_type === 'movie' || (!f.media_type && f.title && (!f.name || f.title && !f.name)));
    // Séries : ceux avec media_type='tv' ou qui ont un 'name'
    const favorisSeries = favoris.filter(f => f.media_type === 'tv' || (!f.media_type && f.name));

    return (
        <div>
            {/* Titre principal de la page */}
            <h1 className="text-[#aee1f9] mb-10 mt-0 font-bold text-[2.2rem] text-center">Mes favoris</h1>

            {/* Affichage si aucun favori */}
            {favoris.length === 0 ? (
                <p className="text-white">Aucun favori pour le moment.</p>
            ) : (
                <>
                    {/* Section Films */}
                    <h2 className="mb-6 text-center text-2xl md:text-3xl font-bold text-[#aee1f9]">Films</h2>
                    {favorisFilms.length === 0 ? <p className="text-white">Aucun film en favori.</p> : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem', justifyContent: 'center' }}>
                            {/* Affichage des films en ordre inversé (les plus récents en premier) */}
                            {[...favorisFilms].reverse().map((media) => (
                                <MovieCard key={media.id + '-movie'} movie={media} />
                            ))}
                        </div>
                    )}

                    {/* Section Séries */}
                    <h2 className="mb-6 text-center text-2xl md:text-3xl font-bold text-[#aee1f9]">Séries</h2>
                    {favorisSeries.length === 0 ? <p className="text-white">Aucune série en favori.</p> : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
                            {/* Affichage des séries en ordre inversé (les plus récentes en premier) */}
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
