
import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { fetchPopularSeries } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';

const SERIES_PER_PAGE = 24;

export default function Series() {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        let isMounted = true;
        async function getPopularSeriesWithImages() {
            setLoading(true);
            setError(null);
            let seriesWithImage = [];
            let apiPage = page;
            try {
                while (seriesWithImage.length < SERIES_PER_PAGE) {
                    const data = await fetchPopularSeries(apiPage);
                    if (isMounted && data.results) {
                        const filtered = data.results.filter((serie) => serie.poster_path);
                        seriesWithImage = seriesWithImage.concat(filtered);
                        if (apiPage === 1) {
                            setTotalPages(data.total_pages);
                        }
                        if (data.page >= data.total_pages) break;
                        apiPage++;
                    } else {
                        break;
                    }
                }
                if (isMounted) setSeries(seriesWithImage.slice(0, SERIES_PER_PAGE));
            } catch (err) {
                if (isMounted) setError('Erreur lors du chargement des séries.');
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        getPopularSeriesWithImages();
        return () => { isMounted = false; };
    }, [page]);

    if (loading) return <Spinner />;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                {series.map((serie) => (
                    <MovieCard key={serie.id} movie={{
                        ...serie,
                        title: serie.name,
                        release_date: serie.first_air_date
                    }} />
                ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
