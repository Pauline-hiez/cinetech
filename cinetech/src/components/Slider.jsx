
import { useEffect, useState, useRef } from "react";
import { fetchPopularMovies, fetchPopularSeries } from "../services/tmdb";
import FavoriteButton from "./FavoriteButton";
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function getCarouselStyle(idx, activeIdx, total) {
    let offset = idx - activeIdx;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    // Position horizontale en fonction de l'offset
    const spacing = 350; // Espacement entre les cartes
    const x = offset * spacing;

    // Effet de profondeur Z
    const z = Math.abs(offset) * -200;

    // Échelle selon la position
    let scale = 1;
    if (Math.abs(offset) === 0) {
        scale = 1.1; // Carte centrale plus grande
    } else if (Math.abs(offset) === 1) {
        scale = 0.85; // Cartes adjacentes
    } else if (Math.abs(offset) === 2) {
        scale = 0.7; // Cartes plus éloignées
    } else {
        scale = 0.5; // Cartes très éloignées
    }

    // Opacité selon la distance
    let opacity = 1;
    if (Math.abs(offset) === 0) {
        opacity = 1;
    } else if (Math.abs(offset) === 1) {
        opacity = 0.6;
    } else if (Math.abs(offset) === 2) {
        opacity = 0.3;
    } else {
        opacity = 0;
    }

    // Rotation Y pour effet de perspective
    const rotateY = offset * 15;

    // Flou pour les cartes non centrales
    const blur = Math.abs(offset) === 0 ? 0 : Math.abs(offset) * 2;

    return {
        transform: `translateX(${x}px) translateZ(${z}px) scale(${scale}) rotateY(${rotateY}deg)`,
        zIndex: 100 - Math.abs(offset),
        opacity: opacity,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto',
    };
}

const Slider = ({ type }) => {
    const [items, setItems] = useState([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const carouselRef = useRef();

    useEffect(() => {
        async function fetchData() {
            let data;
            if (type === "movie") {
                data = await fetchPopularMovies(1);
            } else {
                data = await fetchPopularSeries(1);
            }
            setItems(data.results.slice(0, 7));
            setActiveIdx(0);
        }
        fetchData();

        // Charger les favoris
        const savedFavorites = JSON.parse(localStorage.getItem('favoris') || '[]');
        setFavorites(savedFavorites);
    }, [type]);

    const goTo = (idx) => setActiveIdx(idx);
    const prev = () => setActiveIdx((prev) => (prev - 1 + items.length) % items.length);
    const next = () => setActiveIdx((prev) => (prev + 1) % items.length);

    const handleFavoriteClick = (e, item) => {
        e.stopPropagation();
        const user = localStorage.getItem('user');
        if (!user) {
            alert('Vous devez être connecté pour ajouter ou retirer un favori.');
            return;
        }
        let favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
        const isFavorite = favoris.some((fav) => fav.id === item.id);
        if (isFavorite) {
            favoris = favoris.filter((fav) => fav.id !== item.id);
        } else {
            favoris.push(item);
        }
        localStorage.setItem('favoris', JSON.stringify(favoris));
        setFavorites(favoris);
    };

    const activeItem = items[activeIdx];

    return (
        <div className="relative w-full min-h-[500px] overflow-hidden border-[2.5px] border-[#4ee1ff] shadow-[0_0_12px_#4ee1ff99]"
            style={{
                background: 'linear-gradient(135deg, #0a1628 0%, #0f2847 25%, #207196 50%, #0f2847 75%, #0a1628 100%)',
                padding: '3rem 2rem',
                borderRadius: '24px',
            }}>

            {/* Container avec perspective 3D */}
            <div className="relative w-full max-w-[1400px] mx-auto" style={{ perspective: '2000px' }}>

                {/* Conteneur du carousel */}
                <div
                    ref={carouselRef}
                    className="relative w-full h-[450px] flex items-center justify-center"
                    style={{
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {items.map((item, idx) => {
                        const offset = idx - activeIdx;
                        const styles = getCarouselStyle(idx, activeIdx, items.length);

                        return (
                            <div
                                key={item.id}
                                className="absolute movie-card"
                                style={{
                                    ...styles,
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                {/* Carte avec effet de verre et bordure lumineuse */}
                                <div
                                    className="relative w-[280px] h-[400px] rounded-3xl overflow-hidden border-[2.5px] border-[#4ee1ff] shadow-[0_0_12px_#4ee1ff99]"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: offset === 0
                                            ? '0 0 40px rgba(139, 79, 168, 0.6), 0 0 80px rgba(106, 61, 143, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1), 0 0 12px #4ee1ff99'
                                            : '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 12px #4ee1ff99',
                                    }}
                                >
                                    {/* Image de fond avec lien */}
                                    <Link to={`/${item.first_air_date ? 'tv' : 'movie'}/${item.id}`} className="no-underline absolute inset-0 z-[5]">
                                        <img
                                            src={item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/280x400?text=No+Image'}
                                            alt={item.title || item.name}
                                            className="w-full h-full object-cover"
                                            style={{
                                                filter: offset === 0 ? 'brightness(0.9)' : 'brightness(0.6)',
                                            }}
                                        />
                                    </Link>

                                    {/* Bouton favori */}
                                    <div className="absolute top-2 right-2 z-[15]">
                                        <FavoriteButton
                                            isFavorite={favorites.some((fav) => fav.id === item.id)}
                                            onClick={(e) => handleFavoriteClick(e, item)}
                                            size="small"
                                        />
                                    </div>

                                    {/* Overlay dégradé */}
                                    <div
                                        className="absolute inset-0 pointer-events-none z-[6]"
                                        style={{
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
                                        }}
                                    />

                                    {/* Informations du film */}
                                    <div className="movie-card-info absolute bottom-0 left-0 right-0 text-white opacity-0 flex flex-col items-center justify-center px-[18px] py-4 text-center pointer-events-none z-[7]">
                                        <div className="text-xs text-[#aee1f9] font-bold mb-0.5">
                                            {(item.first_air_date ? 'Série' : 'Film')}
                                        </div>
                                        <h3 className="text-xl font-bold m-0 mb-2">{item.title || item.name || item.original_name || 'Titre inconnu'}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-slate-300">{(item.release_date || item.first_air_date) ? (item.release_date || item.first_air_date).slice(0, 4) : 'N/A'}</span>
                                        </div>
                                        <div className="text-[15px] text-amber-300 mt-0">⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</div>
                                    </div>

                                    {/* Bordure lumineuse animée pour la carte active */}
                                    {offset === 0 && (
                                        <div
                                            className="absolute inset-0 rounded-3xl pointer-events-none"
                                            style={{
                                                border: '3px solid transparent',
                                                background: 'linear-gradient(135deg, rgba(139, 79, 168, 0.8), rgba(106, 61, 143, 0.6), rgba(74, 44, 109, 0.8)) border-box',
                                                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                                                WebkitMaskComposite: 'xor',
                                                maskComposite: 'exclude',
                                                animation: 'pulse 2s ease-in-out infinite',
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Boutons de navigation */}
                <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-[200] w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-300 hover:scale-110"
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}
                    aria-label="Précédent"
                >
                    ‹
                </button>

                <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-[200] w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-300 hover:scale-110"
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}
                    aria-label="Suivant"
                >
                    ›
                </button>

                {/* Indicateurs de pagination (dots) */}
                <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 flex gap-3 z-[200]">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goTo(idx)}
                            className="w-3 h-3 rounded-full transition-all duration-300"
                            style={{
                                background: idx === activeIdx
                                    ? 'rgba(255, 255, 255, 0.9)'
                                    : 'rgba(255, 255, 255, 0.3)',
                                boxShadow: idx === activeIdx
                                    ? '0 0 10px rgba(255, 255, 255, 0.8)'
                                    : 'none',
                                transform: idx === activeIdx ? 'scale(1.3)' : 'scale(1)',
                            }}
                            aria-label={`Aller à la slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Style pour l'animation de pulsation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.6;
                    }
                }
            `}</style>
        </div>
    );
};

export default Slider;
