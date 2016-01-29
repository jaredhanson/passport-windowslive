/* global describe, it, expect */
/* jshint expr: true */

var WindowsLiveStrategy = require('../lib/strategy')
  , chai = require('chai');


describe('Strategy', function() {
  
  describe('constructed', function() {
    var strategy = new WindowsLiveStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    
    it('should be named windowslive', function() {
      expect(strategy.name).to.equal('windowslive');
    });
  })
  
  describe('constructed with undefined options', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new WindowsLiveStrategy(undefined, function(){});
      }).to.throw(Error);
    });
  })
  
  describe('authorization request with parameters', function() {
    var strategy = new WindowsLiveStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function() {});
    
    
    var url;
  
    before(function(done) {
      chai.passport.use(strategy)
        .redirect(function(u) {
          url = u;
          done();
        })
        .req(function(req) {
          req.session = {};
        })
        .authenticate({ locale: 'fr-CA', display: 'popup', ignore: 'this' });
    });
  
    it('should be redirected', function() {
      expect(url).to.equal('https://login.live.com/oauth20_authorize.srf?locale=fr-CA&display=popup&response_type=code&redirect_uri=&client_id=ABC123');
    });
  });
  
});
