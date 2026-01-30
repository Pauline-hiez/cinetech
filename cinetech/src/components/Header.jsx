/**
 * Composant Header (En-tête du site)
 * Barre de navigation principale avec logo, liens, barre de recherche et filtres
 * Gère l'authentification, les favoris et la recherche avec suggestions
 */

import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import homeIcon from "../img/home.png";
import cinemaIcon from "../img/cinema.png";
import seriesIcon from "../img/series.png";
import userIcon from "../img/login.png";
import favorisIcon from "../img/favoris.png";
import logoutIcon from "../img/logout.png";
import SearchBar from "./SearchBar";
import { FilterIcon } from "./FilterIcon";
import SearchFilters from "./SearchFilters";
export default function Header() {
    // États pour gérer l'interface du header
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Statut de connexion
    const [showFilters, setShowFilters] = useState(false); // Affichage du panneau de filtres
    const [searchSuggestions, setSearchSuggestions] = useState({ suggestions: [], showSuggestions: false, query: '' }); // Suggestions de recherche
    const navigate = useNavigate();

    /**
     * Gestion de la recherche globale
     * @param {string} query - Terme recherché
     */
    const handleSearch = (query) => {
        if (query && query.length > 1) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    // Callback pour recevoir les suggestions de SearchBar
    const handleSuggestionsChange = useCallback((suggestionsData) => {
        setSearchSuggestions(suggestionsData);
    }, []);

    // Sélection d'un film depuis les suggestions
    const handleSelectMovie = useCallback((movie) => {
        const type = movie.media_type === 'tv' || movie.first_air_date ? 'tv' : 'movie';
        navigate(`/details/${type}/${movie.id}`);
        setSearchSuggestions({ suggestions: [], showSuggestions: false, query: '' });
    }, [navigate]);

    // Gestion de la recherche par filtres
    const handleFilterSearch = (filters) => {
        // Si tous les filtres sont vides, afficher tous les films
        if (!filters.type && !filters.year && !filters.genre && !filters.country) {
            navigate('/movies');
            return;
        }
        // Construction de l'URL avec les filtres sélectionnés
        const params = new URLSearchParams();
        if (filters.type) params.append('type', filters.type);
        if (filters.year) params.append('year', filters.year);
        if (filters.genre) params.append('genre', filters.genre);
        if (filters.country) params.append('country', filters.country);
        navigate(`/search?${params.toString()}`);
    };

    useEffect(() => {
        const checkLogin = () => {
            const user = localStorage.getItem("user");
            setIsLoggedIn(!!user);
        };
        checkLogin();
        window.addEventListener("storage", checkLogin);
        return () => window.removeEventListener("storage", checkLogin);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("pseudo"); // Supprime aussi le pseudo
        setIsLoggedIn(false);
        window.dispatchEvent(new Event("storage"));
        navigate("/login");
    };

    return (
        <>
            {/* Logo blur background - hidden on mobile */}
            <div className="hidden md:block fixed top-[18px] left-9 w-[120px] h-[120px] lg:w-[170px] lg:h-[170px] z-[199] pointer-events-none rounded-full bg-slate-800/30 backdrop-blur-[40px] border-[2.5px] border-[#4ee1ff] shadow-[0_0_12px_#4ee1ff99]" />
            {/* Logo - smaller on mobile */}
            <Link to="/" className="hidden md:block fixed top-[28px] md:top-[36px] left-4 md:left-[52px] lg:left-[62px] z-[201]">
                <img
                    src={logo}
                    alt="Accueil"
                    className="w-[90px] h-[90px] md:w-[100px] md:h-[100px] lg:w-[130px] lg:h-[130px] pointer-events-auto cursor-pointer object-contain"
                />
            </Link>
            <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between md:justify-end bg-gradient-to-t from-[#020617] to-[#1f2937] text-white px-3 md:px-5 py-2 rounded-b-[18px] shadow-[0_8px_32px_0_rgba(30,41,59,0.25),0_1.5px_8px_0_rgba(0,0,0,0.12)] min-h-[60px] md:min-h-[70px]">
                {/* Mobile logo */}
                <Link to="/" className="md:hidden flex items-center">
                    <img src={logo} alt="Logo" className="w-12 h-12" />
                </Link>

                {/* Navigation - horizontal scroll on mobile */}
                <div className="flex items-center gap-2 md:gap-4 lg:gap-8 justify-end flex-1 md:w-full overflow-x-auto scrollbar-hide">
                    <Link to="/" className="flex items-center no-underline text-[#aee1f9] gap-1 md:gap-2 shrink-0 hover:text-white transition-colors">
                        <img src={homeIcon} alt="Home" className="w-8 h-8 md:w-10 lg:w-12 md:h-10 lg:h-12 block" />
                        <span className="text-sm md:text-base lg:text-lg font-bold tracking-wide hidden sm:inline">Accueil</span>
                    </Link>
                    <Link to="/movies" className="flex items-center no-underline text-[#aee1f9] gap-1 md:gap-2 shrink-0 hover:text-white transition-colors">
                        <img src={cinemaIcon} alt="Films" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                        <span className="text-sm md:text-base lg:text-lg font-bold tracking-wide hidden sm:inline">Films</span>
                    </Link>
                    <Link to="/series" className="flex items-center no-underline text-[#aee1f9] gap-1 md:gap-2 shrink-0 hover:text-white transition-colors">
                        <img src={seriesIcon} alt="Séries" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                        <span className="text-sm md:text-base lg:text-lg font-bold tracking-wide hidden sm:inline">Séries</span>
                    </Link>
                    {isLoggedIn ? (
                        <Link to="/favoris" className="inline-flex items-center no-underline text-[#aee1f9] gap-1 md:gap-2 min-w-0 shrink-0 hover:text-white transition-colors">
                            <img src={favorisIcon} alt="Favoris" className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                            <span className="text-sm md:text-base lg:text-lg font-bold tracking-wide whitespace-nowrap hidden lg:inline">Mes favoris</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="inline-flex items-center no-underline text-[#aee1f9] gap-1 md:gap-2 min-w-0 shrink-0 hover:text-white transition-colors">
                            <img src={userIcon} alt="Login" className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                            <span className="text-sm md:text-base lg:text-lg font-bold tracking-wide whitespace-nowrap hidden lg:inline">Connexion</span>
                        </Link>
                    )}
                    <div className="flex items-center gap-2 md:gap-3 md:ml-8 shrink-0">
                        <SearchBar
                            onSearch={handleSearch}
                            onToggleFilters={() => { setShowFilters(f => !f); }}
                            onSuggestionsChange={handleSuggestionsChange}
                            onSelectMovie={handleSelectMovie}
                        />
                    </div>
                </div>
                {/* Bouton de déconnexion flottant */}
                {isLoggedIn && (
                    <button onClick={handleLogout} className="fixed right-4 md:right-8 bottom-4 md:bottom-8 bg-gray-900 text-white border-none rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-[0_4px_24px_#000a] cursor-pointer z-[9999] transition-all duration-200 hover:bg-gray-800 hover:shadow-[0_0_32px_#11182799] hover:scale-110" title="Déconnexion">
                        <img src={logoutIcon} alt="Déconnexion" className="w-8 h-8 md:w-11 md:h-11" />
                    </button>
                )}
            </header>
            {/* Panneau de filtres - positionné en dehors du header pour éviter l'overflow */}
            <div className="fixed top-[70px] md:top-[80px] right-4 md:right-8 z-[300] box-border w-[200px] sm:w-[280px] md:w-[320px] lg:w-[380px]">
                <SearchFilters visible={showFilters} onChange={handleFilterSearch} />
            </div>
            {/* Dropdown de suggestions - positionné en dehors du header */}
            {searchSuggestions.showSuggestions && searchSuggestions.suggestions.length > 0 && (
                <div className="fixed top-[70px] md:top-[80px] right-4 md:right-8 z-[400] w-[200px] sm:w-[280px] md:w-[320px] lg:w-[380px]">
                    <ul className="bg-white border border-gray-300 rounded-xl list-none m-0 p-0 max-h-80 overflow-y-auto shadow-lg">
                        {(() => {
                            const startsWith = [];
                            const includes = [];
                            searchSuggestions.suggestions.forEach(movie => {
                                const title = movie.title || movie.name || "";
                                if (title.toLowerCase().startsWith(searchSuggestions.query.toLowerCase())) {
                                    startsWith.push(movie);
                                } else if (title.toLowerCase().includes(searchSuggestions.query.toLowerCase())) {
                                    includes.push(movie);
                                }
                            });
                            return (
                                <>
                                    {startsWith.length > 0 && (
                                        <>
                                            {startsWith.map((movie) => (
                                                <li
                                                    key={movie.id}
                                                    onClick={() => handleSelectMovie(movie)}
                                                    className="flex items-center gap-2 p-2 cursor-pointer font-bold hover:bg-emerald-50"
                                                >
                                                    {movie.poster_path && (
                                                        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title || movie.name} className="w-8 h-8 object-cover rounded" />
                                                    )}
                                                    <span className="flex flex-col">
                                                        <span className="text-[11px] text-[#aee1f9] font-bold leading-none">{movie.media_type === 'movie' || movie.first_air_date === undefined ? 'Film' : 'Série'}</span>
                                                        <span className="text-gray-900">{movie.title || movie.name}</span>
                                                    </span>
                                                </li>
                                            ))}
                                        </>
                                    )}
                                    {startsWith.length > 0 && includes.length > 0 && (
                                        <li className="border-t border-gray-200 py-1 px-2 text-gray-500 text-[13px] bg-gray-50">
                                            Autres résultats
                                        </li>
                                    )}
                                    {includes.length > 0 && (
                                        <>
                                            {includes.map((movie) => (
                                                <li
                                                    key={movie.id}
                                                    onClick={() => handleSelectMovie(movie)}
                                                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-emerald-50"
                                                >
                                                    {movie.poster_path && (
                                                        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title || movie.name} className="w-8 h-8 object-cover rounded" />
                                                    )}
                                                    <span className="flex flex-col">
                                                        <span className="text-[11px] text-[#aee1f9] font-bold leading-none">{movie.media_type === 'movie' || movie.first_air_date === undefined ? 'Film' : 'Série'}</span>
                                                        <span className="text-gray-900">{movie.title || movie.name}</span>
                                                    </span>
                                                </li>
                                            ))}
                                        </>
                                    )}
                                </>
                            );
                        })()}
                    </ul>
                </div>
            )}
        </>
    );
}
