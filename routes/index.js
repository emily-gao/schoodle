"use strict";

require('dotenv').config();
const PORT = process.env.PORT || 8080;

const request = require('request-promise');
const userHelper = require('./helpers/user-helper');
const internalApiCall = require('./helpers/internal-api-call-helper');

function addClientRoutes(router, knex) {

  router.get('/', (request, response) => {
    response.render('index');
  });

  router.post('/register', (request, response) => {
    req.session.user_id = req.params.user_id;
  });

  route.get('/session', (request, response) => {
    return response.json{ value: userHelper.isUserSessionPresent(request) };
  });

  router.get('/events/:id', (req, res) => {
    const eventsQueryParams = { id: req.params.id };
    const eventOptionsQueryParams = { event_id: req.params.id };
    const votesQueryParams = { event_option_id: }

    Promise.all([
      internalApiCall('events', eventsQueryParams),
      internalApiCall('event_options', eventOptionsQueryParams),
      internalApiCall('votes', votesQueryParams)
    ]).then(([event, event_options]) => {

      const isUserOrganizer = userHelper.isUserOrganizer(event, req);
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
