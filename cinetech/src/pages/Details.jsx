import { useEffect, useState } from "react";
import CommentSection from "../components/CommentSection";
import FavoriteButton from "../components/FavoriteButton";
import MovieCard from "../components/MovieCard";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, getSimilarMovies, getMovieCredits, getMovieReviews } from "../services/tmdb";
import { getMovieVideos } from "../services/tmdb";
import "../App.tailwind.css";

const Details = () => {
    const { id, type } = useParams();
    const [details, setDetails] = useState(null);
    const [credits, setCredits] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [reviews, setReviews] = useState([]);

    const commentsKey = `comments_${type}_${id}`;
    const [userComments, setUserComments] = useState(() => {
        try {
            const saved = localStorage.getItem(commentsKey);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const handleAddComment = ({ comment, rating, user: userName }) => {
        if (!user) return;
        setUserComments(prev => {
            const now = new Date();
            const date = now.toLocaleDateString('fr-FR');
            const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            const newComments = [
                { comment, rating, user: user.username, date, time },
                ...prev
            ];
            try {
                localStorage.setItem(commentsKey, JSON.stringify(newComments));
            } catch { }
            return newComments;
        });
    };

    const handleDeleteComment = (idx) => {
        if (!user) return;
        setUserComments(prev => {
            if (prev[idx]?.user !== user.username) return prev;
            const newComments = prev.filter((_, i) => i !== idx);
            try {
                localStorage.setItem(commentsKey, JSON.stringify(newComments));
            } catch { }
            return newComments;
        });
    };

    const handleEditComment = (idx, updatedComment) => {
        if (!user) return;
        setUserComments(prev => {
            if (prev[idx]?.user !== user.username) return prev;
            const newComments = prev.map((c, i) => i === idx ? { ...c, ...updatedComment } : c);
            try {
                localStorage.setItem(commentsKey, JSON.stringify(newComments));
            } catch { }
            return newComments;
        });
    };

    useEffect(() => {
        try {
            const saved = localStorage.getItem(commentsKey);
            setUserComments(saved ? JSON.parse(saved) : []);
        } catch {
            setUserComments([]);
        }
    }, [commentsKey]);

    const [videos, setVideos] = useState([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const det = await getMovieDetails(id, type);
            setDetails(det);
            const cred = await getMovieCredits(id, type);
            setCredits(cred);
            const sim = await getSimilarMovies(id, type);
            setSimilar(sim?.results?.slice(0, 6) || []);
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
        // Vérifie si l'utilisateur est connecté (clé 'user' dans localStorage)
        const user = localStorage.getItem('user');
        if (!user) {
            alert('Vous devez être connecté pour ajouter ou retirer un favori.');
            return;
        }
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

    if (!details || !credits) return <div className="text-center text-xl my-20 animate-spin">⏳</div>;

    return (
        <div className="relative bg-gradient-to-br from-[#232f4b] to-[#1a2340] rounded-[18px] shadow-[0_8px_48px_#000a] pt-6 md:pt-10 px-4 md:px-8 pb-8 md:pb-16 mx-auto mb-8 md:mb-12 max-w-[1100px] text-white">
            <div className="absolute top-4 md:top-6 right-4 md:right-8 z-10">
                <FavoriteButton isFavorite={isFavorite} onClick={handleFavoriteClick} />
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-14 items-center md:items-start mb-6 md:mb-10">
                <div className="w-[180px] h-[270px] md:w-[220px] md:h-[330px] lg:w-[260px] lg:h-[400px] bg-gray-900 rounded-2xl flex items-center justify-center text-2xl text-[#aee1f9] shadow-[0_6px_32px_#000b] text-center mb-2 shrink-0 mt-8 md:mt-12">
                    {details.poster_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w780${details.poster_path}`}
                            alt={details.title || details.name}
                            className="w-full h-full rounded-2xl object-cover shadow-[0_6px_32px_#000b]"
                            title={`Affiche de ${details.title || details.name} (${type === 'movie' ? 'film' : 'série'})`}
                        />
                    ) : (
                        <img
                            src={require('../img/defaut.jpg')}
                            alt="Image par défaut"
                            className="w-full h-full rounded-2xl object-cover shadow-[0_6px_32px_#000b] bg-gray-900"
                            title="Image par défaut"
                        />
                    )}
                </div>
                <div className="flex-1 text-left w-full">
                    <h2 className="text-xl md:text-2xl lg:text-[2.1rem] mb-2 md:mb-2.5 text-[#aee1f9]">{details.title || details.name}</h2>
                    <p className="text-sm md:text-base lg:text-[1.1rem] mb-3 md:mb-[18px]"><strong>Synopsis :</strong> {details.original_language === 'fr' ? details.overview : (details.overview_fr || details.overview)}</p>
                    <div className="mt-4 md:mt-6 mb-3 md:mb-4 flex flex-col gap-2 md:gap-3">
                        <div className="flex flex-wrap gap-2 md:gap-4 lg:gap-6">
                            <span className="bg-slate-800 text-[#aee1f9] rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base lg:text-[1.08rem] font-medium flex items-center mb-1 md:mb-1.5 shadow-[0_2px_8px_rgba(30,41,59,0.18)]">
                                <span className="mr-1.5 md:mr-2 text-base md:text-[1.15em]">🎬</span>
                                <span className="font-bold text-[#aee1f9] mr-1">Genre :</span> {details.genres?.map(g => g.name).join(', ')}
                            </span>
                            <span className="bg-slate-800 text-[#aee1f9] rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base lg:text-[1.08rem] font-medium flex items-center mb-1 md:mb-1.5 shadow-[0_2px_8px_rgba(30,41,59,0.18)]">
                                <span className="mr-1.5 md:mr-2 text-base md:text-[1.15em]">📅</span>
                                <span className="font-bold text-[#aee1f9] mr-1">Année :</span> {
                                    details.release_date
                                        ? new Date(details.release_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
                                        : details.first_air_date
                                            ? new Date(details.first_air_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
                                            : ''
                                }
                            </span>
                            {type === 'movie' && details.runtime && (
                                <span className="bg-slate-800 text-[#aee1f9] rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base lg:text-[1.08rem] font-medium flex items-center mb-1 md:mb-1.5 shadow-[0_2px_8px_rgba(30,41,59,0.18)]">
                                    <span className="mr-1.5 md:mr-2 text-base md:text-[1.15em]">⏱️</span>
                                    <span className="font-bold text-[#aee1f9] mr-1">Durée :</span> {details.runtime} min
                                </span>
                            )}
                            {type === 'tv' && (
                                <>
                                    <span className="bg-slate-800 text-[#aee1f9] rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base lg:text-[1.08rem] font-medium flex items-center mb-1 md:mb-1.5 shadow-[0_2px_8px_rgba(30,41,59,0.18)]">
                                        <span className="mr-1.5 md:mr-2 text-base md:text-[1.15em]">📺</span>
                                        <span className="font-bold text-[#aee1f9] mr-1">Saisons :</span> {details.number_of_seasons}
                                        <span className="ml-2 md:ml-3 font-normal text-[#aee1f9] text-xs md:text-[0.98em]">
                                            {details.status === 'Ended' ? '(Terminée)' : details.status === 'Returning Series' ? '(En cours)' : details.status ? `(${details.status})` : ''}
                                        </span>
                                    </span>
                                    <span className="bg-slate-800 text-[#aee1f9] rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base lg:text-[1.08rem] font-medium flex items-center mb-1 md:mb-1.5 shadow-[0_2px_8px_rgba(30,41,59,0.18)]">
                                        <span className="mr-1.5 md:mr-2 text-base md:text-[1.15em]">🎞️</span>
                                        <span className="font-bold text-[#aee1f9] mr-1">Épisodes :</span> {details.number_of_episodes}
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-4 lg:gap-6">
                            <div className="bg-slate-800 text-[#aee1f9] rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base lg:text-[1.08rem] font-medium flex items-center mb-1 md:mb-1.5 shadow-[0_2px_8px_rgba(30,41,59,0.18)] flex-wrap gap-3">
                                <span className="mr-1.5 md:mr-2 text-base md:text-[1.15em]">⭐</span>
                                <span className="font-bold text-[#aee1f9] mr-1">Acteurs :</span>
                                <span className="flex flex-wrap gap-3">
                                    {credits.cast?.slice(0, 5).map((a) => (
                                        <Link key={a.id} to={`/person/${a.id}`} className="flex flex-col items-center gap-1 group">
                                            <img
                                                src={a.profile_path ? `https://image.tmdb.org/t/p/w185${a.profile_path}` : require('../img/defaut.jpg')}
                                                alt={a.name}
                                                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-[#4ee1ff] cursor-pointer transition-transform group-hover:scale-110"
                                                title={a.name}
                                            />
                                            <span className="text-xs text-[#aee1f9] text-center max-w-[60px] leading-tight group-hover:text-white transition-colors">{a.name}</span>
                                        </Link>
                                    ))}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-4 lg:gap-6">
                            <div className="bg-slate-800 text-[#aee1f9] rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base lg:text-[1.08rem] font-medium flex items-center mb-1 md:mb-1.5 shadow-[0_2px_8px_rgba(30,41,59,0.18)] flex-wrap gap-3">
                                <span className="mr-1.5 md:mr-2 text-base md:text-[1.15em]">🛠️</span>
                                <span className="font-bold text-[#aee1f9] mr-1">Équipe technique :</span>
                                <span className="flex flex-wrap gap-3">
                                    {credits.crew?.slice(0, 5).map((c) => (
                                        <Link key={c.id} to={`/person/${c.id}`} className="flex flex-col items-center gap-1 group">
                                            <img
                                                src={c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : require('../img/defaut.jpg')}
                                                alt={c.name}
                                                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-[#4ee1ff] cursor-pointer transition-transform group-hover:scale-110"
                                                title={`${c.name} (${c.job})`}
                                            />
                                            <span className="text-xs text-[#aee1f9] text-center max-w-[60px] leading-tight group-hover:text-white transition-colors">{c.name}</span>
                                            <span className="text-[10px] text-slate-400 text-center max-w-[60px] leading-tight">{c.job}</span>
                                        </Link>
                                    ))}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {/* Vidéo du film ou de la série */}
            {videos && videos.length > 0 && (
                <div className="my-6 md:my-8 text-center">
                    <h3 className="text-white mb-3 md:mb-4 text-lg md:text-xl">Bande-annonce</h3>
                    {(() => {
                        // On cherche une vidéo YouTube de type Trailer ou Teaser
                        const yt = videos.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
                            || videos.find(v => v.site === 'YouTube');
                        return yt ? (
                            <div className="flex justify-center px-2">
                                <iframe
                                    width="100%"
                                    height="200"
                                    src={`https://www.youtube.com/embed/${yt.key}`}
                                    title={yt.name}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-xl shadow-[0_4px_24px_#0004] max-w-full md:h-[315px] md:w-[560px]"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="text-[#aee1f9] text-base md:text-lg">Aucune vidéo disponible</div>
                        );
                    })()}
                </div>
            )}
            <div className="mt-6 md:mt-9">
                <div className="w-full flex justify-center items-center mb-6 md:mb-10">
                    <h3 className="bg-slate-800/95 inline-block py-1.5 px-4 md:py-2 md:px-[22px] rounded-xl font-bold text-[#aee1f9] text-base md:text-lg lg:text-xl m-0 z-[2] text-center">
                        Vous aimerez peut-être :
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 md:flex md:gap-6 lg:gap-10 md:flex-wrap justify-center px-2">
                    {similar.map((item, index) => (
                        <div key={item.id} className={`w-full md:w-[140px] lg:w-[150px] ${index === 5 ? 'md:hidden' : ''}`}>
                            <MovieCard movie={item} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Section avis et commentaires */}
            <section
                className="comment-section"
                style={{
                    margin: "48px 0 0 0",
                    padding: 24,
                    background: "#1a2636",
                    borderRadius: 12,
                    border: "2.5px solid #4ee1ff",
                    boxShadow: "0 0 16px 4px #4ee1ff, 0 0 32px 8px #1a2636 inset",
                    outline: "none",
                    transition: "box-shadow 0.2s, border 0.2s"
                }}
            >
                <h3 style={{ marginBottom: 16 }}>Avis et commentaires</h3>

                {/* Formulaire pour ajouter un commentaire */}
                {user ? (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!user) {
                            return;
                        }
                        const formData = new FormData(e.target);
                        const comment = formData.get('comment');
                        if (selectedRating === 0) {
                            alert("Veuillez donner une note.");
                            return;
                        }
                        handleAddComment({ comment, rating: selectedRating, user: user.username });
                        e.target.reset();
                        setSelectedRating(0);
                    }} style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 8, display: "flex", gap: 4 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    style={{
                                        color: star <= (hoverRating || selectedRating) ? "#4ee1ff" : "#233a4d",
                                        textShadow: star <= (hoverRating || selectedRating) ? "0 0 8px #4ee1ff, 0 0 2px #fff" : "none",
                                        fontSize: 24,
                                        cursor: "pointer",
                                        transition: 'color 0.18s, text-shadow 0.18s',
                                    }}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setSelectedRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            name="comment"
                            rows={3}
                            placeholder="Votre commentaire (optionnel)..."
                            style={{
                                width: "100%",
                                minWidth: 0,
                                borderRadius: 8,
                                padding: 12,
                                fontSize: 16,
                                background: '#22304a',
                                color: '#fff',
                                border: '1.5px solid #4ee1ff',
                                boxSizing: 'border-box',
                                boxShadow: '0 0 8px #4ee1ff44',
                                outline: 'none',
                                marginBottom: 8,
                                resize: 'vertical',
                                transition: 'border 0.2s, box-shadow 0.2s'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                maxWidth: 220,
                                margin: '12px auto 0 auto',
                                display: 'block',
                                borderRadius: '12px',
                                padding: '10px 24px',
                                fontSize: '16px',
                                fontWeight: '600',
                                background: '#06b6d4',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 0 0 rgba(6, 182, 212, 0)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#0e7490';
                                e.target.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = '#06b6d4';
                                e.target.style.boxShadow = '0 0 0 rgba(6, 182, 212, 0)';
                            }}
                        >
                            Publier
                        </button>
                    </form>
                ) : (
                    <div style={{ color: '#aee1f9', marginBottom: 24, textAlign: 'center', fontSize: 17 }}>
                        Connectez-vous pour publier un commentaire.
                    </div>
                )}

                {/* Liste des avis API et commentaires utilisateurs */}
                <div>
                    {(() => {
                        const allComments = [];

                        // Ajouter les avis de l'API TMDB
                        if (reviews && reviews.length > 0) {
                            reviews.slice(0, 5).forEach(review => {
                                allComments.push({
                                    type: 'api',
                                    id: review.id,
                                    author: review.author,
                                    avatar: review.author_details?.avatar_path,
                                    rating: review.author_details?.rating ? Math.round(review.author_details.rating / 2) : null,
                                    content: review.content,
                                    date: new Date(review.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }),
                                    time: new Date(review.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                });
                            });
                        }

                        // Ajouter les commentaires utilisateurs
                        userComments.forEach((c, idx) => {
                            allComments.push({
                                type: 'user',
                                index: idx,
                                author: c.user,
                                rating: c.rating,
                                content: c.comment,
                                date: c.date,
                                time: c.time,
                                canEdit: user && c.user === user.username
                            });
                        });

                        if (allComments.length === 0) {
                            return <div style={{ color: "#aaa" }}>Aucun commentaire pour l'instant.</div>;
                        }

                        return allComments.map((comment, idx) => (
                            <div key={`${comment.type}-${comment.id || comment.index}`} style={{
                                marginBottom: 18,
                                padding: 18,
                                background: "#22304a",
                                borderRadius: 10,
                                width: '100%',
                                boxSizing: 'border-box',
                                boxShadow: '0 0 8px #4ee1ff22',
                                textAlign: 'left',
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    {comment.type === 'api' && comment.avatar && (
                                        <img
                                            src={comment.avatar.startsWith('/https')
                                                ? comment.avatar.substring(1)
                                                : `https://image.tmdb.org/t/p/w185${comment.avatar}`}
                                            alt={comment.author}
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '2px solid #4ee1ff'
                                            }}
                                        />
                                    )}
                                    <span style={{ fontWeight: 600, fontSize: 18 }}>{comment.author}</span>
                                    {comment.rating && (
                                        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    style={{
                                                        color: star <= comment.rating ? "#4ee1ff" : "#233a4d",
                                                        textShadow: star <= comment.rating ? "0 0 8px #4ee1ff, 0 0 2px #fff" : "none",
                                                        fontSize: 24,
                                                    }}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: 13, color: '#aee1f9', marginBottom: 6, marginLeft: 2 }}>
                                    {comment.date} à {comment.time}
                                </div>
                                <div style={{ marginTop: 6 }}>
                                    {comment.type === 'api' && comment.content.length > 500
                                        ? comment.content.substring(0, 500) + '...'
                                        : comment.content}
                                </div>
                                {comment.type === 'user' && comment.canEdit && (
                                    <div style={{ marginTop: 8 }}>
                                        <button
                                            style={{
                                                maxWidth: 100,
                                                padding: '8px 16px',
                                                fontSize: 14,
                                                borderRadius: '12px',
                                                background: '#dc2626',
                                                color: '#fff',
                                                display: 'inline-block',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 0 0 rgba(220, 38, 38, 0)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = '#991b1b';
                                                e.target.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = '#dc2626';
                                                e.target.style.boxShadow = '0 0 0 rgba(220, 38, 38, 0)';
                                            }}
                                            onClick={() => handleDeleteComment(comment.index)}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                            </div>
                        ));
                    })()}
                </div>
            </section>
        </div>
    );
};

export default Details;
