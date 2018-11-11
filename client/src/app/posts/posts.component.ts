import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  constructor(private postService: PostService) {}

  friends = [0, 1, 2, 3];
  places = [0, 1];
  posts = [0, 1, 2];
  newPost: Post = {
    text: null,
    image: null,
    video: null
  };

  ngOnInit() {
    console.log(this.newPost);
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

  public scrollTop() {
    console.log('teste');
    $(document).scrollTop(0);
  }

  public sendPost() {
    this.postService.createPost(this.newPost).subscribe(
      success => {
        console.log(success);
      },
      err => {
        console.log(err, 'err');
      }
    );
  }
}
