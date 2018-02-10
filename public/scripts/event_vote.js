$(document).ready(function() {
  $('.event-vote').on('click', function (event) {
    $(this).toggleClass('btn-success btn-danger');
    $(this).find('i.yes').toggle();
    $(this).find('i.no').toggle();
  });
});
