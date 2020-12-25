const fs = require('fs');
const path = require('path');
const { execSync } = require("child_process");


const publish = (modulePath)=>{
    fs.readdir(modulePath, (err, list)=>{

        if (!! err) {
            console.error(err)
            return
        }
    
        list.filter(i=>fs.lstatSync(path.join(modulePath, i)).isDirectory()).forEach(pkgName=>{
    
            const isPkg = fs.existsSync(path.join(modulePath, pkgName, 'package.json'))
    
            console.info(isPkg, pkgName)
    
            if(!isPkg){
                return
            }
           
            console.info(path.join(__dirname, '.npmrc'), path.join(modulePath, pkgName, '.npmrc'))
            
            fs.copyFileSync(path.join(__dirname, '.npmrc'), path.join(modulePath, pkgName, '.npmrc'));
    
            try {
                execSync(`cd ${path.join(modulePath, pkgName)} && npm install --registry=http://mirrors.cloud.tencent.com/npm/ --production && npm publish --verbose`);

                publish(path.join(modulePath, pkgName, 'node_modules'))
    
            } catch(e) {
                console.error(`[ERROR] upload pkg:${pkgName} failed`)
            }
        })
    })
}

publish(path.join(__dirname,'node_modules'))
