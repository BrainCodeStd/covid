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
require('dotenv').config()
// mongodb+srv://unicoursework:mNjrPhKgRk3H1fCh@cluster0.kr3qw.mongodb.net/covid?retryWrites=true&w=majority
mongoose.connect("mongodb://localhost/mydb",
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDb successsFully Connected!!'))
    .catch(err => console.log('Errror in connecting mongodb', err));


app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', function (req, res) {
    res.sendfile('index.html');
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('./public'))

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
app.delete('/api/delete/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let response = await Covid.findByIdAndDelete(id).lean();
        if (response) return res.send("Deleted.");
    } catch (error) {
        return res.status(400).send(error.message)
    }
})
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




// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
    // res.send('404 Error caught');
});





// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'production' ? err : {};
    // render the error page 
    return res.status(err.status || 500).send('<h1>Internal server Error 500</h1>');
    // res.send('error');
    // res.end()
});

module.exports = app;
