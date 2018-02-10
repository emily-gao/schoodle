$(function() {
  
  var max_fields      = 5; //maximum input boxes allowed
  var wrapper         = $(".input-fields-wrap"); //Fields wrapper
  var add_button      = $(".add-field-button"); //Add button ID
  
  var x = 1; //initial text box count
  $(add_button).click(function(event){ //on add input button click
    event.preventDefault();
    if(x < max_fields){ //max input box allowed
      x++; //text box increment
      $(wrapper).append('<div><input class="options" type="text" name="option"/><a href="#" class="remove_field">Remove</a></div>'); //add input box
    }
  });
  
  $(wrapper).on("click",".remove_field", function(event){ //user click on remove text
    event.preventDefault(); 
    $(this).parent("div").remove(); 
    x--;
  })
  
  // post new event info to the database in stages
  // tables by order: users, events, event_options
  $('.new-schoodle').click(function(event) {
    event.preventDefault();

    $.ajax({
      method: "POST",
      url: "api/users",
      data: $("[name='username']").serialize()
    }).then(function(user_id) {  
      return $.ajax({
        method: "POST",
        url: "api/events",
        data: $("[name='event_name'], [name='description']").serialize() + `&organizer_id=${user_id}`
      });
    }).then(function(event_id) {
      var options = $('.options').serialize().split('&');

      options.forEach(option => {
        $.ajax({
          method: "POST",
          url: "api/event_options",
          data: option + `&event_id=${event_id}`
        });
      });
    });

    $.ajax({
      method: "POST",
      url: "/events",
      data: $("[name='username']").serialize()
    });
 
  });
  
});
