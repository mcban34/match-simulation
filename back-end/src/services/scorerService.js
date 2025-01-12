const cheerio = require('cheerio');
const { fetchData } = require('../utils/httpClient');
const teamLogos = require('../data/teamLogos');
const { SCORERS_URL } = require('../config/constants');

class ScorerService {
    async getTopScorers() {
        const html = await fetchData(SCORERS_URL);
        const $ = cheerio.load(html, { decodeEntities: false });

        const scorers = [];
        const mainDiv = $("#ctl00_MPane_m_821_4914_ctnr_div");

        const rows = mainDiv.find('tr').filter(function () {
            return $(this).find('td.altGriCizgi').length > 0;
        });

        rows.each((index, row) => {
            const $row = $(row);
            const tdContent = $row.find('td.altGriCizgi');

            if (tdContent.length >= 2) {
                const playerName = tdContent.find('a:first').text().trim();
                const teamName = tdContent.find('a:last').text().trim();
                const goals = tdContent.next('td.altGriCizgi').find('span').text().trim();

                if (playerName && teamName && goals) {
                    scorers.push({
                        rank: index + 1,
                        playerName,
                        teamName,
                        goals: parseInt(goals),
                        teamLogo: teamLogos[teamName] || ''
                    });
                }
            }
        });

        return scorers;
    }
}

module.exports = new ScorerService();