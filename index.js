const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dishRouter = require('./routes/dishRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(express.static(__dirname+'/public'));

app.use('/dishes', dishRouter);

app.use((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content','text/json');
    res.end('<html><body>Welcome to express server</body></html>');
});


const server = http.createServer(app);

server.listen(port, hostname,()=>{
    console.log(`server connected at https://${hostname}:${port}`);
})