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

  friends = [0, 1, 2, 3];
  places = [0, 1];
  posts = [0, 1, 2];

  ngOnInit() {
    $(document).ready(function() {
      $(`[class^=collapsible]`).collapsible();
    });
  }

  public loadMoreFriends() {
    this.friends.push(1, 1, 1, 1);
  }

  public loadMorePlaces() {
    this.places.push(1, 1);
  }
}
