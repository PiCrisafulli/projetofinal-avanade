import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) {}
  URL = 'http://localhost:3000/';
  token = '';
  getPosts() {
    return this.http.get(this.URL + 'posts', {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }

  createPost(params) {
    return this.http.post(this.URL + 'post', params, {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }

  updatePost(params, id) {
    return this.http.patch(this.URL + 'post/' + id, params, {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }

  deletePost(id) {
    return this.http.delete(this.URL + 'post/' + id, {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }
}
