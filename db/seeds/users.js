exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return knex('users')
        .returning('id')
        .insert([{username: 'Alice'}, {username: 'Bob'}, {username: 'Charlie'}])
        .then(function(userIds) { console.log(userIds);
          return knex('events')
            .returning('id')
            .insert({event_name: 'hello', description: 'world', organizer_id: userIds[0]})
            .then(function(eventIds) { console.log(eventIds);
              return knex('event_options')
                .returning('id')
                .insert([{event_id: eventIds[0], option:'Happy'}, {event_id: eventIds[0], option:'Sad'}])
                .then(function(optionIds) { console.log(optionIds);
                  return knex('votes')
                    .insert([
                      {isOK: true, user_id: userIds[1], event_option_id: optionIds[0]},
                      {isOK: true, user_id: userIds[1], event_option_id: optionIds[1]},
                      {isOK: true, user_id: userIds[2], event_option_id: optionIds[0]},
                      {isOK: true, user_id: userIds[2], event_option_id: optionIds[1]}
                    ]);
                });
            });
        });
    });
};
