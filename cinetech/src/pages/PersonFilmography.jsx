import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";
import { getPersonDetails, getPersonCredits } from "../services/tmdb";

export default function PersonFilmography() {
    const { personId } = useParams();
    const [person, setPerson] = useState(null);
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPerson() {
            setLoading(true);
            try {
                const personData = await getPersonDetails(personId);
                setPerson(personData);
                const creditsData = await getPersonCredits(personId);
                setCredits(creditsData.cast || []);
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPerson();
    }, [personId]);

    if (loading) return <Spinner />;
    if (!person) return <div className="text-center text-white text-xl my-20">Personne non trouvée.</div>;

    return (
        <div className="px-2 sm:px-4">
            <div className="max-w-[1100px] mx-auto mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                    {person.profile_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                            alt={person.name}
                            className="w-48 h-72 rounded-2xl object-cover shadow-[0_6px_32px_#000b]"
                        />
                    )}
                    <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl text-[#aee1f9] mb-4">{person.name}</h2>
                        {person.biography && (
                            <p className="text-white text-base leading-relaxed">{person.biography}</p>
                        )}
                    </div>
                </div>
                <h3 className="text-xl md:text-2xl text-[#aee1f9] mb-6 text-center">Filmographie</h3>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
                {credits
                    .filter(item => item.poster_path)
                    .map((item) => (
                        <MovieCard
                            key={item.credit_id}
                            movie={{
                                ...item,
                                media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie')
                            }}
                        />
                    ))}
            </div>
        </div>
    );
}
