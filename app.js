const { Client } = require("@notionhq/client")
const fs = require('fs')
const path = require('path')
const express = require('express')

const app = express()
const hostname = '0.0.0.0'
const port = 3000;

//app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const env = (function(){
    const envPath = path.join(__dirname, 'env.json')
    const envStr = fs.readFileSync(envPath, 'utf8').trim()
    return JSON.parse(envStr)
})()


const notion = new Client({
  auth: env["secret"],
})


app.post('', (req, res) => {
    console.log(req.body)
    res.send('Data received')
})


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





app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})