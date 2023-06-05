const readline = require('readline')

const SELECT_DB_PROMPT = "Select DB: "

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})



async function getSelectedDB() {
    return getArgStr() || await readLine(SELECT_DB_PROMPT)
}


function getArgStr(){
    const args = process.argv.slice(2)
    return args.join(' ')
}

function readLine(prompt){
    return new Promise((resolve, _) => {
        rl.question(prompt, (answer) => {
            resolve(answer)
        })
    })
}

function close(){
    rl.close()
}

module.exports = {
    SELECT_DB_PROMPT,
    getSelectedDB, 
    readLine,
    close
}