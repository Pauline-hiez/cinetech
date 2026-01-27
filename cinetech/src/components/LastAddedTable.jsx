import React, { useEffect, useState } from "react";
import { fetchAllMovies, fetchAllSeries } from "../services/tmdb";

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
                            <span>{movie.title} {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ''}</span>
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
                            <span>{serie.name} {serie.first_air_date ? `(${serie.first_air_date.slice(0, 4)})` : ''}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LastAddedTable;
