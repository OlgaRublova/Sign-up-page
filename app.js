const express = require('express');
const morgan = require('morgan');
const router = require('./routes/userRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

//'app.use' is how we're using middleware

//  1)  GLOBAL MIDDLEWARES

//  Set security HTTP headers
app.use(helmet())

//  development logging
if (process.env.NODE_ENV) {
    app.use(morgan('dev'));
}

//  limiting number of api requests per hour
const limiter = rateLimit({
    max: 100,
    windowsMS: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!"
})
app.use('/api', limiter);

//  body parser, reading data from body into req.body
//  it is OBLIGATORY FOR A POST REQUEST
//  app.use(express.json());
app.use(express.json({ limit: '10kb' })); //    won't accept data that is larger than 10kb

//  data sanitization against NoSQL query injection
app.use(mongoSanitize());

//  data sanitization against XSS
app.use(xss());

//  prevent parameter pollution
app.use(hpp({
    //whitelist: ['duration']
}));


// 2) ROUTES
app.use('/api/v1/users', router) //morgan


module.exports = app;