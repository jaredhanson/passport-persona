var PersonaStrategy = require('../lib/strategy');
var events = require('events');
var util = require('util');
var chai = require('chai');


/* MockRequest */

function MockRequest() {
  events.EventEmitter.call(this);
};

util.inherits(MockRequest, events.EventEmitter);

MockRequest.prototype.end = function(data, encoding) {
  this.emit('end', data, encoding);
}

/* MockResponse */

function MockResponse() {
  events.EventEmitter.call(this);
};

util.inherits(MockResponse, events.EventEmitter);




describe('Strategy', function() {
  
  describe('constructed', function() {
    var strategy = new PersonaStrategy({
      audience: 'https://www.example.com'
    }, function() {});
    
    it('should be named persona', function() {
      expect(strategy.name).to.equal('persona');
    });
  });
  
  describe('handling a request with an assertion that is verified', function() {
    var mockhttps = {
      request : function(options, callback) {
        var req = new MockRequest();
        var res = new MockResponse();
        
        req.on('end', function(data, encoding) {
          if (options.method !== 'POST') { return res.emit('error', new Error('incorrect options.method argument')); }
          if (options.headers['Content-Type'] !== 'application/x-www-form-urlencoded') { return res.emit('error', new Error('incorrect options.headers argument')); }
          if (options.headers['Content-Length'] !== 70) { return res.emit('error', new Error('incorrect options.headers argument')); }
          if (data !== 'assertion=secret-assertion-data&audience=https%3A%2F%2Fwww.example.com') { return res.emit('error', new Error('incorrect data argument')); }
          
          res.emit('data', JSON.stringify({
            status: 'okay',
            email: 'johndoe@example.net',
            audience: 'https://www.example.com',
            expires: 1322080163206,
            issuer: 'login.persona.org' })
          );
          res.emit('end');
        })
        
        callback(res);
        return req;
      }
    }
    
    var strategy = new PersonaStrategy({
        audience: 'https://www.example.com',
        transport: mockhttps
      },
      function(email, done) {
        done(null, { email: email });
      }
    );
    
    before(function(done) {
      chai.passport.use(strategy)
        .success(function(u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body['assertion'] = 'secret-assertion-data';
        })
        .error(function(err) {
          done(err);
        })
        .authenticate();
    });

    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.email).to.equal('johndoe@example.net');
    });
    
  });
  
});
