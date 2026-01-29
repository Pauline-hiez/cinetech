import React from 'react';
import Slider from '../components/Slider';
import LastAddedTable from '../components/LastAddedTable';

const Home = () => {
    return (
        <div>
            <div className="w-full max-w-[1300px] mx-auto">
                <div className="mb-[100px]">
                    <h2 className="text-center mb-6">Films les plus populaires</h2>
                    <div className="flex justify-center">
                        <Slider type="movie" />
                    </div>
                </div>
                <div className="mb-[100px]">
                    <h2 className="text-center mb-6">Séries les plus populaires</h2>
                    <div className="flex justify-center">
                        <Slider type="series" />
                    </div>
                </div>
            </div>
            <div className="w-full max-w-[1300px] mx-auto last-added-table-wrapper">
                <LastAddedTable />
            </div>
        </div>
    );
};

export default Home;
