const scorerService = require('../services/scorerService');

const getTopScorers = async (req, res, next) => {
    try {
        const scorers = await scorerService.getTopScorers();
        res.json({
            scorers,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTopScorers };