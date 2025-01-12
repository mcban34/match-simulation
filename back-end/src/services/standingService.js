const cheerio = require('cheerio');
const { fetchData } = require('../utils/httpClient');
const teamLogos = require('../data/teamLogos');
const { MATCHES_URL } = require('../config/constants');

class StandingService {
    async getStandings() {
        const html = await fetchData(MATCHES_URL);
        const $ = cheerio.load(html, { decodeEntities: false });

        const standings = [];

        $(".s-table tr").each((index, element) => {
            if (index === 0) return;

            const row = $(element);
            const teamName = row.find('td:first-child a').text().trim();

            if (!teamName) return;

            const cleanTeamName = teamName.substring(teamName.indexOf('.') + 1);

            const stats = {
                position: index,
                team: cleanTeamName,
                played: parseInt(row.find('td:nth-child(2) span[id*="lblOyun"]').text().trim() || '0'),
                won: parseInt(row.find('td:nth-child(3) span[id*="Label4"]').text().trim() || '0'),
                drawn: parseInt(row.find('td:nth-child(4) span[id*="lblKazanma"]').text().trim() || '0'),
                lost: parseInt(row.find('td:nth-child(5) span[id*="lblPuan"]').text().trim() || '0'),
                goalsFor: parseInt(row.find('td:nth-child(6) span[id*="Label1"]').text().trim() || '0'),
                goalsAgainst: parseInt(row.find('td:nth-child(7) span[id*="Label2"]').text().trim() || '0'),
                goalDifference: parseInt(row.find('td:nth-child(8) span[id*="Label5"]').text().trim() || '0'),
                points: parseInt(row.find('td:nth-child(9) span[id*="Label3"]').text().trim() || '0'),
                logo: teamLogos[cleanTeamName] || ''
            };

            standings.push(stats);
        });

        return standings;
    }
}

module.exports = new StandingService();