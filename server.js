const mongoose = require('mongoose');

//to use configuration variables
const dotenv = require('dotenv');

//location of our configuration file
dotenv.config({path: './config.env'})

//connecting to the database
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => {
    console.log("DB connection is successful...")
})



//should be after 'dotenv config'
const app = require('./app');

//server calling
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is running ${port}`);
});