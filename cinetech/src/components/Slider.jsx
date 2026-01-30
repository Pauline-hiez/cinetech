
import React, { useEffect, useState, useRef } from "react";
import { fetchPopularMovies, fetchPopularSeries } from "../services/tmdb";
import MovieCard from "../components/MovieCard";

const SLIDES_VISIBLE = 7;

function getCarouselStyle(idx, activeIdx, total) {
    const angleStep = window.innerWidth < 640 ? 60 : 55;
    let offset = idx - activeIdx;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    // Responsive radius - ajusté pour mobile
    const radius = window.innerWidth < 640 ? 140 : window.innerWidth < 768 ? 170 : window.innerWidth < 1024 ? 200 : 240;

    const angle = offset * angleStep;
    const rad = (angle * Math.PI) / 180;
    const x = Math.sin(rad) * radius;
    const z = Math.cos(rad) * radius;

    // Scaling responsive
    const baseScale = window.innerWidth < 640 ? 0.95 : 1.05;
    const scale1 = window.innerWidth < 640 ? 0.75 : 0.85;
    const scale2 = window.innerWidth < 640 ? 0.6 : 0.7;

    // Rotation symétrique pour gauche et droite
    const rotationY = offset > 0 ? -20 : offset < 0 ? 20 : 0;

    if (offset === 0) {
        return {
            transform: `translateX(${x}px) translateZ(${z}px) scale(${baseScale})`,
            zIndex: 3,
            opacity: 1,
            boxShadow: 'none',
            filter: 'none',
            transition: 'transform 0.7s cubic-bezier(0.77,0,0.18,1), opacity 0.5s',
        };
    }
    if (Math.abs(offset) === 1) {
        return {
            transform: `translateX(${x}px) translateZ(${z}px) scale(${scale1}) rotateY(${rotationY}deg)`,
            zIndex: 2,
            opacity: window.innerWidth < 640 ? 0.5 : 0.7,
            boxShadow: 'none',
            filter: 'none',
            transition: 'transform 0.7s cubic-bezier(0.77,0,0.18,1), opacity 0.5s',
        };
    }
    if (Math.abs(offset) === 2) {
        return {
            transform: `translateX(${x}px) translateZ(${z}px) scale(${scale2}) rotateY(${rotationY * 1.5}deg)`,
            zIndex: 1,
            opacity: window.innerWidth < 640 ? 0 : 0.3,
            boxShadow: 'none',
            filter: 'none',
            transition: 'transform 0.7s cubic-bezier(0.77,0,0.18,1), opacity 0.5s',
        };
    }
    return {
        transform: `translateX(${x}px) translateZ(${z}px) scale(0.5) rotateY(${rotationY * 2}deg)`,
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
        <div className="stellar-slider relative perspective-[1200px] w-full max-w-[1300px] mx-auto mb-6 md:mb-8 lg:mb-12 px-2 sm:px-4 md:px-16 lg:px-20 pb-6 md:pb-16">
            <div className="relative mb-4 md:mb-12 lg:mb-14 flex justify-center">
                <button className="nav-btn rounded-full w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-slate-900/80 border-none text-[#aee1f9] text-2xl md:text-3xl lg:text-[2.5rem] flex items-center justify-center shadow-[0_2px_12px_#222] cursor-pointer transition-all duration-200 outline-none absolute left-0 top-1/2 -translate-y-1/2 z-10 hover:bg-[#133e52] hover:text-white hover:shadow-[0_0_24px_#4e8fae] hover:scale-110 hidden md:flex" onClick={prev} aria-label="Précédent">
                    ‹
                </button>
                <div
                    className="stellar-carousel relative w-[300px] sm:w-[380px] md:w-[600px] lg:w-[800px] xl:w-[1100px] h-[220px] sm:h-[250px] md:h-[280px] lg:h-[320px] flex items-center justify-center perspective-[1200px] overflow-visible"
                    ref={carouselRef}
                >
                    {items.map((item, idx) => (
                        <div
                            key={item.id}
                            className={`carousel-slide absolute w-[130px] h-[195px] sm:w-[150px] sm:h-[225px] md:w-[170px] md:h-[255px] lg:w-[190px] lg:h-[285px] shadow-[0_8px_32px_rgba(30,41,59,0.25),0_1.5px_8px_0_rgba(0,0,0,0.12)] rounded-xl sm:rounded-2xl lg:rounded-3xl bg-slate-900/70 outline-none overflow-visible${idx === activeIdx ? " active z-[3]" : ""}`}
                            style={getCarouselStyle(idx, activeIdx, items.length)}
                            tabIndex={idx === activeIdx ? 0 : -1}
                            aria-hidden={idx !== activeIdx}
                            onClick={() => goTo(idx)}
                        >
                            <MovieCard movie={item} />
                        </div>
                    ))}
                </div>
                <button className="nav-btn rounded-full w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-slate-900/80 border-none text-[#aee1f9] text-2xl md:text-3xl lg:text-[2.5rem] flex items-center justify-center shadow-[0_2px_12px_#222] cursor-pointer transition-all duration-200 outline-none absolute right-0 top-1/2 -translate-y-1/2 z-10 hover:bg-[#133e52] hover:text-white hover:shadow-[0_0_24px_#4e8fae] hover:scale-110 hidden md:flex" onClick={next} aria-label="Suivant">
                    ›
                </button>
            </div>
            <div className="flex items-center justify-center gap-12 mt-16 mb-5 md:hidden">
                <button className="nav-btn rounded-full w-12 h-12 bg-slate-900/80 border-none text-[#aee1f9] text-3xl flex items-center justify-center shadow-[0_2px_12px_#222] cursor-pointer transition-all duration-200 outline-none relative z-10 hover:bg-[#133e52] hover:text-white hover:shadow-[0_0_24px_#4e8fae] hover:scale-110" onClick={prev} aria-label="Précédent">
                    ‹
                </button>
                <button className="nav-btn rounded-full w-12 h-12 bg-slate-900/80 border-none text-[#aee1f9] text-3xl flex items-center justify-center shadow-[0_2px_12px_#222] cursor-pointer transition-all duration-200 outline-none relative z-10 hover:bg-[#133e52] hover:text-white hover:shadow-[0_0_24px_#4e8fae] hover:scale-110" onClick={next} aria-label="Suivant">
                    ›
                </button>
            </div>
            <div className="dot-nav flex justify-center relative md:absolute md:bottom-0 left-0 right-0 mb-0 z-[20]">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        className={`dot w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 rounded-full mx-1 sm:mx-1.5 md:mx-2 border-2 cursor-pointer transition-all duration-200${idx === activeIdx ? " active bg-[#aee1f9] border-[#aee1f9] scale-110" : " bg-gray-900 border-[#4e8fae]"}`}
                        onClick={() => goTo(idx)}
                        aria-label={`Aller à la slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;
