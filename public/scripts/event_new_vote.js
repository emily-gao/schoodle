$(function() {
  
  // On load
  
  $.ajax({
    method: "GET",
    url: "/session",
    success: function(user) {
      if (user) {
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
          url: '/events/:id',
          dataType: "JSON",
          success: function(results) {
            var currentUser = results.users.filter(function(arrUser) {return (arrUser.id === user.id); })[0];
            currentUser.votes.forEach(function(vote) {
              var event_option_id = vote.event_option_id;
              if (vote.isOK) {
                $('.new-vote-form')
                .find("[data-event_option=<%= event_option.id %>]")
                .prop('checked', true);
              }
            });
          }
        });
      }
    }
  });
  
  // $("#checkbox1").is(':checked', function(){
  //   $("#checkbox1").attr('value', 'true');
  // });
  
  $('.new-vote-form').on('submit', function(event) {
    event.preventDefault();
  
  });

  
});