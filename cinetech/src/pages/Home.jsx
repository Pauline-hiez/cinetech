import React from 'react';
import Slider from '../components/Slider';
import LastAddedTable from '../components/LastAddedTable';

const Home = () => {
    return (
        <div>
            <div style={{ width: '100%', maxWidth: 1300, margin: '0 auto' }}>
                <div style={{ marginBottom: 100 }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Films les plus populaires</h2>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Slider type="movie" />
                    </div>
                </div>
                <div style={{ marginBottom: 100 }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Séries les plus populaires</h2>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Slider type="series" />
                    </div>
                </div>
            </div>
            <LastAddedTable />
        </div>
    );
};

export default Home;
