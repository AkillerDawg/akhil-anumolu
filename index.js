// Generated by CoffeeScript 1.7.1
(function() {
  var app, config, express, getTweetInfo, getTweets, http, twitter;

  express = require('express');

  app = express();

  http = require('http').Server(app);

  config = require('config');

  twitter = new require('twitter')(config.twitter);

  app.set('view engine', 'jade');

  app.set('views', __dirname + '/views');

  app.use('/public', express["static"]("" + __dirname + "/public"));

  app.get('/', function(i, o) {
    return o.render('index');
  });

  getTweetInfo = function(tweet) {
    var ret;
    ret = {
      id: tweet.id_str,
      text: tweet.text
    };
    if (tweet.place != null) {
      ret.place = tweet.place.full_name;
    }
    return ret;
  };

  getTweets = function(username, cb) {
    var _get, _makeParams;
    _makeParams = function(max) {
      var params;
      params = {
        screen_name: username,
        count: 200
      };
      if (max != null) {
        params.max_id = max;
      }
      return params;
    };
    _get = function(pool, max) {
      return twitter.get('statuses/user_timeline', _makeParams(max), function(err, tweets) {
        var skip, x;
        skip = max != null ? 1 : 0;
        if (tweets && (tweets.length > skip)) {
          return _get((pool != null ? pool : []).concat(tweets.slice(skip)), tweets[tweets.length - 1].id_str);
        } else {
          return cb((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = pool.length; _i < _len; _i++) {
              x = pool[_i];
              _results.push(getTweetInfo(x));
            }
            return _results;
          })());
        }
      });
    };
    return _get();
  };

  app.get('/tweets', function(i, o) {
    return getTweets(i.query.username, function(tweets) {
      return o.render('tweets', {
        tweets: tweets,
        apiKey: config.googleMaps
      });
    });
  });

  http.listen(3000, function() {
    return console.log('listening on *:3000');
  });

}).call(this);
