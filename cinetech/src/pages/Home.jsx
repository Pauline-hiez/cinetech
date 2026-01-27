import React from 'react';
import Slider from '../components/Slider';

const Home = () => {
    return (
        <div>
            <h2>Films les plus populaires</h2>
            <Slider type="movie" />
            <h2>Séries les plus populaires</h2>
            <Slider type="series" />
        </div>
    );
};

export default Home;
