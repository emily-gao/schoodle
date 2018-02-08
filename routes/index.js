"use strict";

function addClientRoutes(router, knex) {
  router.get('/', (request, response) => {
    response.render('index');
  });
}

module.exports = addClientRoutes;
