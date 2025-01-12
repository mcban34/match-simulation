const standingService = require('../services/standingService');

const getStandings = async (req, res, next) => {
    try {
        const standings = await standingService.getStandings();
        res.json({
            standings,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getStandings };