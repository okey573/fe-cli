#!/usr/bin/env node

import { program } from 'commander'
import createApp from './scripts/create-app/index.js'
import updateSdk from './scripts/update-sdk/index.js'

function main () {

  program
    .version('1.0.0')
    .parse(process.argv)

  program
    .command('create-app')
    .argument('[name]', '工程名称和接入域名称')
    .description('创建模板一个工程')
    .action(createApp)

  program
    .command('update-sdk')
    .description('升级sdk')
    .action(updateSdk)

  program.parse(process.argv)
}

main()
