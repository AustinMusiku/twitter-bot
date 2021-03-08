const path = require('path')
const twit = require('twit')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

let config = {
    consumer_key : process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
};

const T = new twit(config)

let getTweets = (search, i) => {
    return new Promise((res, rej)=>{
        let params = {
            q: search,
            count: i
        };
        T.get('search/tweets', params, (err, data)=>{
            if(err){
                return rej(err);
            }
            return res(data);
        })
    })
}

let postTweet = (tweet) => {
    let params = {
        status: tweet
    }
    return new Promise((res, rej) => {
        T.post('statuses/update', params, callback);
        function callback(err, data, response){
            err? rej(err) : res(data);
        }
    })
}


// set up a stream that will
// listen for kot5aside tweets
// const stream = T.stream('statuses/filter', {track: 'KOT5Aside'});
// stream.on('tweet', (event) => {
//     console.log("new follower");
//     console.log(event)
// });

// setup stream that
// listens to user follows
const followStream = T.stream('user');
followStream.on('favorite', (event) => {
    console.log(event);
});