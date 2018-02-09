/**
 * Generate a function for flashing a message to the user
 *
 * Example Usage:
 * >>> var flash = generateFlashFunction($('#appModal'));
 * >>> flash('hello world!', 'my title');
 */
function generateFlashFunction($modalElement) {
  return function flashMessage(message, title) {
    $modalElement.find('.modal-title').text(title || 'Hey there!');
    $modalElement.find('.modal-body').html(message);
    $modalElement.modal();
  };
}
