const http = require('http');

const server = http.createServer((req, res) => {
    const arr = req.url.split("/");
    const num1 = Number(arr[2]);
    const num2 = Number(arr[3]);
    let result;
    if(arr[1] == "add") {
        result = num1 + num2;
    }
    else if(arr[1] == "sub") {
        result = num1 - num2;
    }
    else if(arr[1] == "mul") {
        result = num1 * num2;
    }
    else if(arr[1] == "div") {
        result = num1 / num2;
    }
    res.write(String(result));
    res.end();
})

server.listen(8080);

server.on('listening', () => {
    console.log("server is running on 8080 port.");
})