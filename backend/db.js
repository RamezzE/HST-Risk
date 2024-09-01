import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const mongooseOptions = {
    maxPoolSize: 10, // Maximum number of sockets the MongoDB driver will keep open for this connection
    minPoolSize: 5, // Minimum number of sockets the MongoDB driver will keep open for this connection
    maxIdleTimeMS: 30000, // Maximum time in milliseconds that a connection can be idle before being closed
    serverSelectionTimeoutMS: 5000, // How long the MongoDB driver will wait to find an available server
    socketTimeoutMS: 45000, // How long the MongoDB driver will wait for a response from the server
};

const mongooseConnectionPromise = mongoose.connect(process.env.MONGO_URI, mongooseOptions)
    .then(() => {
        console.log("MongoDB is successfully connected");
    })
    .catch((err) => {
        console.log(err);
    });

export default mongooseConnectionPromise;
