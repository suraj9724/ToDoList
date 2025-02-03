const connetToMongo = require('./db')
connetToMongo();
const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Available routes for api
app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});