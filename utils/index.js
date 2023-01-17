import * as fs from 'node:fs'
import { execSync } from 'child_process'
import configs from '../configs.js'

export function execute (cmd, opt) {
  let result = execSync(cmd, opt)
  return result ? result.toString() : ''
}

export function deleteDir (path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach((file, index) => {
      let curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        deleteDir(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

export function version2Date (version) {
  const matchResult = version.match(configs.sdkVersionReg)
  if (!matchResult) return
  const [, year, month, day, hour, minute, second] = matchResult
  const date = new Date()
  date.setFullYear(+year)
  date.setMonth(+month - 1)
  date.setDate(+day)
  date.setHours(+hour)
  date.setMinutes(+minute)
  date.setSeconds(+second)
  date.setMilliseconds(0)
  return date
}

export default {
  execute,
  deleteDir,
  version2Date
}
