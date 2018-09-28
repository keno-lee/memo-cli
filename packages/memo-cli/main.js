#!/usr/bin/env node

const yargs = require('yargs')
const colors = require('chalk')
const version = require('./package.json').version

yargs
  .commandDir('./bin') // 加载bin文件夹下的第一级文件，若要递归加载，提供第二个参数{recurse: true}
  .usage(`\n${colors.cyan('用法示例:')} \n  memo <command> [options]`)
  .demandCommand(1, colors.red('warning: 至少需要一个参数'))
  .updateStrings({
    'Commands:': colors.cyan('命令:'),
    'Options:': colors.cyan('选项:')
  })
  .version(version)
  .alias('h', 'help')
  .alias('v', 'version')
  .argv
