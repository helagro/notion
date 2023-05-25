const { Client } = require("@notionhq/client")
const fs = require('fs')
const path = require('path')
const express = require('express')

const port = 3000;

const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.text())


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

    console.log("input:", input)
    const response = processInput(input)
    res.send(`input: ${input}\nresponse:${response}`)
})

function processInput(input){
    const [DBkey, ...content] = input.split(' ')
    const DB = getDB(DBkey)

    if(DB == null) return "invalid DB"

    createRow(DB["id"], content.join(" "))
    return "success"
}


function getDB(DBkey){
    for(const DB of env["DBs"]){
        if(DB["name"] == DBkey) return DB
    }
}


function createRow(ID, title){
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
            database_id: ID
        }
    
    })
}



// ========== START ==========

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})