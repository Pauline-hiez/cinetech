import React from 'react';
import Slider from '../components/Slider';
import LastAddedTable from '../components/LastAddedTable';

const Home = () => {
    return (
        <div>
            <h2>Films les plus populaires</h2>
            <Slider type="movie" />
            <h2>Séries les plus populaires</h2>
            <Slider type="series" />
            <LastAddedTable />
        </div>
    );
};

export default Home;
