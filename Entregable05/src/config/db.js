import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {console.log("Db Connected 🛒")})
    .catch(err => {console.log(err)})
    
    mongoose.set('strictQuery', true)