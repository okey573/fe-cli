import * as fs from 'node:fs'

function deleteDir (path) {
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

export default deleteDir
