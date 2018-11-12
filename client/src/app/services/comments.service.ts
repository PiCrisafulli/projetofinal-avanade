import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  constructor(private http: HttpClient) {}
  URL = 'http://localhost:3000/';
  token = '';

  getComments() {
    return this.http.get(this.URL + 'comments', {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }

  createComment(params) {
    return this.http.post(this.URL + 'comments', params, {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }

  updateComment(params, id) {
    return this.http.patch(this.URL + 'comments/' + id, params, {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }

  deleteComment(id) {
    return this.http.delete(this.URL + 'comments/' + id, {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }
}
