$(document).ready(function() {

  function refreshChoices($element) {
    $('eventChoices').data('current-choice', $element.data('event-option-id'));
    $('.event-choice').removeClass('btn-success').addClass('btn-danger');
    $('.event-choice').find('i.yes').hide();
    $('.event-choice').find('i.no').show();

    $element.addClass('btn-success').removeClass('btn-danger');
    $element.find('i.yes').show();
    $element.find('i.no').hide();
  }

  $('.event-choice').on('click', function(event) { refreshChoices($(this)); });
  var currentChoiceId = $('eventChoices').data('current-choice');
  if (currentChoiceId) {
    var currentChoiceButton = $('.event-choice[data-event-option-id=' + currentChoiceId + ']');
    refreshChoices(currentChoiceButton);
  }
});
