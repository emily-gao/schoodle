$(function() {

  // On load
  var url = $("[name='url'").val();
  var flash = generateFlashFunction($('#appModal'));

  $(":checkbox").change(function() {
    $(this).val($(this).is(":checked"));
  });

  $.ajax({
    method: "GET",
    url: "/session",
    success: function(user) {
      if (!user) { return; }
      $('.new-vote-form')
        .find("[name='username']")
        .val(user.username)
        .prop('disabled', true);

      $('.new-vote-form')
        .find("[name='email']")
        .val(user.email)
        .prop('disabled', true);

      Materialize.updateTextFields();

      $.ajax({
        method: "GET",
        url: '/events/' + url,
        beforeSend: function(request) {
          request.setRequestHeader('Content-Type', 'application/json')
        },
        success: function(results) {
          var currentUser = results.users.filter(function(arrUser) { return (arrUser.id === user.id); })[0];
          if (currentUser) {
            currentUser.votes.forEach(function(vote) {
              var event_option_id = vote.event_option_id;
              if (vote.isOK) {
                $('.new-vote-form')
                  .find("[data-event_option='" + event_option_id + "']")
                  .prop('checked', true)
                  .trigger('change');
              }
            });
          } else {
            return;
          }
        }
      });
    }
  });

  // $("#checkbox1").is(':checked', function(){
  //   $("#checkbox1").attr('value', 'true');
  // });

  $('.new-vote-form').on('submit', function(event) {
    event.preventDefault();
    console.log('new-vote-form clicked');
    Promise.all([
      $.ajax({
        method: "GET",
        url: '/events/' + url,
        beforeSend: function(request) {
          request.setRequestHeader('Content-Type', 'application/json')
        }
      }),

      $.ajax({
        method: "GET",
        url: "/session"
      }).then(function(user) {
        if (user) { return user; }
        return $.ajax({
          method: "POST",
          url: "/api/users",
          data: $("[name='username'], [name='email']").serialize()
        }).then(function(userIds) {
          return $.ajax({
            method: 'POST',
            url: '/register',
            data: 'user_id=' + userIds[0]
          });
        });
      })

    ]).then(function(arr) {
      results = arr[0];
      user = arr[1];
      return Promise.all(results.event_options.map(function(event_option) {
        var currentUser = results.users.filter(function(userElement) { return (userElement.id === user.id); })[0];
        var userVote = undefined;
        if (currentUser) {
          userVote = currentUser.votes.filter(function(vote) { return vote.event_option_id === event_option.id; })[0];
        }
        if (currentUser && userVote) {
          console.log(userVote);
          return $.ajax({
            method: "PATCH",
            url: "/api/votes/" + userVote.id,
            data: "isOK=" + $('.new-vote-form').find("[data-event_option='" + event_option.id + "']").val()
          });
        } else {
          return $.ajax({
            method: "POST",
            url: "/api/votes",
            data: "user_id=" + user.id + "&event_option_id=" + event_option.id + "&isOK=" + $('.new-vote-form')
              .find("[data-event_option='" + event_option.id + "']").val()
          });
        }

      }));
    }).then(flash('Thanks for voting :)', 'Votes Saved'));

  });

});
