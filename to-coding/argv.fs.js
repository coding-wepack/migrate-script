const yargs = require('yargs');

const argv = yargs
    .option('source-path', {
        alias: 'sp',
        description: 'source file path, example: /root/workspace/com/',
        type: 'string',
        require: true,
    })
    .option('target', {
        alias: 't',
        description: 'coding repo url',
        type: 'string',
        // require: true,
    })
    .option('target-username', {
        alias: 'tu',
        description: 'coding repo username',
        type: 'string',
        // require: true,
    })
    .option('target-password', {
        alias: 'tp',
        description: 'coding repo username',
        type: 'string',
        // require: true,
    })
    .option('retry', {
        alias: 'r',
        description: 'retry when request failed',
        type: "boolean",
        default: true,
    })
    .option('type', {
        description: 'support: maven',
        type: 'string',
        default: 'maven',
    })   
    .help()
    .alias('help', 'h')
    .argv

module.exports = argv