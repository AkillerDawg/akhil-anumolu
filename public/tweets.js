// Generated by CoffeeScript 1.7.1
(function() {
  var antarctica, antarcticaCounter, geocode, geocodeCache, geocodeNew, geocoder, infoWindow, makeMarker, map, renderTweet;

  map = null;

  geocoder = null;

  infoWindow = null;

  geocodeNew = function(address, cb) {
    return geocoder.geocode({
      address: address
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
          return cb(results[0].geometry.location);
        }
      }
      return cb(null);
    });
  };

  geocodeCache = {};

  geocode = function(address, cb) {
    if (address in geocodeCache) {
      return cb(geocodeCache[address]);
    } else {
      return geocodeNew(address, function(loc) {
        if (loc) {
          geocodeCache[address] = loc;
        }
        return cb(loc);
      });
    }
  };

  renderTweet = function(tweet) {
    var url;
    url = "http://twitter.com/statuses/" + tweet.id;
    return "<a target='_blank' href='" + url + "'>" + tweet.text + "</a>";
  };

  makeMarker = function(map, loc, tweet) {
    var marker;
    marker = new google.maps.Marker({
      map: map,
      position: loc,
      title: tweet.place || "No Man's Land"
    });
    return marker.addListener('click', function() {
      if (infoWindow) {
        infoWindow.close();
      }
      infoWindow = new google.maps.InfoWindow({
        content: renderTweet(tweet)
      });
      return infoWindow.open(map, marker);
    });
  };

  antarcticaCounter = 0;

  antarctica = function() {
    return {
      lat: -80,
      lng: antarcticaCounter++ * 10
    };
  };

  window.init = function() {
    var handle, tweet, _i, _len, _ref, _results;
    map = new google.maps.Map($('#map')[0], {
      zoom: 2,
      center: {
        lat: -25.363,
        lng: 131.044
      }
    });
    geocoder = new google.maps.Geocoder();
    handle = function(tweet) {
      if (tweet.place) {
        return geocode(tweet.place, function(loc) {
          return makeMarker(map, loc, tweet);
        });
      } else {
        return makeMarker(map, antarctica(), tweet);
      }
    };
    _ref = window.tweets;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tweet = _ref[_i];
      _results.push(handle(tweet));
    }
    return _results;
  };

}).call(this);