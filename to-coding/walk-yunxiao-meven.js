// 获取 yunxiao-maven-files.json
// 请复制以下脚本，在云效制品仓库页面，打开 console 控制台，执行后即可获得 yunxiao-maven-files.json 下载

(()=>{

    const REPO_ID = "请将此处换成云效仓库的 ID"

    const isSnaphost = REPO_ID.includes("snapshot")

    fetch("https://packages.aliyun.com/api/repo/maven/list?_input_charset=utf-8", {
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
    }).then(res=>res.json()).then(res=>{

        // return res.object.map(i=>i.id)

        return [REPO_ID]
        
    }).then(ids=>{
        return Promise.all(ids.map(repoId=>{
            return fetch(`https://packages.aliyun.com/api/repo/maven/${repoId}/artifactGroups?pageSize=1000&pageStart=0&_input_charset=utf-8`, {
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }).then(res=>res.json()).then(res=> res.object.dataList.reduce((total, item) => {

                return [...total, ...item.versions.map(v=>{
                    return {
                        artifactId: item.artifactId,
                        groupId: item.groupId,
                        repositoryId: item.repositoryId,
                        version: v,
                    }
                })]
            

            },[]))
        }))
    }).then(repoArtifactGroup=>{

        const versions = repoArtifactGroup.reduce((total, item)=>{  return [...total,...item] },[])

        const pms = versions.map(v=>{
            return fetch(`https://packages.aliyun.com/api/repo/maven/${v.repositoryId}/artifactGroup/details?groupId=${v.groupId}&artifactId=${v.artifactId}&version=${v.version}&_input_charset=utf-8`, {
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
            }).then(res=>res.json()).then(res=>{
                
                const files = res.object.map(file=>{
                    return {
                        ...v,
                        fileName: file.fileName,
                        downloadUrl : file.url,
                    }
                })

                if (isSnaphost && res.object.length>0 ){

                    // const downloadUrl = 

                    return [
                        ...files,
                        {
                            ...v,
                            fileName: "maven-metadata.xml",
                            downloadUrl: `https://placeholder/repository/${v.repositoryId}/${v.groupId.replace(/\./g , "/")}/${v.artifactId}/${v.version}/maven-metadata.xml`
                        }
                    ]
                }

                return files

            
            });
        })

        return Promise.all(pms)

    }).then(res=>{

        const files = res.reduce((total, item)=>{  return [...total,...item] },[]).map(i=>({...i, repoPath: `https://packages.aliyun.com/maven/repository/${i.repositoryId}` }))

        var blob = new Blob([JSON.stringify(files,null,2)], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

        a.download = "yunxiao-artifacts.json"
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    });





})()
