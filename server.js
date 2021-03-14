const express = require('express');
const twit = require('twit');
const crc = require('./crc');
const dotenv = require('dotenv');
const url = require('url');

dotenv.config()

let config = require('./config/config')
const T = new twit(config)

// instantiate app
let app = express();

// ROUTES

// new follow
app.post('/follow', (req, res) => {
    console.log(req);
})

// ACCOUNT ACTIVITY API

// register webhook

let registerWebhook = async () => {
    let params = {
        config,
        url: url.parse('https://20589a183a12.ngrok.io//webhook/')
    }
    let env_name = 'dev'

    T.post(`https://api.twitter.com/1.1/account_activity/all/dev/webhooks.json`, params,  (err, data) => {
        if(err){
            console.log('here in error')
            console.log(err)
        }else{
            console.log(data)
        }
    })
 }

// crc get request
app.get('/webhook/', (req, res) => {
    console.log('here2')
    console.log(req.query);
    let token_crc = req.query.crc_token;

    if(token_crc){
        let hash = crc.get_challenge_response(token_crc, process.env.CONSUMER_SECRET);
        
        res.status(200).send({response_token: hash})
    }else{
        res.status(500).send('error on server')
    }
})

registerWebhook()

// app listen
app.listen(3000, () => {
    console.log(`listening on port 3000`)
})
