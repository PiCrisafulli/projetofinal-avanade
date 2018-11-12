import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface TokenPayloadLogin {
  email: string;
  password: string;
}

export interface TokenPayloadRegister {
  name: string;
  email: string;
  password: string;
}
export interface TokenPayloadProfile {
  name: String;
  icon: String;
  email: String;
  dateBirth: Date;
  sex: String;
  phoneNumber: String;
  typeLogin: String;
  password: String;
  biography: String;
  publishedAt: Date;
  modifiedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  public login(user: TokenPayloadLogin): Observable<any> {
    return this.request('get', 'users', user);
  }
  public register(user: TokenPayloadRegister) {
    return this.request('post', 'users', user);
  }
  public profile() {}
  public editProfile() {}
  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('user-token');
    this.router.navigateByUrl('/');
  }
  public setTokenString(token: string) {
    this.token = token;
  }
  public getTokenFromApi(): Observable<any> {
    const userAcess = {
      username: 'viajeiadm',
      password: 'stv10293845*'
    };
    return this.http.post('http://localhost:3000/login', userAcess);
  }

  private request(
    method: 'post' | 'get',
    type: 'login' | 'register' | 'users',
    user?: TokenPayloadLogin | TokenPayloadProfile | TokenPayloadRegister
  ): Observable<any> {
    let base;
    switch (method) {
      case 'post':
        base = this.http.post(`http://localhost:3000/${type}`, user, {
          headers: { Authorization: `${this.token}` }
        });
        break;
      case 'get':
        base = this.http.get(`http://localhost:3000/api/${type}`, {
          headers: { Authorization: `${this.token}` }
        });
        break;
    }
    console.log(base);
    return base;
  }
}
