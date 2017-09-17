# passport-persona

[![Build](https://img.shields.io/travis/jaredhanson/passport-persona.svg)](https://travis-ci.org/jaredhanson/passport-persona)
[![Coverage](https://img.shields.io/coveralls/jaredhanson/passport-persona.svg)](https://coveralls.io/r/jaredhanson/passport-persona)
[![Quality](https://img.shields.io/codeclimate/github/jaredhanson/passport-persona.svg?label=quality)](https://codeclimate.com/github/jaredhanson/passport-persona)
[![Dependencies](https://img.shields.io/david/jaredhanson/passport-persona.svg)](https://david-dm.org/jaredhanson/passport-persona)


[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Mozilla Persona](https://login.persona.org/).

This module lets you authenticate using Mozilla Persona in your Node.js
applications.  By plugging into Passport, Persona authentication can be easily
and unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

Persona is a fallback Identity Provider for the [BrowserID](https://developer.mozilla.org/en-US/docs/Mozilla/Persona)
protocol, a distributed login system from [Mozilla](http://www.mozilla.org/).
This strategy verifies assertions using Mozilla's [Remote Verification API](https://developer.mozilla.org/en-US/docs/Mozilla/Persona/Remote_Verification_API).
Applications wishing to verify assertions locally should use
[passport-browserid](https://github.com/jaredhanson/passport-browserid).

## Install

    $ npm install passport-persona

## Usage

#### Configure Strategy

The Persona authentication strategy authenticates users using an assertion of
email address ownership, obtained via the [navigator.id](https://developer.mozilla.org/en-US/docs/Web/API/navigator.id)
JavaScript API.  The strategy requires a `verify` callback, which accepts an
email address and calls `cb` providing a user.

    passport.use(new PersonaStrategy({
        audience: 'http://www.example.com'
      },
      function(email, cb) {
        User.findByEmail({ email: email }, function (err, user) {
          return cb(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'persona'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.post('/auth/browserid', 
      passport.authenticate('persona', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [signin example](https://github.com/jaredhanson/passport-persona/tree/master/examples/signin).

## Contributing

#### Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

All new feature development is expected to have test coverage.  Patches that
increse test coverage are happily accepted.  Coverage reports can be viewed by
executing:

```bash
$ make test-cov
$ make view-cov
```

## Support

#### Funding

This software is provided to you as open source, free of charge.  The time and
effort to develop and maintain this project is volunteered by [@jaredhanson](https://github.com/jaredhanson).
If you (or your employer) benefit from this project, please consider a financial
contribution.  Your contribution helps continue the efforts that produce this
and other open source software.

Funds are accepted via [PayPal](https://paypal.me/jaredhanson), [Venmo](https://venmo.com/jaredhanson),
and [other](http://jaredhanson.net/pay) methods.  Any amount is appreciated.

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)
  - [Leo McArdle](https://github.com/LeoMcA)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2016 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/vK9dyjRnnWsMzzJTQ57fRJpH/jaredhanson/passport-persona'>  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/vK9dyjRnnWsMzzJTQ57fRJpH/jaredhanson/passport-persona.svg' /></a>
