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
  ) { }

  getPosts(params) {
    return this.http.get(this.envService.env['host'] + 'album/pesquisarAlbum', {
      params: params
      // headers: new HttpHeaders().set('Authorization', token)
    });
  }

  createPost(params) {
    return this.http.post(
      this.envService.env['host'] + 'album/createAlbum',
      params,
      {
        // headers: new HttpHeaders().set('Authorization', token)
      }
    );
  }
}
