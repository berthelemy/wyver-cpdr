/*
TO DO
1) Get current statements with activity IDs which match tweets, don't resend those statements
2) Use the streaming API so it picks up all new tweets

*/


var credentials = require('./credentials'); // Expects SECRET & KEY

// Twitter auth setup

var OAuth2 = require('OAuth').OAuth2;
var https = require('https'); // used by node to make requests

KEY = credentials.KEY;
SECRET = credentials.SECRET;

// LRS auth setup
var adl = require('adl-xapiwrapper');

adl.debugLevel = 'info';

var opts = { // set up LRS credentials
    "url" : credentials.lrsURL,
    "auth" : {
        "user" : credentials.lrsUser,
        "pass" : credentials.lrsKey
        },
    };
var mylrs = new adl.XAPIWrapper(opts); // setup LRS object

var actor = { // setup actor variable
        "account": {
            "homePage": "https://www.twitter.com",
            "name": "berthelemy"
            }
        }

var verb = { // set up verb to use
        "id" : "http://id.tincanapi.com/verb/tweeted",
        "display" : {
            "en-US" : "tweeted"}
        };








/*
Get statements

mylrs.getStatements(null, null, function(err,resp,bdy) {
    obj = JSON.parse(bdy);
    console.log (obj.statements[0].actor.mbox);
    console.log(resp.statusCode);
    console.log(JSON.parse(bdy));
    });
*/


// Setup Twitter oauth

var oauth2 = new OAuth2(KEY, SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);
oauth2.getOAuthAccessToken('', {
    'grant_type': 'client_credentials'
}, function (e, access_token) {
    // console.log(access_token); //string that we can use to authenticate request


// Setup what tweets we want to pick up
    var options = {
        hostname: 'api.twitter.com',
//        path: '/1.1/statuses/user_timeline.json?screen_name=berthelemy&count=2',
	  path: '/1.1/search/tweets.json?q=#cpdr+from:'+actor.account.name,
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
              id = tweets.statuses[i].id_str;
              var activity = {
                    "objectType": "Activity",
                    "id": "https://twitter.com/"+actor.account.name+"/status/"+id,
                    "definition": {
                      "name": {
                        "en-GB": tweet
                      },
                      "type": "http://www.wyversolutions.co.uk/schema/1.0/activities/tweet"
                    }
                }
            var stmt = {
                "actor" : actor,
                "verb" : verb,
                "object" : activity
                };

            mylrs.sendStatements(stmt, function (err,resp,bdy) {
                adl.log('info',resp.statusCode);
                adl.log('info',bdy);
                });
              console.log(tweet);
//            console.log(created_at);
            }

        });
    });
});
