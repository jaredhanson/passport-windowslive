/* global describe, it, before, expect */
/* jshint expr: true */

var Profile = require('../lib/profile')
  , fs = require('fs')


describe('Profile.parse', function() {
    
  describe('profile obtained from unknown source on unknown date', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/fixtures/roberto-tamburello.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
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
  });
  
});
