const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("MongoDB Connected Successfully");
    } 
    catch (error) {
        isConnected = false;
        console.log("MongoDB Connection Failed - " + error.message);
        console.log("Proceeding without database (using localStorage on frontend)");
    }
};

const getConnectionStatus = () => isConnected;

module.exports = connectDB;
module.exports.getConnectionStatus = getConnectionStatus;
