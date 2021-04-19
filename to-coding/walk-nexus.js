const fetch = require('node-fetch')
const { parse } = require('node-html-parser')
const url = require('url')



const walkNexus2 = (r, u, p) => {

    console.info(`[INFO] started walk nexus2 repo: ${r}`)

    const result = []

    const timer = setInterval(()=>{
        console.log(`.`)
    }, 1000)

    const _walkNexus2 = (repoUrl, username, password) => {

        const secert = `${username}:${password}`

        return fetch(repoUrl, {
            "method": "GET",
            headers: {
                "Authorization": `Basic ${Buffer.from(secert).toString("base64")}`
            }
        })
        .then(res=>res.text())
        .then(res=>{
            return Promise.all(parse(res).querySelectorAll("a").map(i=>{
                const link = i.getAttribute('href')

                
                const host = url.parse(repoUrl).host

                const protocol = url.parse(repoUrl).protocol
                
                if (!link.startsWith(`${protocol}//${host}`)) {
                    return Promise.resolve()
                }

                if (link.endsWith("/")) {
                    return _walkNexus2(link, username, password)
                }

                result.push(link)
                return Promise.resolve()
            }))
        }).catch(e => {
            // console.error(e)
            console.error(`[WARN] walk ${repoUrl} failed, retrying...`)
            return _walkNexus2(repoUrl, username, password)
        })
    }

    return _walkNexus2(r, u, p).then(() => {
        console.info(`[INFO] walk nexus2 repo: ${r} count: ${result.length}`)
        clearInterval(timer)
        return result
    })
}


const joinPath = (originUrl, path) => {
    if(originUrl.endsWith("/")) {
        return `${originUrl}${path}`
    }

    return `${originUrl}/${path}`
}

const walkNexus3 = (r, u, p) => {

    console.info(`[INFO] started walk nexus3 repo: ${r}`)

    const result = []

    const timer = setInterval(()=>{
        console.log(`.`)
    }, 1000)

    const _walkNexus3 = (repoUrl, username, password) => {

        const secert = `${username}:${password}`
    
        return fetch(repoUrl, {
            "method": "GET",
            headers: {
                "Authorization": `Basic ${Buffer.from(secert).toString("base64")}`
            }
        })
        .then(res=>res.text())
        .then(res=>{
            return Promise.all(parse(res).querySelectorAll("a").map(i=>{
                const link = i.getAttribute('href')
    
                
                if( link.startsWith("../")) {
                    return Promise.resolve()
                }
    
                
                if (link.endsWith("/")) {
                    
                    return _walkNexus3(joinPath(repoUrl, link), username, password)
                }
    
                const host = url.parse(repoUrl).host
    
                const protocol = url.parse(repoUrl).protocol
                
                if (link.startsWith(`${protocol}//${host}`)) {
                    result.push(link)
                    return Promise.resolve()
                }
    
                result.push(joinPath(repoUrl, link))
    
                return Promise.resolve()
            }))
        }).catch(e => {
            // console.error(e)
            console.error(`[WARN] walk ${repoUrl} failed, retrying...`)
            return _walkNexus3(repoUrl, username, password)
        })
    }

    return _walkNexus3(r, u, p).then(() => {
        console.info(`[INFO] walk nexus3 repo: ${r} count: ${result.length}`)
        clearInterval(timer)
        return result
    })
}


module.exports = {
    walkNexus2: (repoUrl, username, password) => {
        return walkNexus2(repoUrl, username, password)
    },
    walkNexus3: (repoUrl, username, password) => {
        return walkNexus3(repoUrl, username, password)
    }
}