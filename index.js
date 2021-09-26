const express = require('express');
const path = require('path')
const twit = require('twit')
const dotenv = require('dotenv')

// set up server
const app = express();

// environment variables
dotenv.config()
let config = require('./config/config')

// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// instantiate package objects
const T = new twit(config)
const client = require('twilio')(process.env.TWILIO_ACC_SID, process.env.TWILIO_AUTH_TOKEN);
const MessagingResponse = require('twilio').twiml.MessagingResponse;


// GET TWEETS

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

// POST TWEETS

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
let data = {
    time: new Date(),
    user: 'badAndBoogie, Ph.D',
    msg: 'live from cdn bot'
}

postTweet(JSON.stringify(data));

// STREAM
// set up a stream that will
// listen for @MusikuAustin mentions
// and sends alert to whatsapp number

const stream = T.stream('statuses/filter', { track: '@MusikuAustin' });
stream.on('tweet', (tweet) => {
    try{
        console.log("new mention");
        console.log(tweet);
        // get and format time of tweet
        let date = new Date(parseInt(tweet.timestamp_ms));
        let hr = date.getHours();
        let min = date.getMinutes();
        let day = date.getDay();
        let month = date.getMonth();
        let months = ['January','February','March','April','May','June','July','August','September','October','November','December']
        let year = date.getFullYear();
        //  display date as follows: march 3, 2021
        // send message to whatsapp  number via twilio sand box
        client.messages 
            .create({ 
               body: `@${tweet.user.screen_name} mentioned you in a tweet\n\n${tweet.text}\n\ntweeted at ${hr}:${min} on ${months[month]} ${day}, ${year}`, 
               from: `whatsapp:+${process.env.TWILIO_NO}`,       
               to: `whatsapp:+${process.env.WHATSAPP_NO}` 
            })
            .then( message => console.log(message.sid))
            .done();

    }catch(error){
        console.log(error)
    }
});

// Handle webhook post requests
app.post('/twitterMention', (req, res) => {
    let body = req.body.Body;
    console.log('webhook /twitterMention');
    console.log(body);
    // catch response from whatsapp
    const twiml = new MessagingResponse;
    twiml
        .message('got message')
        // .media('https://www.bing.com/th?id=OIP.2nh7jNX2qm4XeSxbbU_NYwHaEK&w=249&h=160&c=8&rs=1&qlt=90&pid=3.1&rm=2');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
})

// Handle webhook status update requests
app.post('/twitterMention/status', (req, res) => {
    let status = req.body.EventType || req.body.MessageStatus;
    console.log('webhook /twitterMention/status');
    console.log(status);
    res.end();
})


// Server listen
app.listen(process.env.PORT, () => {
    console.log(`listening on port 3000`)
})