#!/usr/bin/env node

const yargs = require('yargs')
const colors = require('chalk')
const path = require('path')
const fs = require('fs')
const shelljs = require('shelljs')
const ora = require('ora')

exports.command = 'update'
exports.desc = colors.gray('将远程代码库最新的代码更新到您的项目中')

exports.builder = yargs => {
  return yargs
    .usage(`\n${colors.cyan('用法示例:')} \n  memo update <version>`)
    .example('memo update current', colors.gray('选择线上最新版本'))
    .example('memo update version', colors.gray('选择线上指定版本'))
    .updateStrings({
      'Examples:': colors.cyan('命令:')
    })
    .help('help')
}

let tmpPath = path.resolve(process.cwd(), '.tmp/') // 获取.tmp的绝对路径 /Users/user/Desktop/test/.tmp
let destPath = process.cwd() // 获取工作区目录

if (!/.*\/$/.test(tmpPath)) tmpPath += '/' // /Users/user/Desktop/test/.tmp/
if (!/.*\/$/.test(destPath)) destPath += '/'
shelljs.rm('-rf', tmpPath)
let updateConfig = {} // 更新信息
let templateType = '' // 模板类型

// console.log(`.tmp目录${tmpPath}`)
// console.log(`工作区目录${destPath}`)

exports.handler = argv => {
  help(argv)

  // 查看当前是single or multiple
  templateType = fs.existsSync(path.resolve(__dirname, process.cwd(), 'src', 'module')) ? 'multiple' : 'single'
  let templateVersion = argv._[1]
  if (templateVersion === 'current') {
    download()
  } else if (templateVersion === 'version') {
    console.log(colors.red('暂未支持版本选择'))
  } else {
    console.log()
    console.log(colors.red('请选择版本'))
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
/**
 * 下载最新模板
 */
function download() {
  let spinner = ora(colors.cyan('正在下载模板中···'))
  spinner.start()
  console.log()
  // shelljs执行成功code为0
  if (
    shelljs.exec(
      `git clone git@git.kuainiujinke.com:frontend/vue2-multiple-page-template.git ${tmpPath} && cd ${tmpPath} && git checkout multiple && cd ${destPath}`
    ).code === 0
  ) {
    spinner.stop()
    try {
      // 获取配置信息
      updateConfig = require(tmpPath + 'scripts/update/config.js')
      operate()
    } catch (error) {
      // 输出错误信息
      console.log(colors.red(`更新信息获取失败！${error}`))
    }
  } else {
    console.log(colors.red(`更新模板失败!`))
  }
}

/**
 * 更新升级操作
 * @param {string} templateType 模板类型
 */
function operate() {
  let spinner = ora(colors.cyan('正在更新模板中···'))
  spinner.start()
  console.log()
  // console.log(templateType)
  // 切换到模板路径 目标路径 --> 目标路径
  shelljs.exec(
    `cd ${tmpPath} && git checkout ${templateType} && cd ${destPath}`
  )
  // 操作文件数组
  const deletes = updateConfig.deletes || []
  const copys = updateConfig.copys || []
  const moves = updateConfig.moves || []

  // 删除
  deletes.forEach(v => {
    let dest = destPath + v // 获得目标文件的路径
    if (fs.existsSync(dest)) {
      // 如果目标文件路径存在
      shelljs.rm('-rf', dest)
      console.log(colors.gray(`${dest} 已被删除`))
    }
  })

  // 复制
  copys.forEach(v => {
    let src = tmpPath + v
    let dest = destPath
    if (fs.existsSync(src)) {
      shelljs.cp('-Rf', src, dest)
      console.log(colors.gray(`${v} 已被复制`))
    }
  })

  // 移动
  moves.forEach(v => {
    let src = destPath + v.src
    let dest = destPath + v.dest
    if (fs.existsSync(src)) {
      shelljs.mv(src, dest)
      console.log(colors.gray(`${v.src} 已被移动到 ${v.dest}`))
    }
  })

  // 删除缓存
  shelljs.rm('-rf', tmpPath)
  spinner.stop()
  // 提示更新完成
  console.log(colors.green('更新完成'))
}
