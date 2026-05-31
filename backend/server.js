import express from 'express'
import cors from 'cors'
import { mongoose as mng } from 'mongoose'

const app = express()

mng.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Database connected")
    })
    .catch(err => {
        console.log("Database connection failed")
    })

app.use(express.json())
app.use(cors())


app.get("/", (req, res) => {
    console.log("Hello world")
})

app.listen(8080, () => {
    console.log("Server running on port 8080")
})