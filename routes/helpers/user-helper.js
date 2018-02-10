const internalApiCall = require('./helpers/internal-api-call-helper');

module.exports = {
  
  isUserOrganizer: function(event, req) {
    if (!req.session || !req.session.user_id || (req.session.user_id !== event.organizer_id)) {
      return false;
    } else {
      return true;
    }
  },

  isUserSessionPresent: function(req) {
    if (!req.session || !req.session.user_id) {
      return false;
    }
    const queryParams = { user_id: req.session.user_id};
    internalApiCall(users, queryParams)
      .then(results => results.length !== 0);
  }

};
