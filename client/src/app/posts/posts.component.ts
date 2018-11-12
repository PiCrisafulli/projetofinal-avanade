import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Observable } from 'rxjs';
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
  posts = [0, 1];
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

    this.getPosts();
  }

  public getPosts() {
    this.postService.getPosts().subscribe(
      success => {},
      err => {
        alert('Ocorreu um erro ao buscar posts!');
      }
    );
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
    console.log(this.newPost);

    this.postService.createPost(this.newPost).subscribe(
      success => {
        console.log(success, 'success');
      },
      err => {
        console.log(err, 'err');
        alert('Ocorreu um erro ao criar post!');
      }
    );
  }
}
