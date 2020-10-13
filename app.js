const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    // в методе end тоже можно передать данные
    res.end('<h1>Hello, World!</h1>', 'utf8');
});

server.listen(3000);