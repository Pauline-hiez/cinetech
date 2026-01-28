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
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
            <h2>{person.name}</h2>
            <p>{person.biography}</p>
            <h3>Filmographie</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
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
                            className="movie-card"
                            style={{ width: 180, textAlign: 'center', textDecoration: 'none', color: '#fff', background: 'none', boxShadow: 'none', padding: 0 }}
                        >
                            <div className="movie-card-img-container">
                                <img
                                    src={poster}
                                    alt={item.title || item.name}
                                    className="movie-card-img"
                                />
                                <div className="movie-card-info">
                                    <h3>{item.title || item.name}</h3>
                                    {item.release_date || item.first_air_date ? (
                                        <div className="movie-card-year">{(item.release_date || item.first_air_date || '').slice(0, 4)}</div>
                                    ) : null}
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
