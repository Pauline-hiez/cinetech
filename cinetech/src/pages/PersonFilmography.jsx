import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default function PersonFilmography() {
    const { personId } = useParams();
    const [person, setPerson] = useState(null);
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPerson() {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/person/${personId}?language=fr-FR`, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            setPerson(data);
            const creditsRes = await fetch(`${BASE_URL}/person/${personId}/combined_credits?language=fr-FR`, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            });
            const creditsData = await creditsRes.json();
            setCredits(creditsData.cast || []);
            setLoading(false);
        }
        fetchPerson();
    }, [personId]);

    if (loading) return <div>Chargement...</div>;
    if (!person) return <div>Personne non trouvée.</div>;

    return (
        <div className="max-w-[1200px] mx-auto p-6">
            <h2>{person.name}</h2>
            <p>{person.biography}</p>
            <h3>Filmographie</h3>
            <div className="flex flex-wrap gap-6 justify-center">
                {credits.map((item) => {
                    const poster = item.poster_path
                        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                        : null;
                    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                    if (!poster) return null;
                    return (
                        <Link
                            key={item.credit_id}
                            to={`/${type}/${item.id}`}
                            className="movie-card text-center no-underline text-white bg-none shadow-none p-0"
                        >
                            <div className="movie-card-img-container">
                                <img
                                    src={poster}
                                    alt={item.title || item.name || item.original_name || 'Titre inconnu'}
                                    className="movie-card-img"
                                    title={`${type === 'movie' ? 'Film' : 'Série'}\n${item.title || item.name || item.original_name || 'Titre inconnu'}`}
                                />
                                <div className="movie-card-info">
                                    <div style={{ fontSize: 12, color: '#aee1f9', fontWeight: 700, marginBottom: 2 }}>
                                        {type === 'movie' ? 'Film' : 'Série'}
                                    </div>
                                    <h3>{item.title || item.name || item.original_name || 'Titre inconnu'}</h3>
                                    <div className="movie-card-type-year" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {(item.release_date || item.first_air_date) && (
                                            <span className="movie-card-year">{(item.release_date || item.first_air_date || '').slice(0, 4)}</span>
                                        )}
                                    </div>
                                    {item.vote_average ? (
                                        <div className="movie-card-vote">⭐ {item.vote_average}</div>
                                    ) : null}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
