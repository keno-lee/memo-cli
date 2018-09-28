#!/usr/bin/env node

const yargs = require('yargs')
const colors = require('chalk')
const shelljs = require('shelljs')

exports.command = 'create'
exports.describe = colors.gray('从远程代码仓库中创建一个新的本地项目')

exports.builder = yargs => {
  return yargs
    .usage(`\n${colors.cyan('用法示例:')} \n  memo create <template> [project-name]`)
    .command('mutiple', colors.gray('创建多模块本地项目'))
    .command('single', colors.gray('创建单页面本地项目'))
    .help('help')
}

let template = ''
let currentPath = ''

exports.handler = argv => {
  help(argv)
  // console.log(argv)
  if (argv._[2]) {
    template = argv._[2]
  } else {
    template = 'my-project'
  }
  currentPath = process.cwd() + '/' + template

  if (argv._[1] === 'multiple') {
    if (
      shelljs.exec(
        `git clone git@git.kuainiujinke.com:frontend/vue2-multiple-page-template.git ${currentPath} && cd ${currentPath} && rm -rf .git && git init`
      ).code === 0
    ) {
      console.log(colors.green('多模块本地项目初始化完成'))
    }

  } else if (argv._[1] === 'single') {
    if (
      shelljs.exec(
        `git clone https://git.kuainiujinke.com/frontend/vue2-multiple-page-template/tree/single ${currentPath} && cd ${currentPath} && rm -rf .git && git init`
      )
    ) {
      console.log(colors.green('单页面本地项目初始化完成'))
    }
  } else {
    console.log()
    console.log(colors.red('请输入正确的模板名'))
  }
}

/**
 * help()
 * @param {Object} argv 命令行参数对象
 */
function help(argv) {
  if (argv._.length < 2) {
    yargs.showHelp()
  }
}
