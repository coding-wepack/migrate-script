const url = require('url')
const path = require('path')
const BlueBirdPromise = require("bluebird")
const { walkNexus2, walkNexus3 } = require('./walk-nexus')
const cliProgress = require('cli-progress')
const urljoin = require('url-join')
const { upload, walk } = require('./utils')
const glob = require('glob')

const argv = require('./argv.fs')

const coding_repo_url = argv.target 
const coding_username = argv.tu
const coding_password = argv.tp 


const uploadFiles = fileList => {
    
    const uploadProgressBar = new cliProgress.SingleBar({
        format: 'Upload Files |' + '{bar}' + '| {percentage}% || {value}/{total} Files || Target: {target}',
    }, cliProgress.Presets.shades_classic);

    uploadProgressBar.start(fileList.length, 0)

    let uploadedCount = 0

    return BlueBirdPromise.map(fileList, fileItem => {
        uploadProgressBar.update(uploadedCount, fileItem)

        return upload(
            fileItem.source, 
            fileItem.target,
            {
                user: coding_username,
                pass: coding_password
            }
        ).then(()=>{
            uploadedCount ++
            uploadProgressBar.update(uploadedCount)
            return Promise.resolve()
        })
    }, { concurrency: 10 }).then(()=>{
        uploadProgressBar.stop()
    })
}


const walkHandler = () => {
    console.info("[INFO] started walk: ",argv.sp)

    return walk(argv.sp)
}


if (argv.type === 'maven') {

    walkHandler().then(fileList=>{

        

        const uploadFileList = fileList.map(f => {
            try {
                const source = f
                // http://127.0.0.1:8081/content/repositories/releases/aopalliance/aopalliance/1.0/aopalliance-1.0.jar -> aopalliance/aopalliance/1.0/aopalliance-1.0.jar
                const targetPath = f.replace(path.resolve(__dirname, argv.sp), "").slice(1)

                const target = urljoin(coding_repo_url, targetPath)



                return {
                    target,
                    source,
                }
            } catch(e) {
                console.error(e)
                console.error(f)
            }
        })
        
        return uploadFiles(uploadFileList).catch(e=>{
            console.error(e)
        }).then(()=>{
            console.info("[INFO] migrate nexus to coding completed")
            console.info(`[INFO] target repo: ${coding_repo_url}`)
            console.info(`[INFO] file count: ${fileList.length}`)
        })
    })
}

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    process.exit();
});