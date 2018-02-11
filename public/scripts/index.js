$(function() {

  // On load
  $.ajax({
    method: "GET",
    url: "/session",
    success: function(user) {
      if (user) {
        $('.new-schoodle-form')
          .find("[name='username']")
          .val(user.username)
          .prop('disabled', true);

        $('.new-schoodle-form')
          .find("[name='email']")
          .val(user.email)
          .prop('disabled', true);
      }
    }
  });

  // post new event info to the database in stages
  // tables by order: users, events, event_options

  $('.new-schoodle-form').on('submit', function(event) {
    event.preventDefault();

    $.ajax({
      method: "POST",
      url: "api/users",
      data: $("[name='username'], [name='email']").serialize(),
      success: function(user_id) {
        console.log(user_id);
        $.ajax({
          method: "POST",
          url: "/register",
          data: 'user_id=' + user_id
        });
      }
    }).then(function(user_id) {
      return $.ajax({
        method: "POST",
        url: "api/events",
        data: $("[name='event_name'], [name='description']").serialize() + '&organizer_id=' + user_id
      });
    }).then(function(event_id) {
      var options = $('.options').serialize().split('&');

      options.forEach(function(option) {
        $.ajax({
          method: "POST",
          url: "api/event_options",
          data: option + '&event_id=' + event_id
        });
      });
    });

  });
});
