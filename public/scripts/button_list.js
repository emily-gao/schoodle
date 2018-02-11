$(function() {
  var maxFields = 5;
  var wrapper = $(".input-fields-wrap");
  var addButton = $(".add-field-button");

  var currentBoxes = 1;
  $(addButton).click(function(event) {
    event.preventDefault();
    if (currentBoxes < maxFields) {
      currentBoxes++;
      $(wrapper).append('<div><input class="options" type="text" name="option" required/><a href="#" class="remove_field">Remove</a></div>');
    }
  });

  $(wrapper).on("click", ".remove_field", function(event) {
    event.preventDefault();
    $(this).parent("div").remove();
    currentBoxes--;
  });
});
