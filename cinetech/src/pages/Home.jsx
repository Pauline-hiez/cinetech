import React from 'react';
import Slider from '../components/Slider';
import LastAddedTable from '../components/LastAddedTable';

const Home = () => {
    return (
        <div className="px-2 md:px-4">
            <div className="w-full max-w-[1300px] mx-auto">
                <div className="mb-12 md:mb-16 lg:mb-[100px]">
                    <h2 className="text-center mb-4 md:mb-6 text-xl md:text-2xl font-bold text-[#aee1f9]">Films les plus populaires</h2>
                    <div className="flex justify-center">
                        <Slider type="movie" />
                    </div>
                </div>
                <div className="mb-12 md:mb-16 lg:mb-[100px]">
                    <h2 className="text-center mb-4 md:mb-6 text-xl md:text-2xl font-bold text-[#aee1f9]">Séries les plus populaires</h2>
                    <div className="flex justify-center">
                        <Slider type="series" />
                    </div>
                </div>
            </div>
            <div className="w-full max-w-[1300px] mx-auto mt-12 md:mt-16 lg:mt-[100px]">
                <LastAddedTable />
            </div>
        </div>
    );
};

export default Home;
