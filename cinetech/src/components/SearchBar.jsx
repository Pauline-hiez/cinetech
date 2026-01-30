import React, { useState, useRef, useEffect } from "react";
import { FilterIcon } from "./FilterIcon";
import { searchMoviesAndSeries } from "../services/tmdb";

const SearchBar = ({ onSelectMovie, onSearch, onToggleFilters }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const debounceTimeout = useRef(null);

    // Gestion du clic en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounce et suggestions intelligentes
    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        if (query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            setLoading(false);
            return;
        }
        setLoading(true);
        debounceTimeout.current = setTimeout(async () => {
            try {
                const res = await searchMoviesAndSeries(query);
                const results = res.results || [];
                if (results.length > 0) {
                    // Séparation intelligente
                    const startsWith = [];
                    const includes = [];
                    results.forEach(movie => {
                        const title = movie.title || movie.name || "";
                        if (title.toLowerCase().startsWith(query.toLowerCase())) {
                            startsWith.push(movie);
                        } else if (title.toLowerCase().includes(query.toLowerCase())) {
                            includes.push(movie);
                        }
                    });
                    setSuggestions([
                        ...startsWith,
                        ...includes
                    ]);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            } catch (err) {
                setSuggestions([]);
                setShowSuggestions(false);
            }
            setLoading(false);
        }, 300);
        // eslint-disable-next-line
    }, [query]);

    const handleChange = (e) => {
        setQuery(e.target.value);
        setActiveIndex(-1);
        setShowSuggestions(true);
    };

    const handleSelect = (movie) => {
        setQuery(movie.title || movie.name || "");
        setSuggestions([]);
        setShowSuggestions(false);
        setActiveIndex(-1);
        if (onSelectMovie) onSelectMovie(movie);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        setActiveIndex(-1);
        if (onSearch) onSearch(query);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0 && activeIndex < suggestions.length) {
                e.preventDefault();
                handleSelect(suggestions[activeIndex]);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setActiveIndex(-1);
        }
    };

    // Séparation visuelle startsWith/includes
    let startsWith = [];
    let includes = [];
    if (suggestions.length > 0 && query.length >= 2) {
        suggestions.forEach(movie => {
            const title = movie.title || movie.name || "";
            if (title.toLowerCase().startsWith(query.toLowerCase())) {
                startsWith.push(movie);
            } else {
                includes.push(movie);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="relative w-[200px] sm:w-[280px] md:w-[320px] lg:w-[340px] flex items-center gap-2" autoComplete="off">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Rechercher..."
                className="flex-1 p-1.5 md:p-2 rounded-md text-sm md:text-base"
                ref={inputRef}
                aria-autocomplete="list"
                aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
            />
            <button type="submit" className="bg-none border-none p-0" aria-label="Rechercher">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" stroke="currentColor" />
                </svg>
            </button>
            {onToggleFilters && (
                <button type="button" aria-label="Filtres de recherche" onClick={onToggleFilters} className="bg-none border-none cursor-pointer ml-0 flex items-center justify-center p-1">
                    <FilterIcon size={24} className="md:hidden" />
                    <FilterIcon size={28} className="hidden md:block" />
                </button>
            )}
            {loading && <div className="ml-2">Chargement...</div>}
            {showSuggestions && (startsWith.length > 0 || includes.length > 0) && (
                <ul
                    ref={suggestionsRef}
                    className="absolute top-9 left-0 right-0 bg-white border border-gray-300 list-none m-0 p-0 z-10 max-h-80 overflow-y-auto"
                >
                    {startsWith.length > 0 && (
                        <>
                            {startsWith.map((movie, idx) => (
                                <li
                                    key={movie.id}
                                    id={`suggestion-${idx}`}
                                    onClick={() => handleSelect(movie)}
                                    className={`flex items-center gap-2 p-2 cursor-pointer font-bold ${activeIndex === idx ? 'bg-emerald-50' : 'bg-white'}`}
                                >
                                    {movie.poster_path && (
                                        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title || movie.name} className="w-8 h-8 object-cover rounded" title={`${movie.media_type === 'movie' || movie.first_air_date === undefined ? 'Film' : 'Série'}\n${movie.title || movie.name}`} />
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
                            {includes.map((movie, idx) => (
                                <li
                                    key={movie.id}
                                    id={`suggestion-${startsWith.length + idx}`}
                                    onClick={() => handleSelect(movie)}
                                    className={`flex items-center gap-2 p-2 cursor-pointer ${activeIndex === (startsWith.length + idx) ? 'bg-emerald-50' : 'bg-white'}`}
                                >
                                    {movie.poster_path && (
                                        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title || movie.name} className="w-8 h-8 object-cover rounded" title={`${movie.media_type === 'movie' || movie.first_air_date === undefined ? 'Film' : 'Série'}\n${movie.title || movie.name}`} />
                                    )}
                                    <span className="flex flex-col">
                                        <span className="text-[11px] text-[#aee1f9] font-bold leading-none">{movie.media_type === 'movie' || movie.first_air_date === undefined ? 'Film' : 'Série'}</span>
                                        <span>{movie.title || movie.name}</span>
                                    </span>
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            )}
        </form>
    );
};

export default SearchBar;
