$(document).ready(function() {

  var maxFields = 5;
  var wrapper = $('#options-panel-body');
  var addButton = $(".add-field-button");

  function createOption() {
    var container = $('<div>');
    var anchor = $('<a>').addClass('remove-field btn-floating btn-tiny waves-effect waves-light green');
    var icon = $('<i>').addClass('material-icons md-18').text('remove');

    anchor.append(icon);
    container.append($('<label>').attr('for', 'option').text('Option'));
    container.append(anchor);
    container.append($('<input>').addClass('options').attr({ 'type': 'text', 'placeholder': 'option', 'name': 'option' }).prop('required', 'true'));

    return container;
  }


  var currentBoxes = 1;
  $(addButton).click(function(event) {
    event.preventDefault();
    if (currentBoxes < maxFields) {
      currentBoxes++;
      $('#options-panel-body').append(createOption());
    }
  });

  $(wrapper).on("click", ".remove-field", function(event) {
    event.preventDefault();
    $(this).parent('div').remove();
    currentBoxes--;
  });

});
