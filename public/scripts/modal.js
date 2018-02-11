/**
 * Generate a function for flashing a message to the user
 *
 * The event handed to the callback is 'hidden.bs.modal'
 *
 * Example Usage:
 * >>> var flash = generateFlashFunction($('#appModal'));
 * >>> flash('hello world!', 'my title', myCallback);
 */
function generateFlashFunction($modalElement) {
  return function flashMessage(message, title, callback) {
    $modalElement.find('.modal-title').text(title || 'Hey there!');
    $modalElement.find('.modal-body').html(message);
    if (callback) {
      $modalElement.on('hidden.bs.modal', function(event) { callback(event); });
    } else {
      $modalElement.on('hidden.bs.modal', function(event) { location.reload(true); });
    }
    $modalElement.modal();
  };
}
