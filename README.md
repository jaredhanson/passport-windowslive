# passport-windowslive

[![Build](https://travis-ci.org/jaredhanson/passport-windowslive.png)](https://travis-ci.org/jaredhanson/passport-windowslive)
[![Coverage](https://coveralls.io/repos/jaredhanson/passport-windowslive/badge.png)](https://coveralls.io/r/jaredhanson/passport-windowslive)
[![Quality](https://codeclimate.com/github/jaredhanson/passport-windowslive.png)](https://codeclimate.com/github/jaredhanson/passport-windowslive)
[![Dependencies](https://david-dm.org/jaredhanson/passport-windowslive.png)](https://david-dm.org/jaredhanson/passport-windowslive)
[![Tips](http://img.shields.io/gittip/jaredhanson.png)](https://www.gittip.com/jaredhanson/)

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Microsoft](http://www.microsoft.com/) accounts (aka [Windows Live](http://www.live.com/))
using the OAuth 2.0 API.

This module lets you authenticate using Windows Live in your Node.js applications.
By plugging into Passport, Windows Live authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-windowslive

## Usage

#### Configure Strategy

The Windows Live authentication strategy authenticates users using a Windows
Live account and OAuth 2.0 tokens.  The strategy requires a `verify` callback,
which accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new WindowsLiveStrategy({
        clientID: WINDOWS_LIVE_CLIENT_ID,
        clientSecret: WINDOWS_LIVE_CLIENT_SECRET,
        callbackURL: "http://www.example.com/auth/windowslive/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ windowsliveId: profile.id }, function (err, user) {
          return done(err, user);
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

For a complete, working example, refer to the [login example](https://github.com/jaredhanson/passport-windowslive/tree/master/examples/login).

## Tests

    $ npm install
    $ npm test

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2014 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
