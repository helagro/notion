const { Client } = require("@notionhq/client")
const fs = require('fs')
const path = require('path')
const express = require('express')

const CONTENT_KEY = "msg"
const port = 3000;

const app = express()
app.use(express.json())
//app.use(express.urlencoded({ extended: true }))


const env = (function(){
    const envPath = path.join(__dirname, 'env.json')
    const envStr = fs.readFileSync(envPath, 'utf8').trim()
    return JSON.parse(envStr)
})()


const notion = new Client({
  auth: env["secret"],
})


app.post('', (req, res) => {
    console.log(req.body[CONTENT_KEY])
    createRow(req.body[CONTENT_KEY])
    res.send('Data received: ' + req.body[CONTENT_KEY])
})


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