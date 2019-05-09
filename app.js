const express = require('express');
const app = express();
const employeeHandler = require('./api/routes/employeeHandler');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


app.use(morgan('dev'));
mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-ohfj5.mongodb.net/test?retryWrites=true`, {useNewUrlParser: true})
.catch(e => console.log(e));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
    next();
  });
  

app.use('/employees', employeeHandler);

app.get('/images/:filePath', (req, res, next) => {
    console.log(req.params.filePath);
    res.sendFile(__dirname + '/uploads/' + req.params.filePath);
})

app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  });
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      error: {
        message: err.message
      }
    });
  });

module.exports = app;
