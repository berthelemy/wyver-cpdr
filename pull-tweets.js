// Setup Twitter oauth

var OAuth2 = require('OAuth').OAuth2;
var https = require('https'); // used by node to make requests

var credentials = require('./credentials'); // Expects SECRET & KEY
KEY = credentials.KEY;
SECRET = credentials.SECRET;


var oauth2 = new OAuth2(KEY, SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);
oauth2.getOAuthAccessToken('', {
    'grant_type': 'client_credentials'
}, function (e, access_token) {
    // console.log(access_token); //string that we can use to authenticate request


// Setup what tweets we want to pick up
    var options = {
        hostname: 'api.twitter.com',
//        path: '/1.1/statuses/user_timeline.json?screen_name=berthelemy&count=2',
	  path: '/1.1/search/tweets.json?q=#cpdr+from:berthelemy',
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    };

// Pull down the tweets
    https.get(options, function (result) {
        var buffer = '';
        result.setEncoding('utf8');
        result.on('data', function (data) {
            buffer += data;
        });
        result.on('end', function () {
            var tweets = JSON.parse(buffer);
 //            console.log(tweets); // the tweets!


// Parse and display the tweets

            var total = tweets.statuses.length;

            for (i=0;i<total;i++) {
              tweet = tweets.statuses[i].text;
              created_at = tweets.statuses[i].created_at;
              console.log(tweet);
//            console.log(created_at);
            }

        });
    });
});
