const fetch = require('node-fetch')
const { parse } = require('node-html-parser')
const url = require('url')

const result = []

const walkNexus2 = (repoUrl, username, password) => {

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
                return walkNexus2(link, username, password)
            }

            result.push(link)
            // console.info(result)
            return Promise.resolve()
        }))
    })
}



module.exports = (repoUrl, username, password) => {
    return walkNexus2(repoUrl, username, password).then(()=>result)
}