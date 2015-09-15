express = require 'express'
app     = express()
http    = require('http').Server(app)
config  = require 'config'
twitter = new require('twitter') config.twitter

app.set 'view engine', 'jade'
app.set 'views', __dirname + '/views'
app.use '/public', express.static "#{__dirname}/public"

app.get '/', (i, o) ->
  o.render 'index'

getTweetInfo = (tweet) ->
  ret = {id: tweet.id_str, text: tweet.text}
  ret.place = tweet.place.full_name if tweet.place?
  ret

getTweets = (username, cb) ->
  _makeParams = (max) ->
    params = {screen_name: username, count: 200}
    params.max_id = max if max?
    params

  _get = (pool, max) ->
    twitter.get 'statuses/user_timeline', _makeParams(max), (err, tweets) ->
      skip = if max? then 1 else 0
      if (tweets) and (tweets.length > skip)
        _get (pool ? []).concat(tweets[skip...]), tweets[tweets.length-1].id_str
      else
        cb (getTweetInfo x for x in pool)

  _get()

app.get '/tweets', (i, o) ->
  getTweets i.query.username, (tweets) ->
    o.render 'tweets',
      tweets: tweets
      apiKey: config.googleMaps

http.listen 3000, ->
  console.log 'listening on *:3000'
