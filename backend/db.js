import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' })

const mongooseConnectionPromise = mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    console.log("MongoDB is succesfully connected")
})
.catch((err) => { console.log(err) })

export default mongooseConnectionPromise;