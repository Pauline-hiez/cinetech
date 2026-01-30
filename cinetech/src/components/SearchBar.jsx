import { useState, useRef, useEffect } from "react";
import { FilterIcon } from "./FilterIcon";
import { searchMoviesAndSeries } from "../services/tmdb";

const SearchBar = ({ onSelectMovie, onSearch, onToggleFilters, onSuggestionsChange }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const debounceTimeout = useRef(null);

    // Notifier le parent des changements de suggestions
    useEffect(() => {
        if (onSuggestionsChange) {
            onSuggestionsChange({ suggestions, showSuggestions, query });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [suggestions, showSuggestions, query]);

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
                console.error('Erreur recherche:', err);
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

    return (
        <form onSubmit={handleSubmit} className="relative w-[200px] sm:w-[280px] md:w-[320px] lg:w-[380px]" autoComplete="off">
            <div className="relative flex items-center bg-white rounded-full">
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Rechercher..."
                    className="flex-1 p-2 md:p-2.5 pl-4 pr-20 md:pr-24 text-sm md:text-base border-none outline-none bg-transparent text-gray-900"
                    ref={inputRef}
                    aria-autocomplete="list"
                    aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
                />
                <div className="absolute right-2 flex items-center gap-1 z-10">
                    <button type="submit" className="bg-transparent border-none p-1.5 cursor-pointer flex items-center justify-center hover:opacity-70 transition-opacity" aria-label="Rechercher">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="#1f2937">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" />
                        </svg>
                    </button>
                    {onToggleFilters && (
                        <button type="button" aria-label="Filtres de recherche" onClick={(e) => { e.preventDefault(); onToggleFilters(); }} className="bg-transparent border-none cursor-pointer p-1.5 flex items-center justify-center hover:opacity-70 transition-opacity">
                            <FilterIcon size={20} color="#2563eb" />
                        </button>
                    )}
                </div>
            </div>
            {loading && <div className="ml-2">Chargement...</div>}
        </form>
    );
};

export default SearchBar;
