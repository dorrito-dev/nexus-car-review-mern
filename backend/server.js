import express from 'express'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    console.log("Hello world")
})

app.listen(8080, () => {
    console.log("Server running on port 8080")
})