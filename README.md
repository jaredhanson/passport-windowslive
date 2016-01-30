# passport-windowslive

[![Build](https://img.shields.io/travis/jaredhanson/passport-windowslive.svg)](https://travis-ci.org/jaredhanson/passport-windowslive)
[![Coverage](https://img.shields.io/coveralls/jaredhanson/passport-windowslive.svg)](https://coveralls.io/r/jaredhanson/passport-windowslive)
[![Quality](https://img.shields.io/codeclimate/github/jaredhanson/passport-windowslive.svg?label=quality)](https://codeclimate.com/github/jaredhanson/passport-windowslive)
[![Dependencies](https://img.shields.io/david/jaredhanson/passport-windowslive.svg)](https://david-dm.org/jaredhanson/passport-windowslive)



[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Microsoft](http://www.microsoft.com/) accounts (aka [Windows Live](http://www.live.com/))
using the OAuth 2.0 API.

This module lets you authenticate using Windows Live in your Node.js
applications.  By plugging into Passport, Windows Live authentication can be
easily and unobtrusively integrated into any application or framework that
supports [Connect](http://www.senchalabs.org/connect/)-style middleware,
including [Express](http://expressjs.com/).

## Install

    $ npm install passport-windowslive

## Usage

#### Create an Application

Before using `passport-windowslive`, you must register an application with
Microsoft.  If you have not already done so, a new application can be created at
[Live Connect app management](https://account.live.com/developers/applications/index).
Your application will be issued a client ID and client secret, which need to be
provided to the strategy.  You will also need to configure a redirect URL which
matches the route in your application.

#### Configure Strategy

The Windows Live authentication strategy authenticates users using a Windows
Live account and OAuth 2.0 tokens.  The client ID and secret obtained when
creating an application are supplied as options when creating the strategy.  The
strategy also requires a `verify` callback, which receives the access token and
optional refresh token, as well as `profile` which contains the authenticated
user's Windows Live profile.  The `verify` callback must call `cb` providing a
user to complete authentication.

    passport.use(new WindowsLiveStrategy({
        clientID: WINDOWS_LIVE_CLIENT_ID,
        clientSecret: WINDOWS_LIVE_CLIENT_SECRET,
        callbackURL: "http://www.example.com/auth/windowslive/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ windowsliveId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'windowslive'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/windowslive',
      passport.authenticate('windowslive', { scope: ['wl.signin', 'wl.basic'] }));

    app.get('/auth/windowslive/callback', 
      passport.authenticate('windowslive', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-facebook-example)
as a starting point for their own web applications.  The example shows how to
authenticate users using Facebook.  However, because both Facebook and Windows
Live use OAuth 2.0, the code is similar.  Simply replace references to Facebook
with corresponding references to Windows Live.

## FAQ

##### How do I obtain a refresh token?

Your authentication request must include `wl.offline_access` as detailed in
[scopes and permissions](https://msdn.microsoft.com/en-us/library/hh243646.aspx).

```js
passport.authenticate('windowslive', { scope: [ 'wl.offline_access' ] })
```

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
effort to develop and maintain this project is dedicated by [@jaredhanson](https://github.com/jaredhanson).
If you (or your employer) benefit from this project, please consider a financial
contribution.  Your contribution helps continue the efforts that produce this
and other open source software.

Funds are accepted via [PayPal](https://paypal.me/jaredhanson), [Venmo](https://venmo.com/jaredhanson),
and [other](http://jaredhanson.net/pay) methods.  Any amount is appreciated.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2016 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
