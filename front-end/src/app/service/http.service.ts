import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = 'https://omnigit.herokuapp.com/'

  constructor(private http: HttpClient) { }

  post (url, data) {
    return this.http.post(this.apiUrl + url, data)
  }
}
