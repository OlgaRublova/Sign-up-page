const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./../../models/userModel')

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

//reading JSON file
const users = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//importing data into db
const importData = async () => {
    try {
        await User.create(users);
        console.log("Data is successfully loaded");
        process.exit();

    } catch (err) {
        console.log(err);
    }
}

//delete all data from db
const deleteData = async () => {
    try {
        await User.deleteMany();
        console.log("Data is successfully deleted");
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

//node dev-data/data/import-dev-data.js --import
//node dev-data/data/import-dev-data.js --delete
if (process.argv[2] === '--import') {
    return importData();
} else if (process.argv[2] === '--delete') {
    return deleteData();
}
