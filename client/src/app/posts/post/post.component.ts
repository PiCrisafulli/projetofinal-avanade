import { Component, OnInit, Input } from '@angular/core';
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
  @Input() video;
  @Input() text;
  @Input() image;
  @Input() index;
  ngOnInit() {
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
