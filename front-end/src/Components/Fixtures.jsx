import React, { useState } from 'react'
import MatchSimulation from './MatchSimulation';

const Fixtures = ({ matches }) => {
    const [showSimulation, setShowSimulation] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);

    const handleSimulationEnd = (finalScore) => {
        console.log('Simulation ended:', finalScore);
        setShowSimulation(false);
    };

    return (
        <div className="overflow-x-auto w-full ">
            <table className="min-w-full border-collapse">
                <tbody>
                    {matches.map((match, index) => (
                        <tr
                            key={index}
                            className={`${index % 2 === 0 && 'bg-[#160b1d]'} hover:bg-gray-700`}
                        >
                            <td className="p-3 text-xs">{match.date}</td>
                            <td className="p-3 text-xs">{match.time}</td>
                            <td className="p-3">
                                <div className="flex items-center space-x-2">
                                    {match.homeLogo && (
                                        <img
                                            src={match.homeLogo}
                                            alt={match.homeTeam}
                                            className="w-7 h-7"
                                        />
                                    )}
                                    <span className="text-xs max-w-[100px] truncate">
                                        {match.homeTeam}
                                    </span>
                                </div>
                            </td>
                            <td className="p-3">
                                {match.score === '0' ? (
                                    <button
                                        onClick={() => {
                                            setSelectedMatch(match);
                                            setShowSimulation(true);
                                        }}
                                        className="bg-gray-800 hover:bg-purple-600 text-white p-2 rounded transition-colors duration-300"
                                    >
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17.657 18.657A8 8 0 0 1 6.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.98 7.98 0 0 1 20 13a7.98 7.98 0 0 1-2.343 5.657"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9.879 16.121A3 3 0 1 0 12.015 11L11 14H9c0 .768.293 1.536.879 2.121"
                                            />
                                        </svg>
                                    </button>
                                ) : (
                                    <span className={`text-xs ${match.score === '1' ? 'text-green-500 font-bold' : ''}`}>
                                        {match.score == 1 ? "Oynanıyor" : match.score}
                                    </span>
                                )}
                            </td>
                            <td className="p-3">
                                <div className="flex items-center space-x-2">
                                    {match.awayLogo && (
                                        <img
                                            src={match.awayLogo}
                                            alt={match.awayTeam}
                                            className="w-7 h-7"
                                        />
                                    )}
                                    <span className="text-xs max-w-[100px] truncate">
                                        {match.awayTeam}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showSimulation && selectedMatch && (
                <MatchSimulation
                    homeTeam={{
                        name: selectedMatch.homeTeam,
                        logo: selectedMatch.homeLogo
                    }}
                    awayTeam={{
                        name: selectedMatch.awayTeam,
                        logo: selectedMatch.awayLogo
                    }}
                    isOpen={showSimulation}
                    onClose={() => setShowSimulation(false)}
                    onSimulationEnd={handleSimulationEnd}
                />
            )}
        </div>
    );
};
export default Fixtures