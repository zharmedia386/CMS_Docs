require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const port = process.env.PORT || 5000

const app = express()

app.use(bodyParser.urlencoded({
    extended: false
}))

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/documentations', require('./routes/api/documentations'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(port, () => {
    console.log('Connected to MongoDB');
    console.log(`Server live on port ${port}`)
})