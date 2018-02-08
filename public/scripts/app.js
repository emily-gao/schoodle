$(function() {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done(function(users) {
    users.forEach(function(user) {
      $("<div>").text(user.name).appendTo($("body"));
    });
  });
});
