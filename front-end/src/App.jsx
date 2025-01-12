import { useState, useEffect } from 'react';
import axios from 'axios';
import TopScorers from './Components/TopScorers';
import Standings from './Components/Standings';
import Fixtures from './Components/Fixtures';
import Banner from './Components/Banner';
import ChampionshipBarChart from './Components/ChampionshipBarChart';
import TeamPerformance from './Components/TeamPerformance';
import TeamAnalysisCards from './Components/TeamAnalysisCards';
import Loading from './Components/Loading';

const TabButton = ({ active, children, onClick }) => (
  <button
    className={`px-4 py-2 font-semibold text-xs rounded-t-lg ${active
      ? 'bg-white text-gray-700 border-b-2 border-themePurple'
      : 'bg-gray-800 text-white hover:bg-gray-900'
      }`}
    onClick={onClick}
  >
    {children}
  </button>
);


const App = () => {
  const [activeTab, setActiveTab] = useState('fixtures');
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [penaltyPoints, setPenaltyPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("app çalıştı", import.meta.env.VITE_API_URL)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [matchesResponse, standingsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/get-matches`),
          axios.get(`${import.meta.env.VITE_API_URL}/standings`)
        ]);

        setMatches(matchesResponse.data);
        setStandings(standingsResponse.data.standings);
        setPenaltyPoints(standingsResponse.data.penaltyPoints);
        setError(null);
      } catch (err) {
        setError(`Veri yüklenirken bir hata oluştu: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);


  const topTeams = standings.slice(0, 3);

  const calculateRecentForm = (matches, teamName) => {
    const lastMatches = matches
      .filter(match => match.score !== '0' && match.score !== '1')
      .slice(-5);

    if (lastMatches.length === 0) return 0;

    const points = lastMatches.reduce((acc, match) => {
      if (match.score === '1' || match.score === '0') return acc;

      const [homeGoals, awayGoals] = match.score.split(' - ').map(Number);
      const isHome = match.homeTeam === teamName;

      if (isHome) {
        if (homeGoals > awayGoals) return acc + 3;
        if (homeGoals === awayGoals) return acc + 1;
      } else {
        if (awayGoals > homeGoals) return acc + 3;
        if (homeGoals === awayGoals) return acc + 1;
      }
      return acc;
    }, 0);

    return points / (lastMatches.length * 3);
  };

  const calculatePerformance = (matches, isHome) => {
    if (matches.length === 0) return 0;
    const points = matches.reduce((acc, match) => {
      if (!match.score.includes('-')) return acc;
      const [homeGoals, awayGoals] = match.score.split(' - ').map(Number);
      if (isHome) {
        if (homeGoals > awayGoals) return acc + 3;
        if (homeGoals === awayGoals) return acc + 1;
      } else {
        if (awayGoals > homeGoals) return acc + 3;
        if (homeGoals === awayGoals) return acc + 1;
      }
      return acc;
    }, 0);
    return (points / (matches.length * 3)) * 100;
  };

  const teamsAnalysis = topTeams.map(team => {
    const teamMatches = matches.filter(m => m.homeTeam === team.team || m.awayTeam === team.team);
    const homeMatches = matches.filter(m => m.homeTeam === team.team && m.score !== '0');
    const awayMatches = matches.filter(m => m.awayTeam === team.team && m.score !== '0');

    const goalRatio = team.goalDifference > 0 ? team.goalDifference / standings[0].goalDifference : 0;
    const remainingMatches = 34 - team.played;
    const recentForm = calculateRecentForm(teamMatches, team.team);
    const homePerformance = calculatePerformance(homeMatches, true);
    const awayPerformance = calculatePerformance(awayMatches, false);

    // Şampiyonluk olasılığı hesaplama
    const pointsDifference = standings[0].points - team.points;
    const pointsEffect = Math.max(0, 100 - (pointsDifference * 5));
    const probability = Math.min(
      ((pointsEffect * 0.4) +
        (goalRatio * 100 * 0.15) +
        (recentForm * 100 * 0.2) +
        (homePerformance * 0.1) +
        (awayPerformance * 0.1) +
        ((remainingMatches / 34) * 100 * 0.05)),
      100
    );

    return {
      name: team.team,
      currentPoints: team.points,
      maxPossiblePoints: team.points + (remainingMatches * 3),
      probability: Math.max(probability, 0).toFixed(1),
      recentForm: (recentForm * 100).toFixed(1),
      homePerformance: homePerformance.toFixed(1),
      awayPerformance: awayPerformance.toFixed(1),
      goalRatio: (goalRatio * 100).toFixed(1),
      remainingMatches
    };
  });

  if (loading) {
    return (

      <Loading />

    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-themeBlack text-white p-4">
      <div className='grid grid-cols-12 h-full gap-5'>
        <div className="col-span-12 lg:col-span-3 order-2 lg:order-1 space-y-5 overflow-y-auto ">
          <ChampionshipBarChart teamsAnalysis={teamsAnalysis} />
          <TeamAnalysisCards
            teamsAnalysis={teamsAnalysis}
            topTeams={topTeams}
          />
        </div>
        <div className="col-span-12 lg:col-span-6 order-1 lg:order-2">
          <Banner matches={matches} />
          <div className='lg:h-[calc(100vh-320px)] mt-6 bg-themeGray rounded-lg overflow-y-auto'>
            <TabButton
              active={activeTab === 'fixtures'}
              onClick={() => setActiveTab('fixtures')}
            >
              Fikstür
            </TabButton>
            <TabButton
              active={activeTab === 'standings'}
              onClick={() => setActiveTab('standings')}
            >
              Puan Durumu
            </TabButton>
            {
              activeTab == "fixtures" ? (
                <Fixtures matches={matches} />
              ) : (
                <Standings standings={standings} penaltyPoints={penaltyPoints} />
              )
            }
          </div>
          <p className='text-sm text-center hidden lg:block pt-3'>Veriler Anlık Olarak <a className='text-blue-400' href="https://www.tff.org/default.aspx?pageId=66">TFF Resmi Sitesi</a>nden Alınmaktadır.</p>
        </div>
        <div className=" col-span-12 lg:col-span-3 overflow-y-auto order-3">
          <TeamPerformance teamsAnalysis={teamsAnalysis} />
          <h2 className="text-md font-bold mb-3 mt-4">Gol Krallığı</h2>
          <div className='bg-themeGray rounded-lg'>
            <TopScorers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;