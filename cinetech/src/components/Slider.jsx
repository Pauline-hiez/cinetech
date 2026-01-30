
import React, { useEffect, useState, useRef } from "react";
import { fetchPopularMovies, fetchPopularSeries } from "../services/tmdb";
import MovieCard from "../components/MovieCard";

const SLIDES_VISIBLE = 7;

function getCarouselStyle(idx, activeIdx, total) {
    const angleStep = 55;
    let offset = idx - activeIdx;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    // Responsive radius
    const radius = window.innerWidth < 640 ? 100 : window.innerWidth < 1024 ? 150 : 210;

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
        <div className="stellar-slider relative perspective-[1200px] min-h-[200px] md:min-h-[280px] lg:min-h-[340px] w-full max-w-[1300px] mx-auto mb-8 md:mb-12 px-2">
            <div className="flex items-center justify-center relative">
                <button className="nav-btn rounded-full w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-slate-900/70 border-none text-[#aee1f9] text-xl md:text-2xl lg:text-[2rem] flex items-center justify-center shadow-[0_2px_12px_#222] cursor-pointer transition-all duration-200 outline-none relative z-10 hover:bg-[#133e52] hover:text-white hover:shadow-[0_0_24px_#4e8fae] hover:scale-110 mr-1 md:mr-2" onClick={prev} aria-label="Précédent">
                    ‹
                </button>
                <div
                    className="stellar-carousel relative w-[280px] sm:w-[400px] md:w-[600px] lg:w-[800px] xl:w-[1100px] h-[200px] md:h-[260px] lg:h-[320px] flex items-center justify-center perspective-[1200px] mx-auto overflow-hidden"
                    ref={carouselRef}
                >
                    {items.map((item, idx) => (
                        <div
                            key={item.id}
                            className={`carousel-slide absolute w-[120px] h-[180px] sm:w-[140px] sm:h-[210px] md:w-[160px] md:h-[240px] lg:w-[180px] lg:h-[270px] shadow-[0_8px_32px_rgba(30,41,59,0.25),0_1.5px_8px_0_rgba(0,0,0,0.12)] rounded-2xl lg:rounded-3xl bg-slate-900/70 outline-none overflow-visible${idx === activeIdx ? " active z-[3]" : ""}`}
                            style={getCarouselStyle(idx, activeIdx, items.length)}
                            tabIndex={idx === activeIdx ? 0 : -1}
                            aria-hidden={idx !== activeIdx}
                            onClick={() => goTo(idx)}
                        >
                            <MovieCard movie={item} />
                        </div>
                    ))}
                </div>
                <button className="nav-btn rounded-full w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-slate-900/70 border-none text-[#aee1f9] text-xl md:text-2xl lg:text-[2rem] flex items-center justify-center shadow-[0_2px_12px_#222] cursor-pointer transition-all duration-200 outline-none relative z-10 hover:bg-[#133e52] hover:text-white hover:shadow-[0_0_24px_#4e8fae] hover:scale-110 ml-1 md:ml-2" onClick={next} aria-label="Suivant">
                    ›
                </button>
            </div>
            <div className="dot-nav flex justify-center mt-4 md:mt-6 mb-0 relative z-[2]">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        className={`dot w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full mx-1 md:mx-1.5 border-2 cursor-pointer transition-all duration-200${idx === activeIdx ? " active bg-[#aee1f9] border-[#aee1f9] scale-110" : " bg-gray-900 border-[#4e8fae]"}`}
                        onClick={() => goTo(idx)}
                        aria-label={`Aller à la slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;
