/********************************************************************************* */
//
//  RONNIE ALVAREZ CASTRO  CODERHOUSE PROGRAMA FULLSTACK CURSO BACKEND
//
/********************************************************************************* */
//
import express from 'express'
import dotenv from 'dotenv'
import productsroutes from './src/Routes/products.routes.js'
import cartsroutes from './src/Routes/carts.routes.js'
import __dirname from './utils.js'
//****************************************/

/* The above code is creating a server and listening to port 8080. */
const app = express()
dotenv.config()
const port = process.env.port || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productsroutes)
app.use('/api/carts', cartsroutes)
app.use(express.static(__dirname+"/scr/public"))

app.listen(port, () => {
    console.log(`⚛️ Server up on port: ${port} ⚛️`)
})

app.on('error', (err) => {
    console.log(err)
})