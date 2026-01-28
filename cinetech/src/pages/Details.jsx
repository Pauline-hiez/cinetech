import React, { useEffect, useState } from "react";
import FavoriteButton from "../components/FavoriteButton";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, getSimilarMovies, getMovieCredits, getMovieReviews } from "../services/tmdb";
import "../App.css";

const Details = () => {
    const { id, type } = useParams(); // type: 'movie' or 'tv'
    const [details, setDetails] = useState(null);
    const [credits, setCredits] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const det = await getMovieDetails(id, type);
            setDetails(det);
            const cred = await getMovieCredits(id, type);
            setCredits(cred);
            const sim = await getSimilarMovies(id, type);
            setSimilar(sim?.results?.slice(0, 7) || []);
            const rev = await getMovieReviews(id, type);
            setReviews(rev?.results || []);
        }
        fetchData();
    }, [id, type]);

    // Simule l'état favori (à remplacer par votre logique réelle)
    const [isFavorite, setIsFavorite] = useState(false);
    const handleFavoriteClick = () => setIsFavorite(fav => !fav);

    if (!details || !credits) return <div className="spinner">Chargement...</div>;

    return (
        <div className="details-page details-page-fav">
            <div className="favorite-btn-wrapper">
                <FavoriteButton isFavorite={isFavorite} onClick={handleFavoriteClick} />
            </div>
            <div className="details-header">
                <div className="cover-image-placeholder" style={{ padding: 0, background: 'none', boxShadow: 'none' }}>
                    {details.poster_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w780${details.poster_path}`}
                            alt={details.title || details.name}
                            style={{ width: 260, height: 400, borderRadius: 16, objectFit: 'cover', boxShadow: '0 6px 32px #000b' }}
                        />
                    ) : (
                        <div style={{ width: 260, height: 400, background: '#111827', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aee1f9', fontSize: '1.5rem' }}>
                            Pas d'image
                        </div>
                    )}
                </div>
                <div className="details-info">
                    <h2>{details.title || details.name}</h2>
                    <p><strong>Synopsis :</strong> {details.original_language === 'fr' ? details.overview : (details.overview_fr || details.overview)}</p>
                    <div className="movie-infos-block">
                        <div className="movie-infos-row">
                            <span className="movie-info movie-genre">
                                <span className="movie-info-icon">🎬</span>
                                <span className="movie-info-label">Genre :</span> {details.genres?.map(g => g.name).join(', ')}
                            </span>
                            <span className="movie-info movie-year">
                                <span className="movie-info-icon">📅</span>
                                <span className="movie-info-label">Année :</span> {
                                    details.release_date
                                        ? new Date(details.release_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
                                        : details.first_air_date
                                            ? new Date(details.first_air_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
                                            : ''
                                }
                            </span>
                            {type === 'tv' && (
                                <>
                                    <span className="movie-info movie-seasons">
                                        <span className="movie-info-icon">📺</span>
                                        <span className="movie-info-label">Saisons :</span> {details.number_of_seasons}
                                        <span style={{ marginLeft: 12, fontWeight: 400, color: '#aee1f9', fontSize: '0.98em' }}>
                                            {details.status === 'Ended' ? '(Terminée)' : details.status === 'Returning Series' ? '(En cours)' : details.status ? `(${details.status})` : ''}
                                        </span>
                                    </span>
                                    <span className="movie-info movie-episodes">
                                        <span className="movie-info-icon">🎞️</span>
                                        <span className="movie-info-label">Épisodes :</span> {details.number_of_episodes}
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="movie-infos-row">
                            <span className="movie-info movie-actors">
                                <span className="movie-info-icon">⭐</span>
                                <span className="movie-info-label">Acteurs :</span> {credits.cast?.slice(0, 3).map(a => a.name).join(', ')}
                            </span>
                        </div>
                        <div className="movie-infos-row">
                            <span className="movie-info movie-crew">
                                <span className="movie-info-icon">🛠️</span>
                                <span className="movie-info-label">Équipe technique :</span> {credits.crew?.slice(0, 2).map(c => `${c.name} (${c.job})`).join(', ')}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
            <div className="similar-section">
                <div className="similar-title-wrapper">
                    <h3 className="similar-title-centered">
                        Vous aimerez peut-être :
                    </h3>
                </div>
                <div className="similar-list" style={{ gap: 40 }}>
                    {similar.slice(0, 6).map((item) => {
                        const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                        return (
                            <Link
                                to={`/${mediaType}/${item.id}`}
                                key={item.id}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div className="similar-card" style={{ flexDirection: 'column', padding: 6, background: 'transparent', boxShadow: 'none' }}>
                                    {item.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                                            alt={item.title || item.name}
                                            style={{ width: 145, height: 205, borderRadius: 14, objectFit: 'cover', marginBottom: 12 }}
                                        />
                                    ) : (
                                        <div style={{ width: 95, height: 135, background: '#cbd5e1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#232f4b', fontSize: '0.95rem', marginBottom: 8 }}>
                                            Pas d'image
                                        </div>
                                    )}
                                    <div className="similar-placeholder" style={{ fontSize: 13, textAlign: 'center', color: '#232f4b', fontWeight: 500, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.title || item.name}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* Section avis et commentaires supprimée */}
        </div>
    );
};

export default Details;
