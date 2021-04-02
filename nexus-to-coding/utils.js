const request = require('request')
const fs = require('fs')
const path = require('path')

const argv = require('./argv')

const retry = argv.retry

const download = (source, target, auth) => {
    const targetDir = path.dirname(target)
    
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
    }

    return new Promise((reoslve, reject) => {
        request(source, {
            auth
        })
        .on('error', (e)=>{
            reject(e)
        })
        .on('end', ()=>{
            reoslve()
        })
        .pipe(fs.createWriteStream(target))
    }).catch((e)=>{
        if (retry) {
            console.info()
            console.error(`[WARN] download ${source} to ${target} failed, retring...`)
            return download(source, target)
        }
        return Promise.reject(e)

    })
}

const upload = (source, target, auth) => {
    return new Promise((resolve, reject)=> {
        fs.createReadStream(source).pipe(request.put(target, {
            auth
        }).on('response', function(response) {

            if(response.statusCode >= 200 && response.statusCode < 400) {
                resolve()
                return
            }
            console.error(response.statusCode, response.statusMessage)
            reject(response.statusMessage)
    
        }).on('error', function(err) {
            console.error(err)
            reject(err)
        }))
    })
}

module.exports = {
    upload,
    download,
}