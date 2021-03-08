const express = require('express');
const twit = require('twit');

// instantiate app
let app = express();

app.post('/follow', (req, res) => {
    console.log(req);
})




app.listen(3000, () => {
    console.log(`listening on port 3000`)
})