var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var fs = require('fs');
var cors = require('cors')
var app = express();
const Covid = require('./Models/covid')
const os = require('os')
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
var http = require('http');
require('dotenv').config()

mongoose.connect("mongodb+srv://unicoursework:mNjrPhKgRk3H1fCh@cluster0.kr3qw.mongodb.net/covid?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDb successsFully Connected!!'))
    .catch(err => console.log('Errror in connecting mongodb', err));




app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//insert the data
app.post('/api/insert', async (req, res) => {
    try {
        let { date, country, state, cases, deaths } = req.body;
        let obj = {
            date: new Date(date),
            country,
            state,
            cases,
            deaths
        }
        let body = new Covid(obj);
        await body.save();
        return res.send("Saved.")
    } catch (error) {
        return res.status(400).send(error.message)
    }
})
//delete data api
app.delete('/api/delete/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let response = await Covid.findByIdAndDelete(id).lean();
        if (response) return res.send("Deleted.");
    } catch (error) {
        return res.status(400).send(error.message)
    }
})
//get data api
app.get('/api/fetch', async (req, res) => {
    try {
        let { date, country, state } = req.query;
        let query = {};
        if (date) query["date"] = new Date(date);
        if (state) query["state"] = new RegExp(state, 'i')
        if (country) query["country"] = new RegExp(country, 'i')
        let response = await Covid.aggregate([
            { $match: query },
        ])

        return res.send({
            response: response
        });
    } catch (error) {
        return res.status(400).send(error.message)
    }
})
// get OS
app.get('/api/OS', (req, res) => {
    try {
        return res.status(200).send({
            OS: os.platform(),
            Release: os.release()
        })
    } catch (error) {
        return res.status(400).send(error.message)
    }
})


var port = (process.env.PORT || '8836');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => console.log("server running on port", port));