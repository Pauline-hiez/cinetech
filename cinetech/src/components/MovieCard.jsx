

import React from 'react';
import './MovieCard.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function MovieCard({ movie }) {
    return (
        <div className="movie-card">
            <div className="movie-card-img-container">
                <img
                    className="movie-card-img"
                    src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/img/no-image.png'}
                    alt={movie.title}
                />
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

