const express = require('express');
const twit = require('twit');
const crc = require('./crc');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'})

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
let follows = () => {
    let params = {
        url: 'https://67737425f7c7.ngrok.io/',
    }
    let env_name = 'dev'
    T.post(`https://api.twitter.com/1.1/account_activity/all/dev/webhooks.json?url=${params.url}`, (err, data) => {
        if(err){
            console.log('here')
            console.log(err)
        }else{
            console.log(data)
        }
    })
 }

// crc get request
app.get('/webhook/twitter', (req, res) => {
    // console.log('here2')
    console.log(req.query);
    let token_crc = req.query.crc_token;

    if(token_crc){
        let hash = crc.get_challenge_response(token_crc, process.env.CONSUMER_SECRET);
        
        res.status(200).send(hash)
    }else{
        res.status(500).send('error on server')
    }
})

follows()

// app listen
app.listen(3000, () => {
    console.log(`listening on port 3000`)
})