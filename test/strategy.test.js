var WindowsLiveStrategy = require('../lib/strategy');


describe('Strategy', function() {
    
  var strategy = new WindowsLiveStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});
    
  it('should be named windowslive', function() {
    expect(strategy.name).to.equal('windowslive');
  });
  
});
