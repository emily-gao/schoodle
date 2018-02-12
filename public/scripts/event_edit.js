$(document).ready(function() {

  var url = $("[name='url'").val();
  $.ajax({
    method: 'GET',
    url: '/events/' + url,
    beforeSend: function(request) {
      request.setRequestHeader('Content-Type', 'application/json')
    },
    success: function(results) {
      console.log('*******results**********');
      console.log(results.event.event_name);
      $('#event_name')
      .val(results.event.event_name);

      $('#event_description')
      .val(results.event.description);

      results.event_options.forEach(function(event_option) {
        $('.event-edit')
        .find("[data-event_option='"+ event_option.id + "']")
        .val(event_option.option);
      });
    }
  });

  // var maxFields = 5;
  // var wrapper = $(".input-fields-wrap");
  // var addButton = $(".add-field-button");

  // var currentBoxes = $("[name='count'").val();

  // $(addButton).click(function(event) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   if (currentBoxes < maxFields) {
  //     currentBoxes++;
  //     $(wrapper).append('<div><input class="options" type="text" name="option" required/><a class="remove-field btn-floating btn-small waves-effect waves-light green"><i class="material-icons">remove</i></a></div>');
  //   }
  // });

  // $(wrapper).on("click", ".remove_field", function(event) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   console.log('***********remove***************')
  //   $(this).parent("div").remove();
  //   currentBoxes--;
  // });

  var flash = generateFlashFunction($('#appModal'));

  $('.event-edit').on('submit', function(event) {
    event.preventDefault();
    console.log('***************event-edit clicked*******************');

    $.ajax({
      method: 'GET',
      url: '/events/' + url,
      beforeSend: function(request) {
        request.setRequestHeader('Content-Type', 'application/json')
      }
    }).then(function(results) {
      console.log(results);
      $.ajax({
        method: 'PATCH',
        url: '/api/events/' + results.event.id,
        data: $("[name='event_name'], [name='description']").serialize()
      });

      results.event_options.forEach(function(event_option) {
        if (!$("[data-event_option='" + event_option.id + "']")) {
          $.ajax({
            method: 'DELETE',
            url: '/api/event_options/' + event_option.id,
          });
        } else {
          $.ajax({
            method: 'PATCH',
            url: '/api/event_options/' + event_option.id,
            data: $("[data-event_option='" + event_option.id + "']").serialize()
          });
        }
        flash('Your event information has been updated', 'Update Successful');
      });
    });
  });

});
