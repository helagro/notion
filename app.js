const { Client } = require("@notionhq/client")
const fs = require('fs')
const path = require('path')

const env = (function(){
    const envPath = path.join(__dirname, 'env.json')
    const envStr = fs.readFileSync(envPath, 'utf8').trim()
    return JSON.parse(envStr)
})()



// Initializing a client
const notion = new Client({
  auth: env["secret"],
})


function createRow(title){
    const newEntry = {
        title: [
            {
                text: {
                content: 'New entry name'
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

