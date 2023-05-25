const { Client } = require("@notionhq/client")
const path = require('path')
const fs = require('fs')


const env = (function(){
    const envPath = path.join(__dirname, 'env.json')
    const envStr = fs.readFileSync(envPath, 'utf8').trim()
    return JSON.parse(envStr)
})()

const notion = new Client({
    auth: env["secret"],
})

const DBs = env["DBs"]

for(const DB of DBs)
    printDBinfo(DB)


async function printDBinfo(DB){
    const response = await notion.databases.retrieve({ database_id: DB["id"] });
    const { properties } = response;

    const columnInfo = []
    for(const key in properties){
        columnInfo.push(`\n  ${key}: ${properties[key].id}`)
    }
    const columnInfoStr = columnInfo.join("")

    console.log(`DB: ${DB["name"]} \nProperties: ${columnInfoStr}\n`)
} 