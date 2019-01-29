import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from './service/http.service'
import { NotificationsService } from 'angular2-notifications'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  step
  gitRepos: Object[]
  selectedRepo
  repoName
  data

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private _service: NotificationsService) {
  }
  ngOnInit () {
    this.step = {
      one: true,
      two: false,
      three: false
    }
    this.gitRepos = [
      {
        id: 0,
        name: 'GitHub',
        url: 'https://github.com/login/oauth/authorize?client_id=c49323c1ab4dbf2ef975&scope=repo'
      },
      {
        id: 1,
        name: 'GitLab',
        url: 'https://gitlab.com/oauth/authorize?client_id=d4388c1e51bf2d39390df722ad1479e585e7e080014da165977fe379b1f32124&response_type=code&redirect_uri=https://omnigit.herokuapp.com/?repo=gitlab'
      },
      {
        id: 2,
        name: 'Bitbucket',
        url: 'https://bitbucket.org/site/oauth2/authorize?client_id=2VQjjTrmsrytyFRAYV&response_type=code'
      }
    ]

    this.selectedRepo = 0
    this.route.queryParams.subscribe(params => {
      this.data = {
        providerName: params.repo,
        code: params.code
      }

      if (params.repo && params.code) {
        if (localStorage.getItem('step') === 'three') {
          this.data.repoName = localStorage.getItem('repoName')
          this.httpService.post('push_repo', this.data)
            .subscribe(
              (res) => {
                if (res) {
                  this.showSuccess('Successfully migrate')
                  setTimeout(() => {
                    localStorage.removeItem('step');
                    localStorage.removeItem('repoName');
                    window.location.href = '/'
                  }, 1000)
                }
              },
              (error) => {
                this.showError(error.error)
                setTimeout(() => {
                  localStorage.removeItem('step');
                  localStorage.removeItem('repoName');
                  window.location.href = '/'
                }, 2000)
              }
            )
        } else {
          this.step.one = false
          this.step.two = true
        }
      }
    });
  }

  sendData () {
    this.data.repoName = this.repoName
    this.httpService.post('get_current_repo', this.data)
      .subscribe(
        (res) => {
          if (res) {
            localStorage.setItem('step', 'three');
            localStorage.setItem('repoName', this.repoName)
            this.step.two = false
            this.step.three = true
          }
        },
        (error) => {
          this.showError(error.error)
          setTimeout(() => {
            localStorage.removeItem('step');
            localStorage.removeItem('repoName');
            window.location.href = '/'
          }, 2000)
        }
      )
  }

  showError (error) {
    this._service.error(error.name, error.message, {
      timeOut: 2000,
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: false
    })
  }
  showSuccess (message) {
    this._service.success('Success', message, {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true
    })
  }
}
