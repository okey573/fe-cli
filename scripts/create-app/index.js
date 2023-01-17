import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import prompts from 'prompts'
import { red, green, bold } from 'kolorist'
import renderTemplate from './renderTemplate.js'
import configs  from '../../configs.js'
import { execute, deleteDir } from '../../utils/index.js'

export default async function (argName) {
  if (argName && (!argName.startsWith('vc-') && !argName.startsWith('vup-'))) {
    console.log(red(`项目名必须以【vc-】或者【vup-】开头`))
    process.exit(1)
  }

  const cwd = process.cwd()
  let result = {}
  try {
    result = await prompts(
      [
        {
          name: 'projectName',
          type: argName ? null : 'text',
          message: '项目名：',
          validate: projectName => {
            if (!projectName.startsWith('vc-') && !projectName.startsWith('vup-')) {
              return '项目名必须以【vc-】或者【vup-】开头'
            }
            return true
          }
        },
        {
          type: argName ? null : 'text',
          name: 'appName',
          message: '接入域名（英文）：',
          initial: (prev, values) => {
            return values.projectName
          }
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' 操作被取消')
        }
      }
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }

  const projectName = argName ?? result.projectName
  const appName = argName ?? result.appName
  const root = path.join(cwd, projectName)

  if (fs.existsSync(root)) {
    console.log(red(`${root}已存在`))
    process.exit(1)
  }
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  console.log(`\nScaffolding project in ${root}...`)

  const pkg = {
    name: projectName,
    version: '0.0.0'
  }
  const author = `${execute('git config user.name').trim()} <${execute('git config user.email').trim()}>`
  fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify({ ...pkg, author }, null, 2))
  fs.writeFileSync(path.resolve(root, 'package-lock.json'), JSON.stringify(pkg, null, 2))

  const tempTemplateDir = fileURLToPath(new URL('./template', import.meta.url))
  const { repo, branch } = configs.vue3Template
  execute(`git clone ${repo} --branch=${branch} --depth=1 ${tempTemplateDir}`)
  renderTemplate({
    src: tempTemplateDir,
    dest: root,
    appName: appName
  })
  deleteDir(tempTemplateDir)

  const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(`  ${bold(green(`cd ${path.relative(cwd, root)}`))}`)
  }
  console.log(`  ${bold(green(`${packageManager} install`))}`)
  console.log(`  ${bold(green(`${packageManager} run dev`))}`)
  console.log()
}
