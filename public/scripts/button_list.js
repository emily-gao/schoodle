$(document).ready(function() {
  $(function() {
    var maxFields = 5;
    var wrapper = $(".input-fields-wrap");
    var addButton = $(".add-field-button");

    var currentBoxes = 1;
    $(addButton).click(function(event) {
      event.preventDefault();
      if (currentBoxes < maxFields) {
        currentBoxes++;
        $(this).before('<div><input class="options" type="text" name="option" required/><a class="remove-field btn-floating btn-small waves-effect waves-light green"><i class="material-icons">remove</i></a></div>');
      }
    });

    $(wrapper).on("click", ".remove-field", function(event) {
      event.preventDefault();
      $(this).parent("div").remove();
      currentBoxes--;
    });
  });
});
