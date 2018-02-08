# Routing Strategy

- One /api/<resource> for every public table

- GET /<resource> returns all the records for that table (SELECT * FROM <resource>)

  - GET /<resource>?field=value filters the results from get (SELECT * FROM resource WHERE field = value;)


  - Include 'one-hop' of related tables - records that it is attached to via pkey/fkey relationships

- POST /<resource> creates a new record in that table

- PUT /<resource>/:id overwrites an existing record

- DELETE /<resource>/:id deletes a resource instance

# Needed Routes

- /events
  - POST - create an event
  - GET - Page to create a form
- /events?organizer_id=foo
  - GET - show all the events for a given organizer
- /events/:id - 
  - PATCH - editing an existing event
  - GET - View an existing event
- /votes/
  - GET - view all votes
  - POST - create a new vote
- /votes?event_option_id=foo
  - GET - view all the votes for a given event_option 'foo'
- /votes?event_option_id=foo&guest_id=bar
  - GET - get the vote for a given option and guest
- /votes/:id
  - GET - get the info for a single vote
  - PATCH - edit
  - DELETE - 
- /event_options/
  - GET - list out all the event options
- /event_options?event_id=foo
  - GET all the event options with event_id = 'foo'
- /event_options/:event_options_id
  - GET
  - POST
- /guests
  - GET - list all guests
  - POST - create a new guest
- /guest/:id
  - GET - View the info for a single guest
  - PATCH - edit.   (Stretch)