import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private http: HttpClient,
    private envService: EnvironmentService
  ) {}
  URL = 'localhost:3000/';
  getPosts() {
    this.http.post(`http://localhost:3000/api/login`, {});

    return this.http.get(this.URL + 'api/posts', {
      // headers: new HttpHeaders().set('Authorization', token)
    });
  }

  createPost(params) {
    console.log('aqui');
    return this.http.post(this.URL + 'api/post', params, {
      // headers: new HttpHeaders().set('Authorization', token)
    });
  }
}
