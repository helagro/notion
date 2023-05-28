const { Client } = require("@notionhq/client")
const fs = require('fs')
const path = require('path')

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})



const envPromise = (async function () {
    const envPath = path.join(__dirname, 'env.json')
    const envStr = fs.readFileSync(envPath, 'utf8').trim()
    return JSON.parse(envStr)
})()

const notionPromise = (async function () {
    const env = await envPromise
    return new Client({
        auth: env["secret"],
    })
})()



async function main() {
    const DBname = await selectDB()
    const DBpromise = getDB(DBname)

    const content = await readLine("Content: ")
    const items = content.split("|")

    const DB = await DBpromise
    createRow(DB, items)

    rl.close();
}


async function selectDB() {
    const DB = await readLine("Select DB: ")

    const env = await envPromise
    const availableDBs = env["DBs"].map(DB => DB["name"])

    const isDBvalid = availableDBs.includes(DB)
    if (!isDBvalid) {
        const availableDBsStr = availableDBs.join(", ")
        console.log(`Invalid database name\nValid options are: ${availableDBsStr}`)
        return selectDB()
    }

    return DB
}


function readLine(prompt){
    return new Promise(resolve => {
        rl.question(prompt, answer => {
            resolve(answer)
        })
    })
}


async function getDB(DBkey) {
    const env = await envPromise

    for (const DB of env["DBs"]) {
        if (DB["name"] == DBkey) return DB
    }
}


function createRow(DB, items) {
    const columns = DB["columns"] || []
    const extraColumnAmt = Math.min(columns.length, items.length - 1)
    const properties = {}

    addColumn(properties, "title", "title", items[0])

    for (let i = 0; i < extraColumnAmt; i++)
        addColumn(properties, columns[i], "rich_text", items[i + 1])

    pushNotion(DB, properties)
}


function addColumn(properties, name, type, content) {
    properties[name] = {
        "type": type,
        [type]: [
            { "type": "text", "text": { "content": content } }
        ]
    }
}


async function pushNotion(DB, properties) {
    const notion = await notionPromise

    notion.pages.create({
        properties: properties,
        parent: {
            database_id: DB["id"]
        }
    })
}



// ========== START ==========

main()
