import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
mongoose.set('strictQuery', true)
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    .then(() => {console.log("Db Connected 🛒")})
    .catch(err => {console.log(err)})
    

    
    