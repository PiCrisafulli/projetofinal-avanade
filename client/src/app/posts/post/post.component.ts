import { Component, OnInit, Input } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  constructor() { }
  collapseComments = false;
  comments = [0, 1, 2, 3, 4];
  @Input() video;
  @Input() text;
  @Input() image;
  @Input() index;
  ngOnInit() {
    /*
    $(document).ready(function () {
      $('.collapsible').collapsible();
    });
    */
    $(`[class^=collapsible]`).collapsible();

  }

  open() {
    this.collapseComments = !this.collapseComments;
    console.log($(`.collapsible${this.index}`), 'auiq');
    if (this.collapseComments) {
      $(`.collapsible${this.index}`).collapsible('open', 0);
    } else {
      $(`.collapsible${this.index}`).collapsible('close', 0);
    }
  }
}
