import React from 'react'

const Standings = ({ standings, penaltyPoints }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-xs bg-themeGray border border-gray-700">
            <thead>
                <tr>
                    <th className="p-2 border border-gray-700 text-gray-300">Sıra</th>
                    <th className="p-2 border border-gray-700 text-gray-300">Takım</th>
                    <th className="p-2 border border-gray-700 text-gray-300">O</th>
                    <th className="p-2 border border-gray-700 text-gray-300">G</th>
                    <th className="p-2 border border-gray-700 text-gray-300">B</th>
                    <th className="p-2 border border-gray-700 text-gray-300">M</th>
                    <th className="p-2 border border-gray-700 text-gray-300">AG</th>
                    <th className="p-2 border border-gray-700 text-gray-300">YG</th>
                    <th className="p-2 border border-gray-700 text-gray-300">AV</th>
                    <th className="p-2 border border-gray-700 text-gray-300">P</th>
                </tr>
            </thead>
            <tbody>
                {standings.map((team) => (
                    <tr key={team.position} className={`
                        hover:bg-gray-800 transition-colors duration-150 text-gray-300
                        ${team.position <= 4 ? 'bg-green-900/20' : ''}
                        ${team.position >= 17 ? 'bg-red-900/20' : ''}
                    `}>
                        <td className="p-2 border border-gray-700 text-center">{team.position}</td>
                        <td className="p-2 border border-gray-700">
                            <div className="flex items-center">
                                {team.logo && (
                                    <img
                                        src={team.logo}
                                        alt={team.team}
                                        className="w-6 h-6 mr-2"
                                    />
                                )}
                                <span className=' truncate'>{team.team}</span>
                            </div>
                        </td>
                        <td className="p-2 border border-gray-700 text-center">{team.played}</td>
                        <td className="p-2 border border-gray-700 text-center">{team.won}</td>
                        <td className="p-2 border border-gray-700 text-center">{team.drawn}</td>
                        <td className="p-2 border border-gray-700 text-center">{team.lost}</td>
                        <td className="p-2 border border-gray-700 text-center">{team.goalsFor}</td>
                        <td className="p-2 border border-gray-700 text-center">{team.goalsAgainst}</td>
                        <td className="p-2 border border-gray-700 text-center">{team.goalDifference}</td>
                        <td className="p-2 border border-gray-700 text-center font-bold">{team.points}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default Standings;