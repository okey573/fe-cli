import * as fs from 'node:fs'
import * as path from 'node:path'
import deepMerge from './deepMerge.js'
import sortDependencies from './sortDependencies.js'

function renderTemplate ({ src, dest, appName }) {
  const stats = fs.statSync(src)

  if (stats.isDirectory()) {
    if (path.basename(src) === 'node_modules' || path.basename(src) === '.git') {
      return
    }

    fs.mkdirSync(dest, { recursive: true })
    for (const file of fs.readdirSync(src)) {
      renderTemplate({
        src: path.resolve(src, file),
        dest: path.resolve(dest, file),
        appName
      })
    }
    return
  }

  const filename = path.basename(src)

  if ((filename === 'package.json' || filename === 'package-lock.json') && fs.existsSync(dest)) {
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const templatePackage = JSON.parse(fs.readFileSync(src, 'utf8'))
    const pkg = sortDependencies(deepMerge(templatePackage, existing))
    fs.writeFileSync(dest, JSON.stringify(pkg, null, 2) + '\n')
    return
  }

  if (filename.startsWith('_')) {
    // rename `_file` to `.file`
    dest = path.resolve(path.dirname(dest), filename.replace(/^_/, '.'))
  }

  if (filename === '_gitignore' && fs.existsSync(dest)) {
    // append to existing .gitignore
    const existing = fs.readFileSync(dest, 'utf8')
    const newGitignore = fs.readFileSync(src, 'utf8')
    fs.writeFileSync(dest, existing + '\n' + newGitignore)
    return
  }

  // 下面这个文件中含有需要替换的变量
  if (filename === 'env.config.js') {
    const defaultText = fs.readFileSync(src, 'utf8')
    fs.writeFileSync(dest, defaultText.replace('$appName$', appName))
    return
  }

  fs.copyFileSync(src, dest)
}

export default renderTemplate
