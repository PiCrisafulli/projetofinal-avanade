import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  constructor(private http: HttpClient) {}
  URL = 'http://localhost:3000/';
  token = '';

  getFriends() {
    return this.http.get(this.URL + 'friends', {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }

  createFriend(params) {
    return this.http.post(this.URL + 'friends', params, {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }

  updateFriend(params, id) {
    return this.http.patch(this.URL + 'friends/' + id, params, {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }

  deleteFriend(id) {
    return this.http.delete(this.URL + 'friends/' + id, {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }
}
