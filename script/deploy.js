const os = require('os')
const path = require('path')
const _ = require('lodash')
const dayjs = require('dayjs')
const node_ssh = require('node-ssh')
const ora = require('ora')

const spinner = ora(`uploading ${process.env.NODE_ENV} ...`)
const deploy_dir = '/var/www/app-taxi-frontend'
const distDirectory = path.join(deploy_dir, 'current')

async function deploy(host) {
  const ssh = new node_ssh()
  try {
    await ssh.connect({
      host,
      username: 'deploy',
      privateKey: `${os.homedir()}/.ssh/id_rsa`
    })

    const remoteDirectory = path.join(deploy_dir, 'releases', dayjs().format('YYYY-MM-DD_HH_mm'))

    await ssh.putDirectory(path.resolve('dist/build/h5'), `${remoteDirectory}/frontend`, {
      recursive: true,
      concurrency: 1,
      validate: itemPath => !/\.map$/.test(itemPath)
    })

    await ssh.execCommand(`ln -sfn ${remoteDirectory} ${distDirectory}`)

    // 只保留最后5个版本
    const { stdout } = await ssh.execCommand(`ls ${path.join(deploy_dir, 'releases')}`)
    const arr = _.sortBy(_.split(stdout, '\n'))
    await ssh.execCommand(`rm -rf ${_.dropRight(arr, 5).map(name => path.join(deploy_dir, 'releases', name)).join(' ')}`)
    ssh.dispose()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

const host = {
  staging: '',
  production: '',
}[process.env.NODE_ENV]

spinner.start()
deploy(host).finally(() => spinner.stop())
