const express = require('express');
const bodyParser = require('body-parser');
const {PythonShell} = require('python-shell');
const https = require('https');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// Configurar o Express para servir arquivos estáticos na pasta "public"
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/upload', (req, res) => {
  console.log("Teste: ", JSON.stringify(req.body));
  let options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptsPath: 'public/test2.py',
    args: ['texto de exemplo']
  }
  console.log('Processando Imagem...')
  PythonShell.run('public/test2.py', options).then(messages=>{
      console.log('results: %j', messages);
 });

  // resposta de sucesso
  const processResult = {
      result: [3, 3, -3],
      image: 'assets/images/imagem1.png',
      imageReceived: true, 
    };
    
    res.json(processResult);
  });
  
  //app.listen(process.env.PORT || 3000) // para deploy na railway
  
  //para executar localmente
  //Certificado ssl (não válidado)
  const openSSL = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
  };
const server = https.createServer(openSSL, app);
server.listen(port, () => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    let ipAddress;

    // Encontre o endereço IP da máquina local (geralmente o primeiro na lista)
    for (const interfaceName in networkInterfaces) {
      const networkInterface = networkInterfaces[interfaceName];
      for (const interfaceDetails of networkInterface) {
        if (interfaceDetails.family === 'IPv4' && !interfaceDetails.internal) {
          ipAddress = interfaceDetails.address;
          break;
        }
      }
      if (ipAddress) break;
    }
    console.log(`Servidor rodando em https://${ipAddress}:${port}`);
});
