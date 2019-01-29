const request = require('superagent')
const nodegit = require('nodegit')
const cmd = require('node-cmd')
const fse = require('fs-extra')
const AppError = require('../AppError')
const tmpPath = '../tmp'

class Git {
  getAccessToken (url, data, header, type) {
    return request.post(url).send(data).set(header, type)
      .then((date) => {
        return date
      })
  }

  getUserInfo (url) {
    return request.get(url).then((date) => {
      return date
    })
  }

  async clone (url) {
    await fse.remove(tmpPath)
    await nodegit.Clone(url, tmpPath).catch(() => {
      throw new AppError({
        name: 'CLONE_ERROR',
        message: 'The repo not cloned',
        status: 500
      })
    })
    return true
  }

  async changeRemoteAddr (url) {
    return new Promise((resolve, reject) => {
      cmd.get(
        `cd ${tmpPath}
        git remote -v
        git remote set-url origin ${url}
        git remote -v
        `,
        (err, data, stderr) => {
          if (err) {
            throw new AppError(err)
          }
          resolve(data)
        })
    })
  }

  async push (token, name) {
    let signature = nodegit.Signature.now('OmniGit', 'omnigit@test.com')
    let repository
    let remote
    let oid
    return nodegit.Repository.open(`${tmpPath}/.git`)
      .then((repo) => {
        repository = repo
        return true
      })
      .then(() => {
        return repository.refreshIndex()
      })
      .then((index) => {
        return index.writeTree()
      })
      .then((oidResult) => {
        oid = oidResult
        return nodegit.Reference.nameToId(repository, 'HEAD')
      })
      .then((head) => {
        return repository.getCommit(head)
      })
      .then((parent) => {
        return repository.createCommit('HEAD', signature, signature, 'initial commit', oid, [parent])
      })
      .then(() => {
        return repository.getRemote('origin')
          .then((remoteResult) => {
            remote = remoteResult
            return remote.push(
              ['refs/heads/master:refs/heads/master'],
              {
                callbacks: {
                  credentials: (url, userName) => {
                    return nodegit.Cred.userpassPlaintextNew(name, token)
                  }
                }
              }
            )
          })
      }).catch((error) => {
        throw new AppError({
          name: 'PUSH_ERROR',
          message: 'The repo not pushed',
          status: 500
        })
      })
  }
}

module.exports = Git
