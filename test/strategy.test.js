var PersonaStrategy = require('../lib/strategy');
var events = require('events');
var util = require('util');
var chai = require('chai');
var VerificationError = require('../lib/errors/verificationerror');


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
  
  describe('constructed without a verify callback', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new PersonaStrategy({
          audience: 'https://www.example.com'
        });
      }).to.throw(TypeError, 'PersonaStrategy requires a verify callback');
    });
  }); // without a verify callback
  
  describe('constructed without an audience option', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new PersonaStrategy({
        }, function() {});
      }).to.throw(TypeError, 'PersonaStrategy requires an audience option');
    });
  }); // without a verify callback
  
  describe('handling a request with an assertion that is verified by email', function() {
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
    
    
    var user
      , info;
    
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

    it('should yield user', function() {
      expect(user).to.be.an.object;
      expect(user.email).to.equal('johndoe@example.net');
    });
    
    it('should not yield info', function() {
      expect(info).to.be.undefined;
    });
  }); // handling a request with an assertion that is verified by email
  
  describe('handling a request with an assertion that is verified by email and issuer', function() {
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
      function(email, issuer, done) {
        done(null, { email: email, issuer: issuer });
      }
    );
    
    
    var user
      , info;
    
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

    it('should yield user', function() {
      expect(user).to.be.an.object;
      expect(user.email).to.equal('johndoe@example.net');
      expect(user.issuer).to.equal('login.persona.org');
    });
    
    it('should not yield info', function() {
      expect(info).to.be.undefined;
    });
  }); // handling a request with an assertion that is verified by email and issuer
  
  describe('handling a request with an assertion that is verified by email and yeilds info', function() {
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
        done(null, { email: email }, { message: 'Welcome!' });
      }
    );
    
    
    var user
      , info;
    
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

    it('should yield user', function() {
      expect(user).to.be.an.object;
      expect(user.email).to.equal('johndoe@example.net');
    });
    
    it('should yeild info', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Welcome!');
    });
  }); // handling a request with an assertion that is verified by email and yeilds info
  
  describe('handling a request with an assertion that is verified by email, in passReqToCallbackMode', function() {
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
        passReqToCallback: true,
        transport: mockhttps
      },
      function(req, email, done) {
        if (req.method != 'GET') { return done(new Error('incorrect req argument')); }
        
        done(null, { email: email });
      }
    );
    
    
    var user
      , info;
    
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

    it('should yield user', function() {
      expect(user).to.be.an.object;
      expect(user.email).to.equal('johndoe@example.net');
    });
    
    it('should not yield info', function() {
      expect(info).to.be.undefined;
    });
  }); // handling a request with an assertion that is verified by email, in passReqToCallbackMode
  
  describe('handling a request with an assertion that is verified by email and issuer, in passReqToCallbackMode', function() {
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
        passReqToCallback: true,
        transport: mockhttps
      },
      function(req, email, issuer, done) {
        if (req.method != 'GET') { return done(new Error('incorrect req argument')); }
        
        done(null, { email: email, issuer: issuer });
      }
    );
    
    
    var user
      , info;
    
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

    it('should yield user', function() {
      expect(user).to.be.an.object;
      expect(user.email).to.equal('johndoe@example.net');
      expect(user.issuer).to.equal('login.persona.org');
    });
    
    it('should not yield info', function() {
      expect(info).to.be.undefined;
    });
  }); // handling a request with an assertion that is verified by email, in passReqToCallbackMode
  
  describe('handling a request that fails identity verification', function() {
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
    
    
    var user
      , info;
    
    var strategy = new PersonaStrategy({
        audience: 'https://www.example.com',
        transport: mockhttps
      },
      function(email, done) {
        done(null, false);
      }
    );
    
    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i) {
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
    
    it('should not yield info', function() {
      expect(info).to.be.undefined;
    });
  }); // handling a request that fails identity verification
  
  describe('handling a request that fails identity verification and yeilds info', function() {
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
    
    
    var user
      , info;
    
    var strategy = new PersonaStrategy({
        audience: 'https://www.example.com',
        transport: mockhttps
      },
      function(email, done) {
        done(null, false, { message: 'Invite required' });
      }
    );
    
    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i) {
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
    
    it('should yeild info', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Invite required');
    });
  }); // handling a request that fails identity verification and yeilds info
  
  describe('handling a request that encounters an error during identity verification', function() {
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
        done(new Error('something went wrong'));
      }
    );
    
    
    var error
      , user
      , info;
    
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
          error = err;
          done();
        })
        .authenticate();
    });

    it('should error', function() {
      expect(error).to.be.an.instanceof(Error)
      expect(error.message).to.equal('something went wrong')
    });

    it('should not yield user', function() {
      expect(user).to.be.undefined;
    });
    
    it('should not yeild info', function() {
      expect(info).to.be.undefined;
    });
  }); // handling a request that encounters an error during identity verification
  
  describe('handling a request with an assertion that fails remote verification', function() {
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
            status: 'failure',
            reason: 'need assertion and audience' })
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
    
    
    var error
      , user
      , info;
    
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
          error = err;
          done();
        })
        .authenticate();
    });

    it('should error', function() {
      expect(error).to.be.an.instanceof(Error)
      expect(error).to.be.an.instanceof(VerificationError)
      expect(error.message).to.equal('need assertion and audience')
    });

    it('should not yield user', function() {
      expect(user).to.be.undefined;
    });
    
    it('should not yeild info', function() {
      expect(info).to.be.undefined;
    });
  }); // handling a request with an assertion that fails remote verification
  
  describe('handling a request with an assertion that fails remote verification due to audience mismatch', function() {
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
            status: 'failure',
            reason: 'audience mismatch: domain mismatch' })
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
    
    
    var error
      , user
      , info;
    
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
          error = err;
          done();
        })
        .authenticate();
    });

    it('should error', function() {
      expect(error).to.be.an.instanceof(Error)
      expect(error).to.be.an.instanceof(VerificationError)
      expect(error.message).to.equal('audience mismatch: domain mismatch')
    });

    it('should not yield user', function() {
      expect(user).to.be.undefined;
    });
    
    it('should not yeild info', function() {
      expect(info).to.be.undefined;
    });
  }); // handling a request with an assertion that fails verification due to audience mismatch
  
  describe('handling a request with an assertion that fails remote verification due to expired assertion', function() {
    var mockhttps = {
      request : function(options, callback) {
        var req = new MockRequest();
        var res = new MockResponse();
        
        req.on('end', function(data, encoding) {
          if (options.method !== 'POST') { return res.emit('error', new Error('incorrect options.method argument')); }
          if (options.headers['Content-Type'] !== 'application/x-www-form-urlencoded') { return res.emit('error', new Error('incorrect options.headers argument')); }
          if (options.headers['Content-Length'] !== 70) { return res.emit('error', new Error('incorrect options.headers argument')); }
          if (data !== 'assertion=secret-assertion-data&audience=https%3A%2F%2Fwww.example.com') { return res.emit('error', new Error('incorrect data argument')); }
          
          res.emit('data', JSON.stringify({ status: 'failure', reason: 'assertion has expired' })
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
    
    
    var error
      , user
      , info;
    
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
          error = err;
          done();
        })
        .authenticate();
    });

    it('should error', function() {
      expect(error).to.be.an.instanceof(Error)
      expect(error).to.be.an.instanceof(VerificationError)
      expect(error.message).to.equal('assertion has expired')
    });

    it('should not yield user', function() {
      expect(user).to.be.undefined;
    });
    
    it('should not yeild info', function() {
      expect(info).to.be.undefined;
    });
  }); // handling a request with an assertion that fails verification due to expired assertion
  
  describe('encountering a error while requesting remote verification', function() {
    var mockhttps = {
      request : function(options, callback) {
        var req = new MockRequest();
        var res = new MockResponse();
        
        req.on('end', function(data, encoding) {
          if (options.method !== 'POST') { return res.emit('error', new Error('incorrect options.method argument')); }
          if (options.headers['Content-Type'] !== 'application/x-www-form-urlencoded') { return res.emit('error', new Error('incorrect options.headers argument')); }
          if (options.headers['Content-Length'] !== 70) { return res.emit('error', new Error('incorrect options.headers argument')); }
          if (data !== 'assertion=secret-assertion-data&audience=https%3A%2F%2Fwww.example.com') { return res.emit('error', new Error('incorrect data argument')); }
          
          var err = new Error('getaddrinfo ENOTFOUND verifier.login.persona.org verifier.login.persona.org:443');
          err.code = 'ENOTFOUND';
          err.errno = 'ENOTFOUND';
          err.syscall = 'getaddrinfo';
          err.hostname = 'verifier.login.persona.org';
          err.host = 'verifier.login.persona.org';
          err.port = 443;
          res.emit('error', err);
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
    
    
    var error
      , user
      , info;
    
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
          error = err;
          done();
        })
        .authenticate();
    });

    it('should error', function() {
      expect(error).to.be.an.instanceof(Error)
      expect(error.message).to.equal('getaddrinfo ENOTFOUND verifier.login.persona.org verifier.login.persona.org:443');
      expect(error.code).to.equal('ENOTFOUND');
    });

    it('should not yield user', function() {
      expect(user).to.be.undefined;
    });
    
    it('should not yeild info', function() {
      expect(info).to.be.undefined;
    });
  }); // encountering a error while requesting remote verification
  
  describe('encountering an unexpected response from remote verification', function() {
    var mockhttps = {
      request : function(options, callback) {
        var req = new MockRequest();
        var res = new MockResponse();
        
        req.on('end', function(data, encoding) {
          if (options.method !== 'POST') { return res.emit('error', new Error('incorrect options.method argument')); }
          if (options.headers['Content-Type'] !== 'application/x-www-form-urlencoded') { return res.emit('error', new Error('incorrect options.headers argument')); }
          if (options.headers['Content-Length'] !== 70) { return res.emit('error', new Error('incorrect options.headers argument')); }
          if (data !== 'assertion=secret-assertion-data&audience=https%3A%2F%2Fwww.example.com') { return res.emit('error', new Error('incorrect data argument')); }
          
          res.emit('data', '<html>\
<head><title>411 Length Required</title></head> \
<body bgcolor="white"> \
<center><h1>411 Length Required</h1></center> \
<hr><center>nginx/0.7.65</center> \
</body> \
</html>');
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
    
    
    var error
      , user
      , info;
    
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
          error = err;
          done();
        })
        .authenticate();
    });

    it('should error', function() {
      expect(error).to.be.an.instanceof(Error)
      expect(error.message).to.equal('Failed to parse verification response')
    });

    it('should not yield user', function() {
      expect(user).to.be.undefined;
    });
    
    it('should not yeild info', function() {
      expect(info).to.be.undefined;
    });
  }); // encountering an unexpected response from remote verification
  
  describe('handling a request without body', function() {
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
        done(new Error('something went wrong'));
      }
    );
    
    
    var info, status;
    
    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i, s) {
          info = i;
          status = s;
          done();
        })
        .req(function(req) {
        })
        .error(function(err) {
          done(err);
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing assertion');
      expect(status).to.equal(400);
    });
  }); // handling a request without body
  
  describe('handling a request without assertion', function() {
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
        done(new Error('something went wrong'));
      }
    );
    
    
    var info, status;
    
    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i, s) {
          info = i;
          status = s;
          done();
        })
        .req(function(req) {
          req.body ={};
        })
        .error(function(err) {
          done(err);
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing assertion');
      expect(status).to.equal(400);
    });
  }); // handling a request without assertion
  
});
