

import React, { useState, useEffect } from 'react';
import './MovieCard.css';

import FavoriteButton from './FavoriteButton';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


function MovieCard({ movie }) {
    // Utilisation du localStorage pour stocker les favoris
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
        setIsFavorite(favoris.some((fav) => fav.id === movie.id));
    }, [movie.id]);

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
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
        <div className="movie-card">
            <div className="movie-card-img-container">
                <img
                    className="movie-card-img"
                    src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/img/no-image.png'}
                    alt={movie.title}
                />
                <FavoriteButton isFavorite={isFavorite} onClick={handleFavoriteClick} />
                <div className="movie-card-info">
                    <h3>{movie.title}</h3>
                    <div className="movie-card-year">{movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'}</div>
                    <div className="movie-card-vote">⭐ {movie.vote_average}</div>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;

