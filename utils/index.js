import { execSync } from 'child_process'

export function execute (cmd, opt) {
  let result = execSync(cmd, opt)
  return result ? result.toString() : ''
}

export default {
  execute
}
