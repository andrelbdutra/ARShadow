const express = require('express');
const https = require('https');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// Certificado ssl (não válidado)
// const openSSL = {
//   key: fs.readFileSync('./ssl/key.pem'),
//   cert: fs.readFileSync('./ssl/cert.pem')
// };

// Configurar o Express para servir arquivos estáticos na pasta "public"
app.use(express.static('public'));

app.post('/upload', (req, res) => {
    const image = req.body.image;
    // resposta de sucesso
    const processResult = {
      result: [0,3,0],

      imageReceived: true, 
    };
  
    res.json(processResult);
});

app.listen(process.env.PORT || 3000)

// const server = https.createServer(openSSL, app);
// server.listen(port, () => {
//     const os = require('os');
//     const networkInterfaces = os.networkInterfaces();
//     let ipAddress;

//     // Encontre o endereço IP da máquina local (geralmente o primeiro na lista)
//     for (const interfaceName in networkInterfaces) {
//       const networkInterface = networkInterfaces[interfaceName];
//       for (const interfaceDetails of networkInterface) {
//         if (interfaceDetails.family === 'IPv4' && !interfaceDetails.internal) {
//           ipAddress = interfaceDetails.address;
//           break;
//         }
//       }
//       if (ipAddress) break;
//     }
//     console.log(`Servidor rodando em https://${ipAddress}:${port}`);
// });
