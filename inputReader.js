const readline = require('readline')

const SELECT_DB_PROMPT = "Select DB: "
let wasProvidedArgument

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})



async function getSelectedDB() {
    return getArgStr() || await readLine(SELECT_DB_PROMPT)
}


function getArgStr(){
    const args = process.argv.slice(2)
    const arg = args.join(' ')
    wasProvidedArgument = (Boolean(arg))
    return arg
}

function readLine(prompt){
    return new Promise((resolve, _) => {
        rl.question(prompt, (answer) => {
            resolve(answer)
        })
    })
}

function providedArgument(){
    return wasProvidedArgument
}

function close(){
    rl.close()
}

module.exports = {
    SELECT_DB_PROMPT,
    getSelectedDB, 
    readLine,
    providedArgument,
    close
}