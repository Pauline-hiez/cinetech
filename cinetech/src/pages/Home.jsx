/**
 * Page d'accueil (Home)
 * Affiche les films et séries populaires dans des sliders
 * et un tableau des derniers ajouts
 */

// Importation des composants nécessaires
import Slider from '../components/Slider'; // Slider pour les films/séries populaires
import LastAddedTable from '../components/LastAddedTable'; // Tableau des derniers ajouts

const Home = () => {
    return (
        <div className="px-2 md:px-4">
            {/* Conteneur principal avec largeur maximale */}
            <div className="w-full max-w-[1300px] mx-auto">
                {/* Section Films populaires */}
                <div className="mb-12 md:mb-16 lg:mb-[100px]">
                    <h2 className="text-center mb-4 md:mb-6 text-xl md:text-2xl font-bold text-[#aee1f9]">Films les plus populaires</h2>
                    <div className="flex justify-center">
                        {/* Slider pour les films (type="movie") */}
                        <Slider type="movie" />
                    </div>
                </div>

                {/* Section Séries populaires */}
                <div className="mb-12 md:mb-16 lg:mb-[100px]">
                    <h2 className="text-center mb-4 md:mb-6 text-xl md:text-2xl font-bold text-[#aee1f9]">Séries les plus populaires</h2>
                    <div className="flex justify-center">
                        {/* Slider pour les séries (type="series") */}
                        <Slider type="series" />
                    </div>
                </div>
            </div>

            {/* Tableau des derniers films/séries ajoutés */}
            <div className="w-full max-w-[1300px] mx-auto mt-12 md:mt-16 lg:mt-[100px]">
                <LastAddedTable />
            </div>
        </div>
    );
};

export default Home;
