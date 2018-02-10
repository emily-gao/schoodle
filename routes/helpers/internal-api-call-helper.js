module.exports = function internalApiCall(table, queryParams, method = 'GET') {
  return request({
    url: `http://localhost:${PORT}/api/${table}`,
    qs: queryParams,
    method: method,
    json: true
  });
};