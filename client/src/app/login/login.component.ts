import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService, TokenPayloadLogin, TokenPayloadRegister } from '../authentication.service';
import { Router } from '@angular/router';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /* credentialsLogin: TokenPayloadLogin = {
    email: '',
    password: '',
  };

  credentialsRegister: TokenPayloadRegister = {
    name: '',
    email: '',
    password: '',
  } */

  defaultAlert = 'Houve um erro,nos contate. Acesse Sobre nós e mande-nos um e-mail para melhor ajudarmos';

  // constructor(private auth: AuthenticationService, private router: Router) { }
  constructor() { }

  ngOnInit() {
    $(document).ready(function () {
      $('.collapsible').collapsible();
    });

    $(document).ready(function () {
      $('.tooltipped').tooltip();
    });
  }

  facebookLogin() {

  }
  googleLogin() {

  }
  emailLogin() {
    /* this.auth.login(this.credentialsLogin).subscribe(() => {
      this.router.navigateByUrl('/home');
    }, err => {
      switch (err.code) {
        default:
          alert(this.defaultAlert);
          break;
      }
    }); */
  }
  register() {
   /*  this.auth.register(this.credentialsRegister).subscribe(() => {
      this.router.navigateByUrl('/register');
    }, err => {
      switch (err.code) {
        default:
          alert(this.defaultAlert);
          break;
      }
    }); */
  }

}
