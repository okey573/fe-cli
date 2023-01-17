export default {
  vue3Template: {
    repo: 'git@gitlab.tools.vipshop.com:scp/vue3-template.git',
    branch: 'master',
    sdkPath: 'lib/Vue3AppDevSdk',
    sdkVersionPath: 'lib/Vue3AppDevSdk/version.txt'
  },
  vue3Portal: {
    repo: 'git@gitlab.tools.vipshop.com:scp/vue3-portal.git',
    branch: 'master2',
    sdkPath: 'dist/Vue3AppDevSdk',
    sdkVersionPath: 'dist/Vue3AppDevSdk/version.txt'
  },
  sdkVersionReg: /^(\d{4})(\d{2})(\d{2})d(\d{2})(\d{2})(\d{2})t$/
}
