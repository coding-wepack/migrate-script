const fs = require('fs');
const path = require('path');
const {
    execSync
} = require("child_process");


fs.readdir(path.join(__dirname, 'node_modules'), (err, list) => {

    if (!!err) {
        console.error(err)
    }

    list.filter(i => fs.lstatSync(path.join(__dirname, 'node_modules', i)).isDirectory()).forEach(pkgName => {

        const isPkg = fs.existsSync(path.join(__dirname, 'node_modules', pkgName, 'package.json'))

        console.info(isPkg, pkgName)

        if (!isPkg) {
            return
        }

        console.info(path.join(__dirname, '.npmrc'), path.join(__dirname, 'node_modules', pkgName, '.npmrc'))

        fs.copyFileSync(path.join(__dirname, '.npmrc'), path.join(__dirname, 'node_modules', pkgName, '.npmrc'));

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
