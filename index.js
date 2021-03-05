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

let getTweets = ()=>{
    return new Promise((res, rej)=>{
        let params = {
            q: 'wizkid',
            count: 0
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
    return new Promise((res, rej) => {
        T.post('statuses/update', tweet, callback);
        function callback(err, data, response){
            err? rej(err) : res(data);
        }
    })
}

let param = {
    status: 'test2'
}

postTweet(param)
    .then(data => {
        console.log(data);
    })