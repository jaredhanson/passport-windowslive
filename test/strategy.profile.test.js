/* global describe, it, expect, before */
/* jshint expr: true, multistr: true */

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
       "id": "8c8ce076ca27823f", \
       "name": "Roberto Tamburello", \
       "first_name": "Roberto", \
       "last_name": "Tamburello", \
       "link": "http://cid-8c8ce076ca27823f.profile.live.com/", \
       "birth_day": 20, \
       "birth_month": 4, \
       "birth_year": 2010, \
       "work": [ \
          { \
             "employer": { \
                "name": "Microsoft Corporation" \
             }, \
             "position": { \
                "name": "Software Development Engineer" \
             } \
          } \
       ], \
       "gender": "male", \
       "emails": { \
          "preferred": "Roberto@contoso.com", \
          "account": "Roberto@contoso.com", \
          "personal": "Roberto@fabrikam.com", \
          "business": "Robert@adatum.com", \
          "other": "Roberto@adventure-works.com" \
       }, \
       "addresses": { \
          "personal": { \
             "street": "123 Main St.", \
             "street_2": "Apt. A", \
             "city": "Redmond", \
             "state": "WA", \
             "postal_code": "12990", \
             "region": "United States" \
          }, \
          "business": { \
             "street": "456 Anywhere St.", \
             "street_2": "Suite 1", \
             "city": "Redmond", \
             "state": "WA", \
             "postal_code": "12399", \
             "region": "United States" \
          } \
       }, \
       "phones": { \
          "personal": "(555) 555-1212", \
          "business": "(555) 111-1212", \
          "mobile": null \
       }, \
       "locale": "en_US", \
       "updated_time": "2011-04-21T23:55:34+0000" \
    }';
  
    callback(null, body, undefined);
  };
    
  describe('loading profile', function() {
    var profile;
    
    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.provider).to.equal('windowslive');
      
      expect(profile.id).to.equal('8c8ce076ca27823f');
      expect(profile.displayName).to.equal('Roberto Tamburello');
      expect(profile.name.familyName).to.equal('Tamburello');
      expect(profile.name.givenName).to.equal('Roberto');
      
      expect(profile.emails).to.have.length(4);
      expect(profile.emails[0].value).to.equal('Roberto@contoso.com');
      expect(profile.emails[0].type).to.equal('account');
      expect(profile.emails[0].primary).to.be.true;
      expect(profile.emails[1].value).to.equal('Roberto@fabrikam.com');
      expect(profile.emails[1].type).to.equal('home');
      expect(profile.emails[1].primary).to.be.undefined;
      expect(profile.emails[2].value).to.equal('Robert@adatum.com');
      expect(profile.emails[2].type).to.equal('work');
      expect(profile.emails[2].primary).to.be.undefined;
      expect(profile.emails[3].value).to.equal('Roberto@adventure-works.com');
      expect(profile.emails[3].type).to.equal('other');
      expect(profile.emails[3].primary).to.be.undefined;
    });
    
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
    
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });
  
  describe('encountering an error', function() {
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('wrong-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
    });
    
    it('should not load profile', function() {
      expect(profile).to.be.undefined;
    });
  });
  
});
