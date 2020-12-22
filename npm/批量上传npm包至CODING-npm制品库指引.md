# 批量上传 npm 包至 CODING npm 制品库指引

## 准备工作

- CODING npm 制品库
- `nodejs` 运行环境
- `node_modules` 目录



## 快速开始

1. 将以下 `JS` 脚本添加至 `node_modules`  的同级目录下：

   ```javascript
   const fs = require('fs');
   const path = require('path');
   const { execSync } = require("child_process");
   
   
   fs.readdir(path.join(__dirname, 'node_modules'), (err, list)=>{
   
       if (!! err) {
           console.error(err)
       }
   
       list.filter(i=>fs.lstatSync(path.join(__dirname, 'node_modules',i)).isDirectory()).forEach(pkgName=>{
   
           const isPkg = fs.existsSync(path.join(__dirname,'node_modules', pkgName, 'package.json'))
   
           console.info(isPkg, pkgName)
   
           if(!isPkg){
               return
           }
          
           console.info(path.join(__dirname, '.npmrc'), path.join(__dirname,'node_modules', pkgName, '.npmrc'))
           
           fs.copyFileSync(path.join(__dirname, '.npmrc'), path.join(__dirname,'node_modules', pkgName, '.npmrc'));
   
           execSync(`cd ${path.join(__dirname,'node_modules', pkgName)} && npm publish --verbose`, (error, stdout, stderr) => {
               if (error) {
                   console.log(`error: ${error.message}`);
                   return;
               }
               if (stderr) {
                   console.log(`stderr: ${stderr}`);
                   return;
               }
               console.log(`stdout: ${stdout}`);
           });
       })
   })
   ```

2. 前往 CODING npm 仓库的指引页面，点击如下图所示按钮，输入账号密码后，会自动生成配置信息，将其复制下来：

   [![B1Z9A0.png](https://s1.ax1x.com/2020/10/28/B1Z9A0.png)](https://imgchr.com/i/B1Z9A0)

   [![B1ZB8S.png](https://s1.ax1x.com/2020/10/28/B1ZB8S.png)](https://imgchr.com/i/B1ZB8S)

3. 之后前往 `node_modules` 所在目录的同级目录下，新建文件 `.npmrc`，将上一步中复制下来的配置信息粘贴进去：

   [![B1nrvD.png](https://s1.ax1x.com/2020/10/28/B1nrvD.png)](https://imgchr.com/i/B1nrvD)

4. 最后只需要我们运行一下第一步中的 `JS` 脚本即可：

   ```shell
   node npm-uploader.js
   ```

   待脚本运行完之后，我们在相应 npm 仓库内即可看到成功上传的包列表：

   [![B1uldA.png](https://s1.ax1x.com/2020/10/28/B1uldA.png)](https://imgchr.com/i/B1uldA)



