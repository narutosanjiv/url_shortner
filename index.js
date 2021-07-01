const express = require('express');
const mongoConnection = require('./config/db.config');

const app = express();
const { nanoid } = require('nanoid')

const URLSchema = require('./models/UrlModel');

const baseURL = 'http://localhost:3002'

mongoConnection.on('error',  err => {
    console.error(err);
});

// app.use(bodyParser.json())

app.get('/:code', async (req, res, next) => {
    const urlSchema = await URLSchema.findOne({urlCode: req.params.code})
    if(urlSchema){
        res.redirect(urlSchema.longUrl);
    } else{
        res.json({msg: 'invalid url'})
    }

});

app.post('/shortner', async (req, res, next) => {
    const { url } = req.body;
    const urlSchema  = await URLSchema.exists({longUrl: url});
    if(urlSchema)
        res.json(urlSchema)
    
    const code = nanoid(10);

    const newurlSchema = new URLSchema({
        longUrl: url,
        urlCode: code,
        shortUrl: `${baseURL}/code`,
        date: new Date() 
    });

    await newurlSchema();

    res.json({
        success: true,
        url: newurlSchema.url
    })
});

const PORT = process.env.PORT || 3002

app.listen(PORT, () => console.log(`server started, listening PORT ${PORT}`))




