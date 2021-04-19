var glob = require("glob")

const fs = require('fs')

const path = require('path')

const { execSync } = require('child_process')
 

const base = "/Users/chenxinzhou/Documents/joWork/migrate-script/nexus-to-coding/repository/maven-releases/"

const pomBase = "/Users/chenxinzhou/Documents/joWork/migrate-script/nexus-to-coding/pom-tmp/"


const includePomFile = (path)=>{
    return new Promise((resolve, reject)=>{
        glob(`**/*.pom`, { cwd: path }, (err, files) => {
            if (err) {
                reject(err)
            }

            resolve(files.length !== 0)
        })
    })
}


// glob("/Users/chenxinzhou/Documents/joWork/migrate-script/nexus-to-coding/repository/**/**.jar", function (er, files) {

//     const jars = files.filter(f=>{
//         return fs.lstatSync(f).isFile()
//     })

//     jars.map(f=>{


//         includePomFile(path.dirname(f)).then(include => {

//             if(include){
//                 return
//             }
//             const next = f.replace(base, '')

//             const chunks = next.split("/")
            
//             const groupId = chunks.slice(0, chunks.length - 3).join(".")
    
//             const artifactId = chunks[chunks.length - 3]
    
//             const version = chunks[chunks.length - 2]
    
//             console.info("-----------")
//             console.info(groupId)
//             console.info(artifactId)
//             console.info(version)
    
//             execSync(`mvn install:install-file  -Dfile=${f} -DgroupId=${groupId} -DartifactId=${artifactId} -Dversion=${version} -Dpackaging=jar -DgeneratePom=true -DlocalRepositoryPath=./pom-tmp`)
    
    
    
//         })

//     })
// })


// glob("/Users/chenxinzhou/Documents/joWork/migrate-script/nexus-to-coding/pom-tmp/**/**.pom", function (er, files) {

//     const poms = files.filter(f=>{
//         return fs.lstatSync(f).isFile()
//     })

    

//     poms.forEach(p=>{


//         const targetPath = path.resolve(base, p.replace(pomBase, ""))

//         console.info(`${p} -> ${targetPath}`)

//         execSync(`mv ${p} ${targetPath}`)

//     })
// })


glob("/Users/chenxinzhou/Documents/joWork/migrate-script/nexus-to-coding/repository/**/*.pom", function (er, files) {

    const poms = files.filter(f=>{
        return fs.lstatSync(f).isFile()
    })

    

    const list = poms.map(p=>{
        return {
            source: p,
            target: p.replace("/Users/chenxinzhou/Documents/joWork/migrate-script/nexus-to-coding/repository/maven-releases/", "https://codingcorp-maven.pkg.coding.net/repository/my-registry-test/test-xx123/")
        }
    })

    console.info(list)


})