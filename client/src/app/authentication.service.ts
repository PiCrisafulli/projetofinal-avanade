import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
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
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private token: string;

    constructor(private http: HttpClient, private router: Router) { }

    public login(user: TokenPayloadLogin): Observable<any> {
        return this.request('post', 'login', user);
    }
    public register(user: TokenPayloadRegister) {
        return this.request('post', 'register', user);
    }
    public profile() {

    }
    public editProfile() {

    }
    public logout(): void {
        this.token = '';
        window.localStorage.removeItem('user-token');
        this.router.navigateByUrl('/');
    }
    private getToken() {
        if (!this.token) {
            this.token = localStorage.getItem('user-token');
        }
        return this.token;
    }
    private saveToken(token: string): void {
        localStorage.setItem('user-token', token);
        this.token = token;
    }


    private request(method: 'post' | 'get', type: 'login' | 'register', user?: TokenPayloadLogin | TokenPayloadProfile | TokenPayloadRegister): Observable<any> {
        let base;
        switch (method) {
            case 'post':
                base = this.http.post(`http://localhost:3000/api/${type}`, user);
                break;
            case 'get':
                base = this.http.get(`http://localhost:3000/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` } })
                break;
        }

        return base;
    }

}