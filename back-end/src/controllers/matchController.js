const matchService = require('../services/matchService');

const getMatches = async (req, res, next) => {
    try {
        const matches = await matchService.getMatchesForWeek();
        res.json(matches);
    } catch (error) {
        next(error);
    }
};

module.exports = { getMatches };