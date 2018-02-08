"use strict";

function dbRouteFactory(router, knex, tableName) {

  router.get(`/api/${tableName}`, (request, response) => {
    const query = knex.select().from(tableName);
    for (const field of Object.Keys(req.query)) {
      query.where(field, req.query[field]);
    }
    query.then(results => results.json(results) );
  });

  router.get(`/api/${tableName}/id`, (request, response) => {
    knex
      .select()
      .from(tableName)
      .where('id', request.params.id)
      .then(results => response.json(results));
  });

  router.post(`/api/${tableName}`, (request, response) => {
    knex(tableName)
      .insert(request.body.serialize())
      .then((results) => { res.json(results); });
  });

  router.delete(`/api/${tableName}/:id`, (request, response) => {
    const query = knex(tableName).where({'id': req.params.id}).del();
    query.then((results) => { res.json(results); });
  });

  return router;
}
