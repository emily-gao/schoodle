"use strict";

require('dotenv').config();
const PORT = process.env.PORT || 8080;

const request = require('request-promise');
const userAuthenticationHelper = require('./helpers/user-authentication-helper');

function internalApiCall(table, queryParams, method = 'GET') {
  return request({
    url: `http://localhost:${PORT}/api/${table}`,
    qs: queryParams,
    method: method,
    json: true
  });
}


function addClientRoutes(router, knex) {

  router.get('/', (request, response) => {
    response.render('index');
  });

  router.get('/events/:id', (req, res) => {
    const eventsQueryParams = { id: req.params.id };
    const eventOptionsQueryParams = { event_id: req.params.id };
    const votesQueryParams = {};

    Promise.all([
      internalApiCall('events', eventsQueryParams),
      internalApiCall('event_options', eventOptionsQueryParams),
      internalApiCall('votes', votesQueryParams)
    ]).then(([event, event_options]) => {

      const isUserOrganizer = userAuthenticationHelper(event, req);
      const templateVars = {
        event: event[0],
        event_options: event_options
      };

      if (isUserOrganizer) {
        res.render('event-organizer', templateVars);
      } else {
        res.render('event-guest', templateVars);
      }
    });

  });

}

module.exports = addClientRoutes;
