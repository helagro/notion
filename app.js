const { Client } = require("@notionhq/client")
const fs = require('fs')
const path = require('path')
const rl = require('readline-sync')



const env = (function(){
    const envPath = path.join(__dirname, 'env.json')
    const envStr = fs.readFileSync(envPath, 'utf8').trim()
    return JSON.parse(envStr)
})()

const notion = new Client({
  auth: env["secret"],
})


function main(){
    const DBname = selectDB()
    const content = rl.question(`Content: `)

    processInput(DBname, content)
}


function selectDB(){
    const availableDBs = env["DBs"].map(DB => DB["name"])
    const availableDBsStr = availableDBs.join(", ")
    const DB = rl.question(`Select DB (${availableDBsStr}): `)

    const validDB = availableDBs.includes(DB)
    if(!validDB){
        console.log("Invalid DB!")
        return selectDB()
    }

    return DB
}


function processInput(DBname, content){
    const DB = getDB(DBname)

    const items = content.split("|")
    createRow(DB, items)

    return "success"
}


function getDB(DBkey){
    for(const DB of env["DBs"]){
        if(DB["name"] == DBkey) return DB
    }
}


function createRow(DB, items){
    const columns = DB["columns"] || []
    const extraColumnAmt = Math.min(columns.length, items.length-1)
    const properties = {}

    addColumn(properties, "title", "title", items[0])

    for(let i = 0; i < extraColumnAmt; i++)
        addColumn(properties, columns[i], "rich_text", items[i + 1])

        
    notion.pages.create({
        properties: properties,
        parent: {
            database_id: DB["id"]
        }
    })
}


function addColumn(properties, name, type, content){
    properties[name] = {
        "type": type,
        [type]: [
            { "type": "text", "text": { "content": content } }
        ]
    }
}


// ========== START ==========

main()
