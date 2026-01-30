import React, { useEffect, useState } from "react";
import CommentSection from "../components/CommentSection";
import FavoriteButton from "../components/FavoriteButton";
import MovieCard from "../components/MovieCard";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, getSimilarMovies, getMovieCredits, getMovieReviews } from "../services/tmdb";
import { getMovieVideos } from "../services/tmdb";
import "../App.tailwind.css";

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
    // On ne considère l'utilisateur connecté que si 'user' existe dans le localStorage
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    // Ajout d'un commentaire
    const handleAddComment = ({ comment, rating, user: userName }) => {
        if (!user) return; // Sécurité : ne rien faire si non connecté
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

    // Suppression d'un commentaire (par index)
    const handleDeleteComment = (idx) => {
        if (!user) return;
        setUserComments(prev => {
            // Ne supprimer que si l'utilisateur est propriétaire
            if (prev[idx]?.user !== user.username) return prev;
            const newComments = prev.filter((_, i) => i !== idx);
            try {
                localStorage.setItem(commentsKey, JSON.stringify(newComments));
            } catch { }
            return newComments;
        });
    };

    // Modification d'un commentaire (par index)
    const handleEditComment = (idx, updatedComment) => {
        if (!user) return;
        setUserComments(prev => {
            // Ne modifier que si l'utilisateur est propriétaire
            if (prev[idx]?.user !== user.username) return prev;
            const newComments = prev.map((c, i) => i === idx ? { ...c, ...updatedComment } : c);
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
                <div className="w-[180px] h-[270px] md:w-[220px] md:h-[330px] lg:w-[260px] lg:h-[400px] bg-gray-900 rounded-2xl flex items-center justify-center text-2xl text-[#aee1f9] shadow-[0_6px_32px_#000b] text-center mb-2 shrink-0">
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
                            <span className="bg-slate-800 text-[#aee1f9] rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base lg:text-[1.08rem] font-medium flex items-center mb-1 md:mb-1.5 shadow-[0_2px_8px_rgba(30,41,59,0.18)] flex-wrap">
                                <span className="mr-1.5 md:mr-2 text-base md:text-[1.15em]">⭐</span>
                                <span className="font-bold text-[#aee1f9] mr-1">Acteurs :</span>
                                <span className="flex flex-wrap gap-1">
                                    {credits.cast?.slice(0, 3).map((a, i, arr) => (
                                        <React.Fragment key={a.id}>
                                            <Link to={`/person/${a.id}`} className="text-[#aee1f9] underline cursor-pointer">{a.name}</Link>{i < arr.length - 1 ? ', ' : ''}
                                        </React.Fragment>
                                    ))}
                                </span>
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-4 lg:gap-6">
                            <span className="bg-slate-800 text-[#aee1f9] rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base lg:text-[1.08rem] font-medium flex items-center mb-1 md:mb-1.5 shadow-[0_2px_8px_rgba(30,41,59,0.18)] flex-wrap">
                                <span className="mr-1.5 md:mr-2 text-base md:text-[1.15em]">🛠️</span>
                                <span className="font-bold text-[#aee1f9] mr-1">Équipe technique :</span>
                                <span className="flex flex-wrap gap-1">
                                    {credits.crew?.slice(0, 2).map((c, i, arr) => (
                                        <React.Fragment key={c.id}>
                                            <Link to={`/person/${c.id}`} className="text-[#aee1f9] underline cursor-pointer">{c.name}</Link> ({c.job}){i < arr.length - 1 ? ', ' : ''}
                                        </React.Fragment>
                                    ))}
                                </span>
                            </span>
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
                <div className="flex gap-4 md:gap-6 lg:gap-10 flex-wrap justify-center">
                    {similar.map((item) => (
                        <div key={item.id} className="w-[140px] md:w-[160px] lg:w-[180px]">
                            <MovieCard movie={item} />
                        </div>
                    ))}
                </div>
            </div>
            {/* Section avis et commentaires */}
            <CommentSection
                comments={userComments}
                onSubmit={handleAddComment}
                onDelete={handleDeleteComment}
                onEdit={handleEditComment}
                user={user}
            />
        </div>
    );
};

export default Details;
