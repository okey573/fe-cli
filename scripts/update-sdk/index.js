import { fileURLToPath } from 'node:url'
import configs from '../../configs.js'
import { execute, version2Date, deleteDir } from '../../utils/index.js'
import fs from 'node:fs'
import path from 'node:path'
import { red, green, bold } from 'kolorist'
import renderTemplate from '../create-app/renderTemplate.js'

export default function () {
  const { repo, branch, sdkPath: latestSdkPath, sdkVersionPath: latestVersionPath } = configs.vue3Portal
  // const { repo, branch, sdkPath: latestSdkPath, sdkVersionPath: latestVersionPath } = configs.vue3Template
  const { sdkPath: localSdkPath, sdkVersionPath: localVersionPath } = configs.vue3Template
  const cwd = process.cwd()
  let localSdkVersion
  let latestSdkVersion
  console.log(`\n正在读取sdk版本信息...`)
  try {
    localSdkVersion = fs.readFileSync(path.join(cwd, localVersionPath), 'utf8')
  } catch (e) {
    console.log(red(`读取本地sdk版本信息失败，请在通过vue3模板创建的工程根目录下执行命令`))
    process.exit(1)
  }
  const tempSdkDir = fileURLToPath(new URL('./sdk', import.meta.url))
  execute(`git clone ${repo} --branch=${branch} --depth=1 ${tempSdkDir}`)
  try {
    latestSdkVersion = fs.readFileSync(path.join(tempSdkDir, latestVersionPath), 'utf8')
  } catch (e) {
    console.log(red(`获取git仓库中sdk版本信息失败`))
    process.exit(1)
  }
  // 比较版本信息
  const localSdkVersionDate = version2Date(localSdkVersion.trim())
  const latestSdkVersionDate = version2Date(latestSdkVersion.trim())
  if (localSdkVersionDate.getTime() >= latestSdkVersionDate.getTime()) {
    console.log(green(`当前sdk已是最新版本`))
    deleteDir(tempSdkDir)
    process.exit(1)
  } else {
    console.log(`\n正在更新sdk...`)
    deleteDir(path.join(cwd, localSdkPath))
    renderTemplate({
      src: path.join(tempSdkDir, latestSdkPath),
      dest: path.join(cwd, localSdkPath)
    })
    deleteDir(tempSdkDir)
    console.log()
    console.log(green(`sdk更新成功，更新后Sdk版本为${bold(latestSdkVersion)}`))
  }
}
