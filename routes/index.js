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

    /**
     * Turn the normalized event data into a tree-like structure
     * {
     *    event: <event record>
     *    event_options: <event_options array + the votes for each>
     *    users: <users who voted array + their votes>
     * }
     */
    eventQuery
      // Get the event details for the trunk
      .then(events => { templateVars.event = events[0]; })
      .catch(error => {
        response.status(500).send('Error 500: We messed up getting your event');
        console.error(error);

      // Get the linked information
      }).then(() => Promise.all([

        // Get the options that are attached to the event and nest their votes
        optionsQuery.then(options => {
          templateVars.event_options = options;
          return Promise.all(options.map(option => {
            return optionVotesQuery(option)
              .then(votes => option.votes = votes);
          }));
        }),
        // Get the users who voted and nest their votes
        usersQuery.then(users => {
          templateVars.users = users;
          return Promise.all(users.map(user => {
            return userEventVotesQuery(user, templateVars.event)
              .then(votes => user.votes = votes);
          }));
        })
      ])).catch(error => {
        response.status(500).send('Error 500: We messed up getting the votes');
        console.log(error);

      // Send the response in either JSON/html(guest)/html(organizer) form
      }).then(() => {
        if (!templateVars.event) {
          response.status(404).send('404: Event not found');
        } else if (request.get('Content-Type') === 'application/json') {
          response.json(templateVars);
        } else if (userHelper.isUserOrganizer(templateVars.event, request)) {
          response.render('event-organizer', templateVars);
        } else {
          response.render('event-guest', templateVars);
        }
      }).catch(error => {
        response.status(500).send('Error 500: We messed up sending the information');
        console.log(error);
      });
  });

}

module.exports = addClientRoutes;
