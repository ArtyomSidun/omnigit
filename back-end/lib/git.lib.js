const request = require('superagent')
const nodegit = require('nodegit')
const path = require('path')
const cmd = require('node-cmd')
const fse = require('fs-extra')
const tmpPath = '../../tmp'

class Git {
  getAccessToken(url, data) {
    return request.post(url).send(data).set('Accept', 'application/json')
  }

  async clone(url) {
    await fse.remove(tmpPath)
    return nodegit.Clone(url, tmpPath)
      .done((blob) => {
        return true
      })
  }

  async changeRemoteAddr(url) {
    return new Promise((resolve, reject) => {
      cmd.get(
        `cd ../tmp
        git remote -v
        git remote set-url origin ${url}
        git remote -v
        `,
        (err, data, stderr) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        })
    })
  }

  async push(token, name) {
    let signature = nodegit.Signature.now('OmniGit', 'omnigit@test.com')
    let repository
    let remote
    let oid
    nodegit.Repository.open(path.resolve(__dirname, '../../tmp/.git'))
      .then((repo) => {
        repository = repo
        return true
      })
      .then(() => {
        return repository.refreshIndex()
      })
      .then(() => (index) {
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
                  credentials: function (url, userName) {
                    return nodegit.Cred.userpassPlaintextNew(name, token)
                  }
                }
              }
            )
          })
      }).catch((err) => {
        console.log(err)
      })
  }
}

module.exports = new Git()
