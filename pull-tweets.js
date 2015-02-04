// Read JSON from external server

var OAuth2 = require('OAuth').OAuth2;
var https = require('https'); // used by node to make requests

var KEY = 'c3UYyiPCQDVboyNK2BNYqCnoO';
var SECRET = '3VMu5h8YwT85OltTvWkwe5aP9G6BJzHhkHnNy4clHKRivkiWxJ'

var oauth2 = new OAuth2(KEY, SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);
oauth2.getOAuthAccessToken('', {
    'grant_type': 'client_credentials'
}, function (e, access_token) {
    // console.log(access_token); //string that we can use to authenticate request

    var options = {
        hostname: 'api.twitter.com',
        path: '/1.1/statuses/user_timeline.json?screen_name=berthelemy&count=2',
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    };


    https.get(options, function (result) {
        var buffer = '';
        result.setEncoding('utf8');
        result.on('data', function (data) {
            buffer += data;
        });
        result.on('end', function () {
            var tweets = JSON.parse(buffer);
            // console.log(tweets); // the tweets!

            var total = tweets.length;

            for (i=0;i<total;i++) {
              tweet = tweets[i].text;
              created_at = tweets[i].created_at;
              console.log(tweet);
              console.log(created_at);
            }

        });
    });
});




function myFunction(arr) {
  var out = "";
  var i;
  for (i=0;i<arr.length;i++) {
    out += arr[i].entities.text + "\n"
  }
  console.log(out);
}
