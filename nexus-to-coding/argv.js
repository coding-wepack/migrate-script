const yargs = require('yargs');

const argv = yargs
    .option('source-version', {
        alias: 'sv',
        description: 'nexus version: nexus-2 or nexus-3',
        type: 'string',
        default: 'nexus-2',
    })
    .option('source', {
        alias: 's',
        description: 'nexus repo url',
        type: 'string',
    })
    .option('source-username', {
        alias: 'su',
        description: 'nexus repo username',
        type: 'string',
    })
    .option('source-password', {
        alias: 'sp',
        description: 'nexus repo password',
        type: 'string',
    })
    .option('target', {
        alias: 't',
        description: 'coding repo url',
        type: 'string',
    })
    .option('target-username', {
        alias: 'tu',
        description: 'coding repo username',
        type: 'string',
    })
    .option('target-password', {
        alias: 'tp',
        description: 'coding repo username',
        type: 'string',
    })
    .option('retry', {
        alias: 'r',
        description: 'retry when request failed',
        type: "boolean"
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