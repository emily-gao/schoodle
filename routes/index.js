"use strict";

require('dotenv').config();
const PORT = process.env.PORT || 8080;

const request = require('request-promise');
const userHelper = require('./helpers/user-helper');

function addClientRoutes(router, knex) {

  router.get('/', (request, response) => {
    console.log(request.session);
    response.render('index');
  });

  router.post('/register', (request, response) => {
    console.log(request.body);
    request.session.user_id = request.body.user_id;
  });

  router.get('/session', (request, response) => {
    return response.json(userHelper.isUserSessionPresent(request));
  });

  router.get('/events/:id', (request, res) => {

    let templateVars = {};

    const eventQuery = knex
      .select('*')
      .from('events')
      .where('id', request.params.id);

    const optionsQuery = knex
      .select('*')
      .from('event_options')
      .where('event_id', request.params.id);

    const optionVotesQuery = function(option) {
      return knex
        .select('*')
        .from('votes')
        .where('event_option_id', option.id);
    };

    const usersQuery = knex
      .select('users.*')
      .distinct('users.id')
      .from('events')
      .leftJoin('event_options', 'events.id', 'event_options.event_id')
      .leftJoin('votes', 'event_options.id', 'votes.event_option_id')
      .leftJoin('users', 'votes.user_id', 'users.id')
      .where('events.id', request.params.id);

    const userEventVotesQuery = function(user, event) {
      return knex
        .select('*')
        .from('users')
        .innerJoin('votes', 'votes.user_id', 'users.id')
        .innerJoin('event_options', 'event_options.id', 'votes.event_option_id')
        .where({
          'event_options.event_id': event.id,
          'users.id': user.id
        });
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
      if (userHelper.isUserOrganizer(templateVars.event, req)) {
        res.render('event-organizer', templateVars);
      } else {
        res.render('event-guest', templateVars);
      }
    });
  });

}

module.exports = addClientRoutes;
