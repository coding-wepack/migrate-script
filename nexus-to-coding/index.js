const fetch = require('node-fetch')
const request = require('request')
const fs = require('fs')
const url = require('url')
const path = require('path')
const { execSync } = require('child_process')
const walkNexus2 = require('./walk-nexus-2')


const yargs = require('yargs');

const argv = yargs
    .option('source', {
        alias: 's',
        description: 'nexus repo url',
        type: 'string',
    })
    .option('source-version', {
        alias: 'sv',
        description: 'nexus version: nexus-2 or nexus-3',
        type: 'string',
        default: 'nexus-2',
    })
    .option('source-username', {
        alias: 'su',
        description: 'nexus repo username',
        type: 'string',
    })
    .option('source-password', {
        alias: 'sp',
        description: 'nexus repo password',
        type: 'string',
    })
    .option('target', {
        alias: 't',
        description: 'coding repo url',
        type: 'string',
    })
    .option('target-username', {
        alias: 'tu',
        description: 'coding repo username',
        type: 'string',
    })
    .option('target-password', {
        alias: 'tp',
        description: 'coding repo username',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv


const nexus_repo_url = argv.source
const nexus_username = argv.su
const nexus_password = argv.sp

const coding_repo_url = argv.target
const coding_username = argv.tu
const coding_password = argv.tp





const download = (source, target) => {
    const targetDir = path.dirname(target)
    
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
    }

    return new Promise((reoslve, reject) => {
        request(source, {
            auth: {
                user: nexus_username,
                pass: nexus_password,
            }
        })
        .on('error', ()=>{
            reject()
        })
        .on('end', ()=>{
            reoslve()
        })
        .pipe(fs.createWriteStream(target))
    })
}

console.info(`[INFO] started download ${nexus_repo_url}...`)
console.info(`[INFO] nexus version: ${argv.sv}`)

if (argv.sv === 'nexus-2') {
    walkNexus2(nexus_repo_url, nexus_username, nexus_password)
    .then(fileList => {
        return Promise.all(fileList.map(i => {
        
            const target = path.resolve(__dirname, `./${url.parse(i).path}`)
            console.info("---------------------")
            console.info(i)
            console.info(target)
            return download(i, target)
    
        }))
    })
    .then(()=>{
        console.info(`[INFO] started upload to ${coding_repo_url}`)

        const p = path.resolve(__dirname, `./${url.parse(nexus_repo_url).path}`)

        execSync(`java -jar migrate-local-repo-tool.jar -cd "${p}" -t ${coding_repo_url}  -u ${coding_username} -p ${coding_password}`).toString().trim()
    })
    return
}




const nexus_repo_name = url.parse(nexus_repo_url).path.split("/").filter(i=>!!i)[1]
const nexus_host = url.parse(nexus_repo_url).host

fetch(`http://${nexus_username}:${nexus_password}@${nexus_host}/service/rest/v1/assets?repository=${nexus_repo_name}`, {
    "method": "GET",
  })
  .then(res=>res.json())
  .then(res=>{
    return Promise.all(res.items.map(i => {
        
        const target = path.resolve(__dirname, `./${url.parse(i.downloadUrl).path}`)
        console.info("---------------------")
        console.info(i.downloadUrl)
        console.info(target)
        return download(i.downloadUrl, target)

    }))

  }).then(()=>{
    console.info(`[INFO] started upload to ${coding_repo_url}`)

    const p = path.resolve(__dirname, `./${url.parse(nexus_repo_url).path}`)

    execSync(`java -jar migrate-local-repo-tool.jar -cd "${p}" -t ${coding_repo_url}  -u ${coding_username} -p ${coding_password}`).toString().trim()
  });
