const internalApiCall = require('./internal-api-call-helper');

module.exports = {

  isUserOrganizer: function(event, req) {
    if (!req.session || !req.session.user_id || (req.session.user_id !== event.organizer_id)) {
      return false;
    } else {
      return true;
    }
  },

  isUserSessionPresent: function(req, callback) {
    if (!req.session || !req.session.user_id) {
      return false;
    }
    const queryParams = { id: req.session.user_id };
    internalApiCall('users', queryParams)
      .then(results => {
        if (results.length === 0) {
          callback(false);
        } else {
          callback({
            username: results[0].username,
            email: results[0].email
          });
        }
      });
  }
    
};