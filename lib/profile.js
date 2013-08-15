/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {};
  profile.id = json.id;
  profile.username = json.username;
  profile.displayName = json.name;
  profile.name = { familyName: json.last_name,
                   givenName: json.first_name };
  
  if (json.emails) {
    profile.emails = [];
    
    if (json.emails.account) {
      profile.emails.push({ value: json.emails.account, type: 'account' });
    }
    if (json.emails.personal) {
      profile.emails.push({ value: json.emails.personal, type: 'home' });
    }
    if (json.emails.business) {
      profile.emails.push({ value: json.emails.business, type: 'work' });
    }
    if (json.emails.other) {
      profile.emails.push({ value: json.emails.other, type: 'other' });
    }
    
    if (json.emails.preferred) {
      for (var i = 0, len = profile.emails.length; i < len; ++i) {
        if (profile.emails[i].value == json.emails.preferred) {
          profile.emails[i].primary = true;
        }
      }
    }
  }
  
  profile.photos = [{
    value: 'https://apis.live.net/v5.0/' + json.id + '/picture'
  }];
  
  return profile;
};
