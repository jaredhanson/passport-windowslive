var WindowsLiveStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {
    
  var strategy =  new WindowsLiveStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});
  
    // mock
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://apis.live.net/v5.0/me') { return callback(new Error('wrong url argument')); }
      if (accessToken != 'token') { return callback(new Error('wrong token argument')); }
      
      var body = '{ \
           "error": { \
              "code": "request_token_expired", \
              "message": "The provided access token has expired." \
           } \
        }';
    
      callback({ statusCode: 401, data: body });
    }
  
  describe('encountering an API error', function() {
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('LiveConnectAPIError');
      expect(err.message).to.equal('The provided access token has expired.');
      expect(err.code).to.equal('request_token_expired');
    });
    
    it('should not load profile', function() {
      expect(profile).to.be.undefined;
    });
  });
  
});
