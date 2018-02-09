$(document).ready(function() {
  $('.event-choice').on('click', function (event) {
    $('.event-choice').removeClass('btn-success').addClass('btn-danger');
    $('.event-choice').find('i.yes').hide();
    $('.event-choice').find('i.no').show();

    $(this).addClass('btn-success').removeClass('btn-danger');
    $(this).find('i.yes').show();
    $(this).find('i.no').hide();
  });
});
