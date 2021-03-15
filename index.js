const express = require('express');
const path = require('path')
const twit = require('twit')
const dotenv = require('dotenv')

// set up server
const app = express();
app.listen(process.env.PORT, () => {
    console.log(`listening on port 3000`)
})

dotenv.config()
let config = require('./config/config')

app.use(express.json());

const T = new twit(config)
const client = require('twilio')(process.env.TWILIO_ACC_SID, process.env.TWILIO_AUTH_TOKEN);

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
// and sends alert to whatsapp number

const stream = T.stream('statuses/filter', { track: '@MusikuAustin' });
stream.on('tweet', (tweet) => {
    try{
        console.log("new mention");
        console.log(tweet)

        client.messages 
            .create({ 
               body: 'new mention', 
               from: `whatsapp:+${process.env.TWILIO_NO}`,       
               to: `whatsapp:+${process.env.WHATSAPP_NO}` 
            })
            .then( message => console.log(message))
            .done();

    }catch(error){
        console.log(error)
    }
});


app.post('/twitterMention/status', (req, res) => {
    console.log(req.body);
})

app.post('/twitterMention', (req, res) => {
    console.log(req.body);
})