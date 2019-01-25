import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from './service/http.service'
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  step
  gitRepos: Object[]
  selectedRepo
  repoName: String
  date

  constructor(private route: ActivatedRoute, private httpService: HttpService) {
  }

  ngOnInit() {
    this.step = {
      one: true,
      two: false,
      three: false
    }
    this.gitRepos = [
      {
        id: 0,
        name: 'GitHub',
        url: 'https://github.com/login/oauth/authorize?client_id=c49323c1ab4dbf2ef975&redirect_uri=http://localhost:4200?repo=github&provider=target'
      },
      {
        id: 1,
        name: 'GitLab',
        url: 'https://gitlab.com/oauth/authorize?client_id=d4388c1e51bf2d39390df722ad1479e585e7e080014da165977fe379b1f32124&response_type=code&redirect_uri=http://localhost:4200?repo=gitlab'
      },
      {
        id: 2,
        name: 'Bitbucket',
        url: 'https://bitbucket.org/site/oauth2/authorize?client_id=uPYJ2b2sGp2CWQUhAf&response_type=code'
      }
    ]
    this.selectedRepo = 0
    this.route.queryParams.subscribe(params => {
      this.date = {
        repo: params.repo,
        code: params.code,
      }
      if (params.repo && params.code) {
        this.step.one = false
        this.step.two = true
      }
    });
  }

  sendData() {
    this.date.repoName = this.repoName
    this.httpService.post('get_current_repo', this.date)
      .subscribe(
        (result) => {
          console.log(result)
        },
        (error) => {
          console.log(error)
        }
      )
  }
}
