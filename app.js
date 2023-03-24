const { Client } = require("@notionhq/client")
const fs = require('fs')
const path = require('path')
const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;



const env = (function(){
    const envPath = path.join(__dirname, 'env.json')
    const envStr = fs.readFileSync(envPath, 'utf8').trim()
    return JSON.parse(envStr)
})()


const notion = new Client({
  auth: env["secret"],
})


const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
    
        req.on('data', chunk => {
          body += chunk.toString();
        });
    
        req.on('end', () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end(`Received request body: ${body}`);
          onRecievedData(body)
        });
      } else {
        res.statusCode = 404;
        res.end();
      }
});



function onRecievedData(data){
    console.log(`recieved ${data}`)
    createRow(data)
}


function createRow(title){
    const newEntry = {
        title: [
            {
                text: {
                content: title
                }
            }
        ]
    }
    
    notion.pages.create({
        properties: newEntry,
        parent: {
            database_id: env["db"]
        }
    
    })
}



server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);   
});