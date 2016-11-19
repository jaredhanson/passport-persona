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
  
});
