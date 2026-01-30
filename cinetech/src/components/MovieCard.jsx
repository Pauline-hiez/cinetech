

import React, { useState, useEffect } from 'react';
import '../App.tailwind.css';
import FavoriteButton from './FavoriteButton';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function getMediaType(movie) {
    return movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
}

function MovieCard({ movie }) {
    // Utilisation du localStorage pour stocker les favoris
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
        setIsFavorite(favoris.some((fav) => fav.id === movie.id));
    }, [movie.id]);

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        // Vérifie si l'utilisateur est connecté (clé 'user' dans localStorage)
        const user = localStorage.getItem('user');
        if (!user) {
            alert('Vous devez être connecté pour ajouter ou retirer un favori.');
            return;
        }
        let favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
        if (isFavorite) {
            favoris = favoris.filter((fav) => fav.id !== movie.id);
        } else {
            favoris.push(movie);
        }
        localStorage.setItem('favoris', JSON.stringify(favoris));
        setIsFavorite(!isFavorite);
    };

    return (
        <div className="movie-card relative flex flex-col items-center w-full h-full overflow-visible">
            <div className="movie-card-img-container relative w-full h-full flex items-center justify-center">
                <Link to={`/${getMediaType(movie)}/${movie.id}`} className="no-underline block w-full h-full">
                    <img
                        className="movie-card-img w-full h-full rounded-xl object-cover block cursor-pointer border-[2.5px] border-[#4ee1ff] shadow-[0_0_12px_#4ee1ff99]"
                        src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : require('../img/defaut.jpg')}
                        alt={movie.title || movie.name || movie.original_name || 'Titre inconnu'}
                        title={`${getMediaType(movie) === 'movie' ? 'Film' : 'Série'}\n${movie.title || movie.name || movie.original_name || 'Titre inconnu'}`}
                        onError={e => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/260x390?text=Image+indisponible';
                        }}
                    />
                </Link>
                <div className="absolute top-2 right-2 z-[2]">
                    <FavoriteButton isFavorite={isFavorite} onClick={handleFavoriteClick} />
                </div>
                <div className="movie-card-info absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800/92 text-white opacity-0 flex flex-col items-center justify-center px-[18px] py-4 text-center pointer-events-none rounded-xl z-[2] w-max max-w-[90%] min-w-[120px] shadow-[0_4px_16px_rgba(30,41,59,0.18)]">
                    <div className="text-xs text-[#aee1f9] font-bold mb-0.5">
                        {getMediaType(movie) === 'movie' ? 'Film' : 'Série'}
                    </div>
                    <h3 className="text-xl font-bold m-0 mb-2">{movie.title || movie.name || movie.original_name || 'Titre inconnu'}</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-300">{(movie.release_date || movie.first_air_date) ? (movie.release_date || movie.first_air_date).slice(0, 4) : 'N/A'}</span>
                    </div>
                    <div className="text-[15px] text-amber-300 mt-0">⭐ {movie.vote_average}</div>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;


