
import React, { useEffect, useState, useRef } from "react";
import { fetchPopularMovies, fetchPopularSeries } from "../services/tmdb";
import MovieCard from "../components/MovieCard";

const SLIDES_VISIBLE = 7;

function getCarouselStyle(idx, activeIdx, total) {
    const angleStep = 55;
    let offset = idx - activeIdx;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    const radius = 210;
    const angle = offset * angleStep;
    const rad = (angle * Math.PI) / 180;
    const x = Math.sin(rad) * radius;
    const z = Math.cos(rad) * radius;
    if (offset === 0) {
        return {
            transform: `translateX(${x}px) translateZ(${z}px) scale(1.05)`,
            zIndex: 3,
            opacity: 1,
            boxShadow: 'none',
            filter: 'none',
            transition: 'transform 0.7s cubic-bezier(0.77,0,0.18,1), opacity 0.5s',
        };
    }
    if (Math.abs(offset) === 1) {
        return {
            transform: `translateX(${x}px) translateZ(${z}px) scale(0.85) rotateY(${angle}deg)`,
            zIndex: 2,
            opacity: 0.7,
            boxShadow: 'none',
            filter: 'none',
            transition: 'transform 0.7s cubic-bezier(0.77,0,0.18,1), opacity 0.5s',
        };
    }
    if (Math.abs(offset) === 2) {
        return {
            transform: `translateX(${x}px) translateZ(${z}px) scale(0.7) rotateY(${angle}deg)`,
            zIndex: 1,
            opacity: 0.3,
            boxShadow: 'none',
            filter: 'none',
            transition: 'transform 0.7s cubic-bezier(0.77,0,0.18,1), opacity 0.5s',
        };
    }
    return {
        transform: `translateX(${x}px) translateZ(${z}px) scale(0.5) rotateY(${angle}deg)`,
        zIndex: 0,
        opacity: 0,
        pointerEvents: 'none',
        filter: 'none',
        transition: 'transform 0.7s cubic-bezier(0.77,0,0.18,1), opacity 0.5s',
    };
}

const Slider = ({ type }) => {
    const [items, setItems] = useState([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const carouselRef = useRef();

    useEffect(() => {
        async function fetchData() {
            let data;
            if (type === "movie") {
                data = await fetchPopularMovies(1);
            } else {
                data = await fetchPopularSeries(1);
            }
            setItems(data.results.slice(0, 12));
            setActiveIdx(0);
        }
        fetchData();
    }, [type]);

    const goTo = (idx) => setActiveIdx(idx);
    const prev = () => setActiveIdx((prev) => (prev - 1 + items.length) % items.length);
    const next = () => setActiveIdx((prev) => (prev + 1) % items.length);

    return (
        <div className="stellar-slider" style={{ position: "relative", perspective: "1200px", minHeight: 340, maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <button className="slider-arrow nav-btn left" onClick={prev} aria-label="Précédent" style={{ left: 0, position: 'relative', marginRight: 8 }}>
                    ‹
                </button>
                <div
                    className="stellar-carousel"
                    ref={carouselRef}
                    style={{
                        position: "relative",
                        width: 700,
                        height: 320,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        perspective: "1200px",
                        margin: "0 auto"
                    }}
                >
                    {items.map((item, idx) => (
                        <div
                            key={item.id}
                            className={`carousel-slide${idx === activeIdx ? " active" : ""}`}
                            style={{
                                position: "absolute",
                                width: 140,
                                height: 210,
                                ...getCarouselStyle(idx, activeIdx, items.length)
                            }}
                            tabIndex={idx === activeIdx ? 0 : -1}
                            aria-hidden={idx !== activeIdx}
                            onClick={() => goTo(idx)}
                        >
                            <MovieCard movie={item} />
                        </div>
                    ))}
                </div>
                <button className="slider-arrow nav-btn right" onClick={next} aria-label="Suivant" style={{ right: 0, position: 'relative', marginLeft: 8 }}>
                    ›
                </button>
            </div>
            <div className="dot-nav" style={{ display: "flex", justifyContent: "center", marginTop: 80, marginBottom: 0, position: 'relative', zIndex: 2 }}>
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        className={`dot${idx === activeIdx ? " active" : ""}`}
                        style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            margin: "0 6px",
                            background: idx === activeIdx ? "#aee1f9" : "#222",
                            border: "2px solid #6c3fd1",
                            boxShadow: idx === activeIdx ? "0 0 16px #aee1f9" : "0 0 8px #6c3fd1",
                            cursor: "pointer"
                        }}
                        onClick={() => goTo(idx)}
                        aria-label={`Aller à la slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;
