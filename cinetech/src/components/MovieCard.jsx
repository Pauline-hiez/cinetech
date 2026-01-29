

import React, { useState, useEffect } from 'react';
import '../App.css';
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
        <div className="movie-card" style={{ position: 'relative' }}>
            <div className="movie-card-img-container">
                <Link to={`/${getMediaType(movie)}/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <img
                        className="movie-card-img"
                        src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : require('../img/defaut.jpg')}
                        alt={movie.title || movie.name || movie.original_name || 'Titre inconnu'}
                        title={`${getMediaType(movie) === 'movie' ? 'Film' : 'Série'}\n${movie.title || movie.name || movie.original_name || 'Titre inconnu'}`}
                        style={{
                            width: '100%',
                            height: 260,
                            objectFit: 'cover',
                            borderRadius: 12,
                            background: '#182033',
                            border: '2.5px solid #4ee1ff',
                            boxShadow: '0 0 12px #4ee1ff99',
                            display: 'block',
                        }}
                        onError={e => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/260x390?text=Image+indisponible';
                        }}
                    />
                </Link>
                <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
                    <FavoriteButton isFavorite={isFavorite} onClick={handleFavoriteClick} />
                </div>
                <div className="movie-card-info">
                    <div style={{ fontSize: 12, color: '#aee1f9', fontWeight: 700, marginBottom: 2 }}>
                        {getMediaType(movie) === 'movie' ? 'Film' : 'Série'}
                    </div>
                    <h3>{movie.title || movie.name || movie.original_name || 'Titre inconnu'}</h3>
                    <div className="movie-card-type-year" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="movie-card-year">{(movie.release_date || movie.first_air_date) ? (movie.release_date || movie.first_air_date).slice(0, 4) : 'N/A'}</span>
                    </div>
                    <div className="movie-card-vote">⭐ {movie.vote_average}</div>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;


