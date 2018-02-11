$(document).ready(function() {

  function refreshChoices($element) {
    var isAlreadyYes = $element.hasClass('btn-success');

    $('eventChoices').data('current-choice', $element.data('event-option-id'));
    $('.event-choice').removeClass('btn-success').addClass('btn-danger');
    $('.event-choice').find('i.yes').hide();
    $('.event-choice').find('i.no').show();

    $element.toggleClass('btn-success', !isAlreadyYes).toggleClass('btn-danger', isAlreadyYes);
    $element.find('i.yes').toggle(!isAlreadyYes);
    $element.find('i.no').toggle(isAlreadyYes);
  }

  $('.event-choice').on('click', function(event) { refreshChoices($(this)); });
  var currentChoiceId = $('eventChoices').data('current-choice');
  if (currentChoiceId) {
    var currentChoiceButton = $('.event-choice[data-event-option-id=' + currentChoiceId + ']');
    refreshChoices(currentChoiceButton);
  }

  var flash = generateFlashFunction($('#appModal'));
  $('#notify').on('click', function(event) {
    event.preventDefault();
    flash('Message: Notifying Guests', 'Notification Title');
  });
});
