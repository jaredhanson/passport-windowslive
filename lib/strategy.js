// Load modules.
var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , LiveConnectAPIError = require('./errors/liveconnectapierror');


/**
 * `Strategy` constructor.
 *
 * The Windows Live authentication strategy authenticates requests by delegating
 * to Windows Live using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Windows Live application's client ID
 *   - `clientSecret`  your Windows Live application's client secret
 *   - `callbackURL`   URL to which Windows Live will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new WindowsLiveStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/windowslive/callback'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://login.live.com/oauth20_authorize.srf';
  options.tokenURL = options.tokenURL || 'https://login.live.com/oauth20_token.srf';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'windowslive';
  this._userProfileURL = options.userProfileURL || 'https://apis.live.net/v5.0/me';
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);


/**
 * Return extra parameters to be included in the authorization request.
 *
 * Options:
 *  - `locale`    The display type to be used for the authorization page. 
 *                Valid values are "popup", "touch", "page", or "none".
 *  - `display`   Optional. A market string that determines how the consent UI 
 *                is localized. If the value of this parameter is missing or is
 *                not valid, a market value is determined by using an internal 
 *                algorithm.
 *                
 * @param {object} options
 * @return {object}
 * @access protected
 */
Strategy.prototype.authorizationParams = function(options) {
  var params = {};

  ['locale', 'display'].forEach(function(name) {
    if (options[name]) {
      params[name] = options[name]
    }
  });

  return params;
};

/**
 * Retrieve user profile from Windows Live.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `windowslive`
 *   - `id`               the user's Windows Live ID
 *   - `displayName`      the user's full name
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;
    
    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }
        
      if (json && json.error) {
        return done(new LiveConnectAPIError(json.error.message, json.error.code));
      }
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }
    
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }
    
    var profile = Profile.parse(json);
    profile.provider  = 'windowslive';
    profile._raw = body;
    profile._json = json;
    
    done(null, profile);
  });
};


// Expose constructor.
module.exports = Strategy;
