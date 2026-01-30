/**
 * Page Filmographie d'une personne
 * Affiche les informations et la filmographie complète d'un acteur/réalisateur
 * avec liens cliquables vers chaque film/série
 */

// Importation des hooks React et du routing
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Pour récupérer l'ID de la personne depuis l'URL
// Importation des composants
import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";
// Importation des services API
import { getPersonDetails, getPersonCredits } from "../services/tmdb";

export default function PersonFilmography() {
    // Récupération de l'ID de la personne depuis l'URL
    const { personId } = useParams();

    // États pour stocker les données
    const [person, setPerson] = useState(null); // Informations de la personne
    const [credits, setCredits] = useState([]); // Liste des films/séries
    const [loading, setLoading] = useState(true); // Indicateur de chargement

    /**
     * Effect pour charger les informations de la personne et sa filmographie
     * Se déclenche au montage et à chaque changement de personId
     */
    useEffect(() => {
        async function fetchPerson() {
            setLoading(true);
            try {
                // Récupération des détails de la personne (nom, bio, photo)
                const personData = await getPersonDetails(personId);
                setPerson(personData);

                // Récupération de la filmographie (films et séries)
                const creditsData = await getPersonCredits(personId);
                setCredits(creditsData.cast || []); // cast = rôles d'acteur
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPerson();
    }, [personId]); // Dépendance : personId

    // Affichage selon l'état
    if (loading) return <Spinner />; // Indicateur de chargement
    if (!person) return <div className="text-center text-white text-xl my-20">Personne non trouvée.</div>;

    return (
        <div className="px-2 sm:px-4">
            {/* Section informations de la personne */}
            <div className="max-w-[1100px] mx-auto mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                    {/* Photo de la personne */}
                    {person.profile_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                            alt={person.name}
                            className="w-48 h-72 rounded-2xl object-cover shadow-[0_6px_32px_#000b]"
                        />
                    )}
                    {/* Nom et biographie */}
                    <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl text-[#aee1f9] mb-4">{person.name}</h2>
                        {person.biography && (
                            <p className="text-white text-base leading-relaxed">{person.biography}</p>
                        )}
                    </div>
                </div>
                {/* Titre de la section filmographie */}
                <h3 className="text-xl md:text-2xl text-[#aee1f9] mb-6 text-center">Filmographie</h3>
            </div>

            {/* Grille de la filmographie */}
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
                {credits
                    .filter(item => item.poster_path) // Filtrage : uniquement les films/séries avec affiche
                    .map((item) => (
                        <MovieCard
                            key={item.credit_id}
                            movie={{
                                ...item,
                                // Détermination du type (film ou série)
                                media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie')
                            }}
                        />
                    ))}
            </div>
        </div>
    );
}
