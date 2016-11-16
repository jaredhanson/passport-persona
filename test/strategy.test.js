var PersonaStrategy = require('../lib/strategy');


describe('Strategy', function() {
  
  describe('constructed', function() {
    var strategy = new PersonaStrategy({
      audience: 'https://www.example.com'
    }, function() {});
    
    it('should be named persona', function() {
      expect(strategy.name).to.equal('persona');
    });
  })
  
});
