import { useState, useEffect } from 'react';

const TopScorers = () => {
    const [scorers, setScorers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchScorers = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://back-end-z2ts.onrender.com/top-scorers');
                const data = await response.json();
                setScorers(data.scorers);
                setError(null);
            } catch (err) {
                setError('Gol krallığı verisi yüklenirken bir hata oluştu: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScorers();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-lg text-gray-600">Yükleniyor...</div>
        </div>;
    }

    if (error) {
        return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
    }

    return (
        <div className="space-y-4 max-h-24">
            <div className=" rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <tbody>
                            {scorers.map((scorer, index) => (
                                <tr key={index} className={`${index % 2 == 0 && "bg-[#160b1d]"}`}>
                                    <td className="px-4 py-3">
                                        <span>
                                            <img width={20} src={scorer.teamLogo} alt={scorer.teamLogo} />
                                        </span>
                                    </td>
                                    <td className="py-3 text-xs truncate max-w-[100px]">{scorer.playerName}</td>

                                    <td className="px-4 py-3 text-center text-xs font-bold">
                                        {scorer.goals}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TopScorers;