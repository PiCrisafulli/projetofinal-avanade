import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    $(document).ready(function() {
      $('.collapsible').collapsible();
    });
  }
}
