import React, { useState, useEffect } from 'react';

const TeamAnalysisCards = ({ teamsAnalysis, topTeams, onTeamSelect }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(timer);
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % teamsAnalysis.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? teamsAnalysis.length - 1 : prevIndex - 1
        );
    };

    const createCard = (team) => (
        <div className="bg-themeGray p-6 rounded-lg shadow-xl border border-gray-800 w-full shrink-0">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <img
                        src={topTeams.find(t => t.team === team.name)?.logo}
                        alt={team.name}
                        className="w-10 h-10"
                    />
                    <h3 className="font-bold text-lg text-white">{team.name}</h3>
                </div>
            </div>

            <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2 bg-themeBlack rounded">
                    <span className="text-gray-300">Puan</span>
                    <span className="font-semibold text-white">{team.currentPoints}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-themeBlack rounded">
                    <span className="text-gray-300">Kalan Maç</span>
                    <span className="font-semibold text-white">{team.remainingMatches}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-themeBlack rounded">
                    <span className="text-gray-300">Form</span>
                    <span className="font-semibold text-white">%{team.recentForm}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-themeBlack rounded">
                    <span className="text-gray-300">İç Saha</span>
                    <span className="font-semibold text-white">%{team.homePerformance}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-themeBlack rounded">
                    <span className="text-gray-300">Deplasman</span>
                    <span className="font-semibold text-white">%{team.awayPerformance}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-900 rounded">
                    <span className="text-purple-200">Şampiyonluk</span>
                    <span className="font-bold text-purple-200">%{team.probability}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative w-full max-w-md mx-auto overflow-hidden">
            <div className="relative">
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-themeBlack/50 hover:bg-gray-700 text-white p-3 rounded-r-lg transition-colors duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-themeBlack/50 hover:bg-gray-700 text-white p-3 rounded-l-lg transition-colors duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                        }}
                    >
                        {teamsAnalysis.map((team, index) => (
                            <div key={index} className="w-full flex-shrink-0">
                                {createCard(team)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamAnalysisCards;