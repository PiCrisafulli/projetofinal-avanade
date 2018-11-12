import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  constructor(private http: HttpClient) {}
  URL = 'http://localhost:3000/';
  token = '';

  getPlaces() {
    return this.http.get(this.URL + 'places', {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }

  createPlace(params) {
    return this.http.post(this.URL + 'places', params, {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }

  updatePlace(params, id) {
    return this.http.patch(this.URL + 'places/' + id, params, {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }

  deletePlace(id) {
    return this.http.delete(this.URL + 'places/' + id, {
      headers: new HttpHeaders().set('Authorization', this.token)
    });
  }
}
