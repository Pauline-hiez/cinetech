import React, { useState, useRef, useEffect } from "react";
import { searchMovies } from "../services/tmdb";

const SearchBar = ({ onSelectMovie, onSearch }) => {
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
                const results = await searchMovies(query);
                if (results && results.length > 0) {
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
                        ...startsWith.slice(0, 5),
                        ...includes.slice(0, 5)
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
        <form onSubmit={handleSubmit} style={{ position: 'relative', width: '340px', display: 'flex', alignItems: 'center', gap: '8px' }} autoComplete="off">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Rechercher un film..."
                style={{ flex: 1, padding: '8px', borderRadius: '6px' }}
                ref={inputRef}
                aria-autocomplete="list"
                aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
            />
            <button type="submit" className="main-btn" aria-label="Rechercher" style={{ background: 'none', border: 'none', padding: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'currentColor', width: 24, height: 24, display: 'block' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" stroke="currentColor" />
                </svg>
            </button>
            {loading && <div style={{ marginLeft: 8 }}>Chargement...</div>}
            {showSuggestions && (startsWith.length > 0 || includes.length > 0) && (
                <ul
                    ref={suggestionsRef}
                    style={{
                        position: 'absolute',
                        top: '36px',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid #ccc',
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        zIndex: 10,
                        maxHeight: 320,
                        overflowY: 'auto'
                    }}
                >
                    {startsWith.length > 0 && (
                        <>
                            {startsWith.map((movie, idx) => (
                                <li
                                    key={movie.id}
                                    id={`suggestion-${idx}`}
                                    onClick={() => handleSelect(movie)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '8px',
                                        cursor: 'pointer',
                                        background: activeIndex === idx ? '#e6f7ee' : 'white',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {movie.poster_path && (
                                        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title || movie.name} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                                    )}
                                    <span style={{ color: '#111' }}>{movie.title || movie.name}</span>
                                </li>
                            ))}
                        </>
                    )}
                    {startsWith.length > 0 && includes.length > 0 && (
                        <li style={{ borderTop: '1px solid #eee', padding: '4px 8px', color: '#888', fontSize: 13, background: '#fafafa' }}>
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
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '8px',
                                        cursor: 'pointer',
                                        background: activeIndex === (startsWith.length + idx) ? '#e6f7ee' : 'white'
                                    }}
                                >
                                    {movie.poster_path && (
                                        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title || movie.name} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                                    )}
                                    <span>{movie.title || movie.name}</span>
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
