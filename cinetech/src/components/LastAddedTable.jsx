import React, { useEffect, useState } from "react";
import { fetchAllMovies, fetchAllSeries } from "../services/tmdb";
import { Link } from 'react-router-dom';

const LastAddedTable = () => {
    const [latestMovies, setLatestMovies] = useState([]);
    const [latestSeries, setLatestSeries] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const movies = await fetchAllMovies(1);
            setLatestMovies(movies.results.slice(0, 8));
            const series = await fetchAllSeries(1);
            setLatestSeries(series.results.slice(0, 8));
        }
        fetchData();
    }, []);

    return (
        <div className="last-added-table-row">
            <div className="last-added-table-col">
                <div className="last-added-table-title">
                    <span role="img" aria-label="film">🎬</span> DERNIERS FILMS AJOUTÉS
                </div>
                <div className="last-added-table-list">
                    {latestMovies.map((movie) => (
                        <div className="last-added-table-item" key={movie.id}>
                            <Link to={`/movie/${movie.id}`} style={{ color: '#fff', textDecoration: 'underline' }}>
                                {movie.title} {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ''}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <div className="last-added-table-col">
                <div className="last-added-table-title">
                    <span role="img" aria-label="tv">📺</span> DERNIÈRES SÉRIES AJOUTÉES
                </div>
                <div className="last-added-table-list">
                    {latestSeries.map((serie) => (
                        <div className="last-added-table-item" key={serie.id}>
                            <Link to={`/tv/${serie.id}`} style={{ color: '#fff', textDecoration: 'underline' }}>
                                {serie.name} {serie.first_air_date ? `(${serie.first_air_date.slice(0, 4)})` : ''}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LastAddedTable;
