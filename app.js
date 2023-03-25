const { Client } = require("@notionhq/client")
const fs = require('fs')
const path = require('path')
const express = require('express')

//const CONTENT_KEY = "msg"
const port = 3000;

const app = express()
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
    const input = req.body

    console.log(input)
    processInput(input)
    res.send('Data received: ' + input)
})

function processInput(input){
    const [DBkey, content] = input.split(' ', 2);
    const DB = env["DBs"][DBkey]
    createRow(DB, content)
}


function createRow(db, title){
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
            database_id: db
        }
    
    })
}





app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})