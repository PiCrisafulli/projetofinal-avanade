import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(document).ready(function () {
      $('.collapsible').collapsible();
    });
  }

  facebookLogin() {

  }
  googleLogin() {

  }
  emailLogin() {

  }

}
