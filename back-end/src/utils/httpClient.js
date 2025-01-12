// utils/httpClient.js
const axios = require('axios');
const iconv = require('iconv-lite');  // Doğru import
const { REQUEST_HEADERS } = require('../config/constants');

const fetchData = async (url) => {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            headers: REQUEST_HEADERS
        });
        const html = iconv.decode(Buffer.from(response.data), 'windows-1254');
        return html;
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Data fetch error: ${error.message}`);
    }
};

module.exports = { fetchData };