import React, { useEffect, useState } from "react";
import CommentSection from "../components/CommentSection";
import FavoriteButton from "../components/FavoriteButton";
import MovieCard from "../components/MovieCard";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, getSimilarMovies, getMovieCredits, getMovieReviews } from "../services/tmdb";
import { getMovieVideos } from "../services/tmdb";
import "../App.css";

const Details = () => {
    const { id, type } = useParams(); // type: 'movie' or 'tv'
    const [details, setDetails] = useState(null);
    const [credits, setCredits] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [reviews, setReviews] = useState([]);
    // Pour stocker les commentaires utilisateurs locaux (persistés par film/série)
    const commentsKey = `comments_${type}_${id}`;
    const [userComments, setUserComments] = useState(() => {
        try {
            const saved = localStorage.getItem(commentsKey);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Simule un utilisateur connecté (à remplacer par votre auth)
    // Récupère le pseudo de l'utilisateur connecté (à remplacer par votre logique d'authentification réelle)
    // Récupère le pseudo de l'utilisateur connecté (ne met pas 'Utilisateur' si vide)
    const pseudo = localStorage.getItem('pseudo');
    const user = pseudo && pseudo.trim() ? { name: pseudo } : null;

    // Ajout d'un commentaire
    const handleAddComment = ({ comment, rating, user: userName }) => {
        setUserComments(prev => {
            const now = new Date();
            const date = now.toLocaleDateString('fr-FR');
            const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            const newComments = [
                { comment, rating, user: userName || user.name, date, time },
                ...prev
            ];
            try {
                localStorage.setItem(commentsKey, JSON.stringify(newComments));
            } catch { }
            return newComments;
        });
    };
    // Synchronise les commentaires si on change de film/série
    useEffect(() => {
        try {
            const saved = localStorage.getItem(commentsKey);
            setUserComments(saved ? JSON.parse(saved) : []);
        } catch {
            setUserComments([]);
        }
    }, [commentsKey]);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const det = await getMovieDetails(id, type);
            setDetails(det);
            const cred = await getMovieCredits(id, type);
            setCredits(cred);
            const sim = await getSimilarMovies(id, type);
            setSimilar(sim?.results?.slice(0, 5) || []);
            const rev = await getMovieReviews(id, type);
            setReviews(rev?.results || []);
            const vid = await getMovieVideos(id, type);
            setVideos(vid?.results || []);
        }
        fetchData();
    }, [id, type]);

    // Gestion réelle des favoris dans le localStorage
    const [isFavorite, setIsFavorite] = useState(false);
    // Vérifie si le film/série est déjà en favori au chargement
    useEffect(() => {
        const favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
        const exists = favoris.some(f => f.id === details?.id && (f.media_type === type || f.media_type === details?.media_type));
        setIsFavorite(exists);
    }, [details, type]);

    const handleFavoriteClick = () => {
        if (!details) return;
        let favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
        const exists = favoris.some(f => f.id === details.id && (f.media_type === type || f.media_type === details.media_type));
        if (exists) {
            favoris = favoris.filter(f => !(f.id === details.id && (f.media_type === type || f.media_type === details.media_type)));
            setIsFavorite(false);
        } else {
            // Ajoute le type si absent
            const toSave = { ...details, media_type: type };
            favoris.push(toSave);
            setIsFavorite(true);
        }
        localStorage.setItem('favoris', JSON.stringify(favoris));
        window.dispatchEvent(new Event('storage'));
    };

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
                            title={`Affiche de ${details.title || details.name} (${type === 'movie' ? 'film' : 'série'})`}
                        />
                    ) : (
                        <img
                            src={require('../img/defaut.jpg')}
                            alt="Image par défaut"
                            style={{ width: 260, height: 400, borderRadius: 16, objectFit: 'cover', boxShadow: '0 6px 32px #000b', background: '#111827' }}
                            title="Image par défaut"
                        />
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
                            {type === 'movie' && details.runtime && (
                                <span className="movie-info movie-runtime">
                                    <span className="movie-info-icon">⏱️</span>
                                    <span className="movie-info-label">Durée :</span> {details.runtime} min
                                </span>
                            )}
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
                                <span className="movie-info-label">Acteurs :</span> {credits.cast?.slice(0, 3).map((a, i, arr) => (
                                    <React.Fragment key={a.id}>
                                        <Link to={`/person/${a.id}`} style={{ color: '#aee1f9', textDecoration: 'underline', cursor: 'pointer' }}>{a.name}</Link>{i < arr.length - 1 ? ', ' : ''}
                                    </React.Fragment>
                                ))}
                            </span>
                        </div>
                        <div className="movie-infos-row">
                            <span className="movie-info movie-crew">
                                <span className="movie-info-icon">🛠️</span>
                                <span className="movie-info-label">Équipe technique :</span> {credits.crew?.slice(0, 2).map((c, i, arr) => (
                                    <React.Fragment key={c.id}>
                                        <Link to={`/person/${c.id}`} style={{ color: '#aee1f9', textDecoration: 'underline', cursor: 'pointer' }}>{c.name}</Link> ({c.job}){i < arr.length - 1 ? ', ' : ''}
                                    </React.Fragment>
                                ))}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
            {/* Vidéo du film ou de la série */}
            {videos && videos.length > 0 && (
                <div className="video-section" style={{ margin: '32px 0', textAlign: 'center' }}>
                    <h3 style={{ color: '#fff', marginBottom: 16 }}>Bande-annonce</h3>
                    {(() => {
                        // On cherche une vidéo YouTube de type Trailer ou Teaser
                        const yt = videos.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
                            || videos.find(v => v.site === 'YouTube');
                        return yt ? (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <iframe
                                    width="560"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${yt.key}`}
                                    title={yt.name}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ borderRadius: 12, boxShadow: '0 4px 24px #0004', maxWidth: '100%' }}
                                ></iframe>
                            </div>
                        ) : (
                            <div style={{ color: '#aee1f9', fontSize: 18 }}>Aucune vidéo disponible</div>
                        );
                    })()}
                </div>
            )}
            <div className="similar-section">
                <div className="similar-title-wrapper">
                    <h3 className="similar-title-centered">
                        Vous aimerez peut-être :
                    </h3>
                </div>
                <div className="similar-list" style={{ gap: 40 }}>
                    {similar.map((item) => (
                        <div key={item.id} style={{ width: 180 }}>
                            <MovieCard movie={item} />
                        </div>
                    ))}
                </div>
            </div>
            {/* Section avis et commentaires */}
            <CommentSection
                comments={userComments}
                onSubmit={handleAddComment}
                user={user}
            />
        </div>
    );
};

export default Details;
