const url = require('url')
const path = require('path')
const _ = require('lodash')
const BlueBirdPromise = require("bluebird")
const { walkNexus2, walkNexus3 } = require('./walk-nexus')
const cliProgress = require('cli-progress')
const urljoin = require('url-join')
const { upload, download } = require('./utils')

const argv = require('./argv')

const nexus_repo_url = _.trim(argv.source)
const nexus_username = _.trim(argv.su)
const nexus_password = _.trim(argv.sp)

const coding_repo_url = _.trim(argv.target)
const coding_username = _.trim(argv.tu)
const coding_password = _.trim(argv.tp)

console.info(`[INFO] nexus version: ${argv.sv}`)

const walkHandler = argv.sv === 'nexus-2' ? walkNexus2: walkNexus3;

const downloadFiles = fileList => {
    const downloadProgressBar = new cliProgress.SingleBar({
        format: 'Download Files |' + '{bar}' + '| {percentage}% || {value}/{total} Files || Source: {source}',
    }, cliProgress.Presets.shades_classic);

    downloadProgressBar.start(fileList.length, 0)

    let downloadedCount = 0

    return BlueBirdPromise.map(fileList, fileItem => {
        downloadProgressBar.update(downloadedCount, fileItem)
        return download(
            fileItem.source, 
            fileItem.target,
            {
                user: nexus_username,
                pass: nexus_password
            }
        ).then(()=>{
            downloadedCount ++
            downloadProgressBar.update(downloadedCount)
            return Promise.resolve()
        })
    }, { concurrency: 10 }).then(()=>{
        downloadProgressBar.stop()
    })
}

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


const getMavenWalkRepoUrl = (repoUrl) => {
    if (argv.sv === 'nexus-2') {
        return repoUrl
    }

    // http://127.0.0.1:8081/repository/maven-public/ -> http://127.0.0.1:8081/service/rest/repository/browse/maven-public/
    const u = url.parse(repoUrl)

    const [layout, repoName] = u.path.split("/").filter(i => !!i)

    return urljoin(`${u.protocol}${u.host}`, "service/rest", layout, "browse", repoName, "/")

}


if (argv.type === 'maven') {

    walkHandler(getMavenWalkRepoUrl(nexus_repo_url), nexus_username, nexus_password).then(fileList=>{
        
        const downloadFileList = fileList.map(f => {
            const localPath = path.resolve(__dirname, `./${url.parse(f).path}`)
            return {
                target: localPath,
                source: f
            }
        })

        const uploadFileList = process.env.DOWNLOAD_ONLY === "true" ? [] : fileList.map(f => {
            try {
                const source = path.resolve(__dirname, `./${url.parse(f).path}`)
                // http://127.0.0.1:8081/content/repositories/releases/aopalliance/aopalliance/1.0/aopalliance-1.0.jar -> aopalliance/aopalliance/1.0/aopalliance-1.0.jar
                const targetPath = f.replace(nexus_repo_url, "")

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
        
        return downloadFiles(downloadFileList).then(()=> uploadFiles(uploadFileList)).catch(e=>{
            console.error(e)
        }).then(()=>{
            console.info("[INFO] migrate nexus to coding completed")
            console.info(`[INFO] source repo: ${nexus_repo_url}`)
            console.info(`[INFO] target repo: ${coding_repo_url}`)
            console.info(`[INFO] file count: ${fileList.length}`)
        })
    })
}

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    process.exit();
});