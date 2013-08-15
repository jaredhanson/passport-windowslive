/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Windows Live authentication strategy authenticates requests by delegating
 * to Windows Live using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
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
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://login.live.com/oauth20_authorize.srf';
  options.tokenURL = options.tokenURL || 'https://login.live.com/oauth20_token.srf';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'windowslive';
  this._userProfileURL = options.userProfileURL || 'https://apis.live.net/v5.0/me';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Windows Live.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `windowslive`
 *   - `id`               the user's Windows Live ID
 *   - `displayName`      the user's full name
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'windowslive' };
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

      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
