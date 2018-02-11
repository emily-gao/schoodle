$(function() {
  
  // On load
  var url = $("[name='url'").val();
  
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
        dataType: "JSON",
        success: function(results) {
          console.log(results);
          var currentUser = results.users.filter(function(arrUser) {return (arrUser.id === user.id); })[0];
          currentUser.votes.forEach(function(vote) {
            var event_option_id = vote.event_option_id;
            if (vote.isOK) {
              $('.new-vote-form')
              .find("[data-event_option='<%= event_option.id %>']")
              .prop('checked', true);
            }
          });
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
        dataType: "JSON"
      }),

      $.ajax({
        method: "POST",
        url: "/api/users",
        data: $("[name='username'], [name='email']").serialize(),
        success: function(user_id) {
          return $.ajax({
            method: "POST",
            url: "/register",
            data: 'user_id=' + user_id
          });
        }
      })

    ]).then(function([results, user]) {
      
      console.log([results, user]);
      results.event_options.forEach(function(event_option) {
        $.ajax({
          method: "POST",
          url: "/api/votes",
          data: "user_id=" + user.id + "&" + "event_option_id=" + event_option.id
        });
      })

    })
  
  });
 
});