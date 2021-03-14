const express = require('express');
const path = require('path')
const twit = require('twit')
const dotenv = require('dotenv')

dotenv.config()

let config = require('./config/config')

const T = new twit(config)

// ###### GET TWEETS ######

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

// ###### POST TWEETS ######

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



// ###### STREAMS ######

// set up a stream that will
// listen for @MusikuAustin mentions

const stream = T.stream('statuses/filter', { track: '@MusikuAustin' });
stream.on('tweet', (tweet) => {
    try{
        console.log("new mention");
        console.log(tweet)
    }catch(error){
        console.log(error)
    }
});



