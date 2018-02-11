"use strict";

require('dotenv').config();
const PORT = process.env.PORT || 8080;

const request = require('request-promise');
const userHelper = require('./helpers/user-helper');

function addClientRoutes(router, knex) {

  router.get('/', (request, response) => {
    response.render('index');
  });

  router.post('/register', (request, response) => {
    request.session.user_id = request.body.user_id;
    userHelper.isUserSessionPresent(request, (result) => {
      response.json(result);
    });
  });

  router.get('/session', (request, response) => {
    userHelper.isUserSessionPresent(request, (result) => {
      response.json(result);
    });
  });

  router.get('/events/:url', (request, response) => {

    const templateVars = {};

    const eventQuery = knex
      .select('*')
      .from('events')
      .where('url', request.params.url)
      .orderBy('created_at');

    const optionsQuery = knex
      .select('event_options.*')
      .from('event_options')
      .join('events', 'events.id', 'event_options.event_id')
      .where('events.url', request.params.url)
      .orderBy('created_at');

    const optionVotesQuery = function(option) {
      return knex
        .select('votes.*')
        .from('votes')
        .where('event_option_id', option.id)
        .orderBy('created_at');
    };

    const usersQuery = knex
      .select('users.*')
      .distinct('users.id')
      .from('events')
      .leftJoin('event_options', 'events.id', 'event_options.event_id')
      .leftJoin('votes', 'event_options.id', 'votes.event_option_id')
      .leftJoin('users', 'votes.user_id', 'users.id')
      .where('events.url', request.params.url)
      .orderBy('created_at');

    const userEventVotesQuery = function(user, event) {
      return knex
        .select('votes.*')
        .from('users')
        .innerJoin('votes', 'votes.user_id', 'users.id')
        .innerJoin('event_options', 'event_options.id', 'votes.event_option_id')
        .where({
          'event_options.event_id': event.id,
          'users.id': user.id
        })
        .orderBy('created_at');
    };

    Promise.all([
      eventQuery.then(events => { templateVars.event = events[0]; }),
      optionsQuery.then(options => {
        templateVars.event_options = options;
        return Promise.all(options.map(option => {
          return optionVotesQuery(option)
            .then(votes => option.votes = votes);
        }));
      }),
      usersQuery.then(users => {
        templateVars.users = users;
        return Promise.all(users.map(user => {
          return userEventVotesQuery(user, templateVars.event)
            .then(votes => user.votes = votes);
        }));
      })
    ]).then(() => {
      if (request.get('Content-Type') === 'application/json') {
        response.json(templateVars);
      } else if (userHelper.isUserOrganizer(templateVars.event, request)) {
        response.render('event-organizer', templateVars);
      } else {
        response.render('event-guest', templateVars);
      }
    });
  });

}

module.exports = addClientRoutes;
