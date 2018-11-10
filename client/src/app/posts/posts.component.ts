import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    $(document).ready(function() {
      $('.collapsible').collapsible();
    });
  }
}
