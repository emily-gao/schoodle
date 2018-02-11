require('dotenv').config();

const PORT = process.env.PORT || 8080;
const requestPromise = require('request-promise');

module.exports = function internalApiCall(table, queryParams, method = 'GET') {
  return requestPromise({
    url: `http://localhost:${PORT}/api/${table}`,
    qs: queryParams,
    method: method,
    json: true
  });
};
