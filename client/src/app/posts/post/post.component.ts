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
  collapseComments: boolean = false;
  comments = [0, 1, 2, 3, 4];
  ngOnInit() {
    $(document).ready(function() {
      $('.collapsible').collapsible();
    });
  }

  open() {
    this.collapseComments = !this.collapseComments;
    if (this.collapseComments) {
      $('.collapsible').collapsible('open', 0);
    } else {
      $('.collapsible').collapsible('close', 0);
    }
  }
}
