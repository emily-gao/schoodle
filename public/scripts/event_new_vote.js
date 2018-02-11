$(function() {

  // On load
  var url = $("[name='url'").val();
  var flash = generateFlashFunction($('#appModal'));

  $(":checkbox").change(function(){
    $(this).val($(this).is(":checked") ? true : false);
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

      $.ajax({
        method: "GET",
        url: '/events/' + url,
        beforeSend: function(request) {
          request.setRequestHeader('Content-Type', 'application/json')
        },
        success: function(results) {
          var currentUser = results.users.filter(function(arrUser) {return (arrUser.id === user.id); })[0];
          if (currentUser) {
            currentUser.votes.forEach(function(vote) {
              var event_option_id = vote.event_option_id;
              if (vote.isOK) {
                $('.new-vote-form')
                .find("[data-event_option='"+ event_option_id + "']")
                .prop('checked', true);
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

    ]).then(function([results, user]) {
      results.event_options.forEach(function(event_option) {
        var currentUser = results.users.filter(function(arrUser) {return (arrUser.id === user.id); })[0];
        if (currentUser && currentUser.votes.map(function(option) {return option.event_option_id}).includes(event_option.id)) {
          currentUser.votes.forEach(function(vote) {
            $.ajax({
              method: "PATCH",
              url: "/api/votes/" + vote.id,
              data: "isOK=" + $('.new-vote-form').find("[data-event_option='"+ event_option.id + "']").val()
            });
          });
        } else {
          $.ajax({
            method: "POST",
            url: "/api/votes",
            data: "user_id=" + user.id + "&event_option_id=" + event_option.id + "&isOK=" + $('.new-vote-form')
            .find("[data-event_option='"+ event_option.id + "']").val()
          });
        }

      });

    }).then(flash('Thanks for voting :)', 'Votes Saved'));

  });

});
