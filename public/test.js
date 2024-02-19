const express = require("express");
const http = require('http');
const fs = require("fs");

const app = express();
const port = 3000;

var options = {
	index: "index.html"
}

app.use(express.urlencoded({limit: "1mb", extended: true}));
app.engine("html", require("ejs").renderFile);
app.use(express.static('public'));

const host = "0.0.0.0";

// Configurar rota para o arquivo test.html
app.get('/', (req, res) => {
    const filePath = __dirname + '/test.html';
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Erro ao ler o arquivo ${filePath}: ${err}`);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.send(data);
        }
    });
});
 
// Criar servidor HTTP
const serverHTTP = http.createServer(app);
serverHTTP.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
