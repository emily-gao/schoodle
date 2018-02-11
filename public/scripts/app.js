$(function() {

  $.ajax({
    method: "GET",
    url: "/session",
    success: function(userName) {
      if (userName) { $.data(document.body, 'userName', userName.value); }
    }
  });


  $('.new-votes').click(function(event) {
    event.preventDefault();

    // when valid user_id cookie is not present
    $.ajax({
      method: "POST",
      url: "api/users",
      data: $("[name='username'], [name='email']").serialize(),
      success: function(user_id) {
        $.ajax({
          method: "POST",
          url: "/register",
          data: 'user_id=' + user_id
        });
      }
    }).then(function(user_id) {
      $.ajax({
        method: "POST",
        url: "api/votes",
        data: $()
      });
    })

  });

});
