const internalApiCall = require('./internal-api-call-helper');

module.exports = {
  
  isUserOrganizer: function(event, request) {
    if (!request.session || !request.session.user_id || (request.session.user_id !== event.organizer_id)) {
      return false;
    } else {
      return true;
    }
  },
  
  isUserSessionPresent: function(request, callback) {
    if (!request.session || !request.session.user_id) {
      console.log('*******************');
      callback(false);
    } else {
      const queryParams = { id: request.session.user_id };
      internalApiCall('users', queryParams)
      .then(results => {
        if (results.length === 0) {
          callback(false);
        } else {
          callback({
            id: results[0].id,
            username: results[0].username,
            email: results[0].email
          });
        }
      });
    }
  }
  
};