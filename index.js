const express = require('express');
const path = require('path')
const twit = require('twit')
const dotenv = require('dotenv')

dotenv.config({path: './config.env'})

let app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))

let config = require('./config/config')

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



// STREAMS

// set up a stream that will
// listen for kot5aside tweets
// const stream = T.stream('statuses/filter', {track: 'KOT5Aside'});
// stream.on('tweet', (event) => {
//     console.log("new follower");
//     console.log(event)
// });


