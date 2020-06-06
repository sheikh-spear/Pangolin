require('rootpath')();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const log = require("./debug/logger.js");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// api routes
app.use('/api', require("./routes/router.js"));

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 8080;
const server = app.listen(port, function () {
    log('Server listening on port ' + port, 1);
});