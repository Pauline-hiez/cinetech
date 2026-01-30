

import React, { useEffect, useState } from "react";
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    // Gestion de la recherche globale
    const handleSearch = (query) => {
        if (query && query.length > 1) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

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
            <div className="hidden md:block fixed top-[18px] left-9 w-[120px] h-[120px] lg:w-[190px] lg:h-[190px] z-[199] pointer-events-none rounded-full bg-slate-800/30 backdrop-blur-[40px] border-[2.5px] border-[#4ee1ff] shadow-[0_0_12px_#4ee1ff99]" />
            {/* Logo - smaller on mobile */}
            <Link to="/" className="hidden md:block fixed top-[28px] md:top-[38px] left-4 md:left-8 z-[201]">
                <img
                    src={logo}
                    alt="Accueil"
                    className="w-[90px] h-[90px] md:w-[100px] md:h-[100px] lg:w-[150px] lg:h-[150px] pointer-events-auto cursor-pointer object-contain"
                />
            </Link>
            <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between md:justify-end bg-gradient-to-t from-[#020617] to-[#1f2937] text-white px-3 md:px-5 py-2 rounded-b-[18px] shadow-[0_8px_32px_0_rgba(30,41,59,0.25),0_1.5px_8px_0_rgba(0,0,0,0.12)] min-h-[60px] md:min-h-[70px]">
                {/* Mobile logo */}
                <Link to="/" className="md:hidden flex items-center">
                    <img src={logo} alt="Logo" className="w-12 h-12" />
                </Link>

                {/* Navigation - horizontal scroll on mobile */}
                <div className="flex items-center gap-2 md:gap-4 lg:gap-8 justify-end flex-1 md:w-full overflow-x-auto scrollbar-hide">
                    <Link to="/" className="flex items-center no-underline text-inherit gap-1 md:gap-2 shrink-0">
                        <img src={homeIcon} alt="Home" className="w-8 h-8 md:w-12 lg:w-[70px] md:h-12 lg:h-auto block" />
                        <span className="text-sm md:text-xl lg:text-[2.2rem] font-bold tracking-wide hidden sm:inline">Accueil</span>
                    </Link>
                    <Link to="/movies" className="flex items-center no-underline text-inherit gap-1 md:gap-2 shrink-0">
                        <img src={cinemaIcon} alt="Films" className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14" />
                        <span className="text-sm md:text-xl lg:text-[2.2rem] font-bold tracking-wide hidden sm:inline">Films</span>
                    </Link>
                    <Link to="/series" className="flex items-center no-underline text-inherit gap-1 md:gap-2 shrink-0">
                        <img src={seriesIcon} alt="Séries" className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14" />
                        <span className="text-sm md:text-xl lg:text-[2.2rem] font-bold tracking-wide hidden sm:inline">Séries</span>
                    </Link>
                    {isLoggedIn ? (
                        <Link to="/favoris" className="inline-flex items-center no-underline text-inherit gap-1 md:gap-3 min-w-0 shrink-0">
                            <img src={favorisIcon} alt="Favoris" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                            <span className="text-sm md:text-xl lg:text-[2.2rem] font-bold tracking-wide whitespace-nowrap hidden lg:inline">Mes favoris</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="inline-flex items-center no-underline text-inherit gap-1 md:gap-3 min-w-0 shrink-0">
                            <img src={userIcon} alt="Login" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                            <span className="text-sm md:text-xl lg:text-[2.2rem] font-bold tracking-wide whitespace-nowrap hidden lg:inline">Connexion</span>
                        </Link>
                    )}
                    <div className="flex items-center gap-2 md:gap-3 relative md:ml-8 shrink-0">
                        <SearchBar onSearch={handleSearch} onToggleFilters={() => setShowFilters(f => !f)} />
                        <div className="absolute top-14 left-0 md:left-auto md:right-0 w-[90vw] md:w-full min-w-0 max-w-[340px] z-[200] box-border">
                            <SearchFilters visible={showFilters} onChange={handleFilterSearch} />
                        </div>
                    </div>
                </div>
                {/* Bouton de déconnexion flottant */}
                {isLoggedIn && (
                    <button onClick={handleLogout} className="fixed right-4 md:right-8 bottom-4 md:bottom-8 bg-gray-900 text-white border-none rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-[0_4px_24px_#000a] cursor-pointer z-[9999] transition-all duration-200 hover:bg-gray-800 hover:shadow-[0_0_32px_#11182799] hover:scale-110" title="Déconnexion">
                        <img src={logoutIcon} alt="Déconnexion" className="w-8 h-8 md:w-11 md:h-11" />
                    </button>
                )}
            </header>
        </>
    );
}
