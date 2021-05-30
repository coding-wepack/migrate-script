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
          if (retry) {
            console.info()
            console.error(`[WARN] upload ${source} to ${target} failed, retring...`)
            return upload(source, target)
          }
          return Promise.reject(e)
        }))
    })
}





function walk(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (error, files) => {
      if (error) {
        return reject(error);
      }
      Promise.all(files.map((file) => {
        return new Promise((resolve, reject) => {
          const filepath = path.join(dir, file);
          fs.stat(filepath, (error, stats) => {
            if (error) {
              return reject(error);
            }
            if (stats.isDirectory()) {
              walk(filepath).then(resolve);
            } else if (stats.isFile()) {
              resolve(filepath);
            }
          });
        });
      }))
      .then((foldersContents) => {
        resolve(foldersContents.reduce((all, folderContents) => all.concat(folderContents), []));
      });
    });
  });
}

module.exports = {
    upload,
    download,
    walk,
}