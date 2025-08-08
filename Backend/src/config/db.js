const mongoose = require('mongoose');
const config = require('@/config/env');

const connectToDatabase = async()=>{
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log("DataBase Successfully Connect");
    } catch (error) {
        console.log('Database is Not connect',error);
    }
}

module.exports = connectToDatabase;