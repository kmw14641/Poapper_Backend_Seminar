const http = require('http');
const moment = require('moment');

const server = http.createServer((req, res) => {
    if(req.url == '/timer') {
        res.write(moment().format("YYYY-MM-DD HH:mm:ss"));
        res.end();
    }
})

server.listen(8080);

server.on('listening', () => {
    console.log("server is running on 8080 port.");
})