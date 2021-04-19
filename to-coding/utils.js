const request = require('request')
const fs = require('fs')
const path = require('path')

const retry = true

const download = (source, target, auth) => {
    const targetDir = path.dirname(target)
    
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
    }

    return new Promise((resolve, reject) => {
        request(source, {
            auth
        })
        .on('error', (e)=>{
            reject(e)
        })
        .on('response', function(response) {
            if(response.statusCode >= 200 && response.statusCode < 400) {
                resolve()
                return
            }
            console.error(response.statusCode, response.statusMessage)
            reject(`${response.statusCode} ${response.statusMessage}`)
        })
        .on('end', ()=>{
            resolve()
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

            if(response.statusCode === 409 ) {
                console.warn(`[WARN] skip upload: ${response.statusCode} ${response.statusMessage}`)
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