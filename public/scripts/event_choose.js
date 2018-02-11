$(document).ready(function() {
  var flash = generateFlashFunction($('#appModal'));
  var container = $('#eventChoices');
  var choices = $('.event-choice');
  var eventId = container.data('event-id');
  var storedChoice = container.data('stored-choice');

  function currentChoice () {
    return choices.find('i.yes:visible').parent().data('event-option-id');
  }


  function refreshChoices($element) {
    var isAlreadyYes = $element.hasClass('btn-success');

    choices.removeClass('btn-success').addClass('btn-danger');
    choices.find('i.yes').hide();
    choices.find('i.no').show();

    $element.toggleClass('btn-success', !isAlreadyYes).toggleClass('btn-danger', isAlreadyYes);
    $element.find('i.yes').toggle(!isAlreadyYes);
    $element.find('i.no').toggle(isAlreadyYes);
  }

  choices.on('click', function(event) { refreshChoices($(this)); });

  if (storedChoice !== "none") {
    var currentChoiceButton = choices.filter('[data-event-option-id=' + storedChoice + ']');
    refreshChoices(currentChoiceButton);
  }

  $('#notify').on('click', function(event) {
    event.preventDefault();
    if (currentChoice()){
      $.ajax({
        method: 'patch',
        url: '/api/events/' + eventId,
        data: $.param({'final_decision_id': currentChoice()}),
        success: flash('Choice saved! The invitations should be going out soon', 'Choice Made')
      });
    } else {
      flash('Please make a choice notifying guests', 'Oops', function(event) { return; });
    }
  });
});
