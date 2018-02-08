# Schoodle

[Doodle](https://doodle.com/) is great for scheduling events within a group. Your job is to create a simpler, more modern version of it.

## Requirements

Visitors can create an event proposal in much the same way as Doodle, by specifying:

- event title and description
- their own name and email
- organizers can then send the unique URL to possible attendees via their own communication workflow (email, Slack, Messenger, etc.)
- attendees visit the unique URL and:
- specify their name and email
- specify their availability (yes/no only) for each possible time slot
- view all responses including their own
- modify their response
- the unique URL should be secret and thus not use a simple auto-incrementing integer but instead a larger ID that is harder to guess (much like how secret gists work on GitHub)

**Note:** this app does not follow the typical user authentication process: users don't need to register or log in and the only way to access the Schoodles is via links

## Extensions

- email notify the event creator every time they receive a new response, with details about what was selected
- ability to invite participants when creating the event (much like step 4 when creating an event in Doodle)
- user authentication (not needed for core functionality)