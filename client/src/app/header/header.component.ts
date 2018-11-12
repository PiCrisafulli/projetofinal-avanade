import { Component, OnInit, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  userProfileStyles = {
    headerColor: 'transparent'
  };

  headerBackgroundColor = 'transparent';
  @Input() transparentHeader: boolean;

  constructor() { }

  // Scroll para o header quando existir um banner e ele precisar ser transparent no topo
  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    this.getScrollToHeader();
  }

  getScrollToHeader() {
    if (window.pageYOffset < 400) {
      this.headerBackgroundColor = 'transparent';
      if (!this.transparentHeader) {
        this.headerBackgroundColor = this.userProfileStyles.headerColor;
      }
    } else {
      this.userProfileStyles = JSON.parse(localStorage.getItem('userProfileStyles'));
      if (this.userProfileStyles.headerColor === 'transparent') {
        this.userProfileStyles.headerColor = '#7D8CC4';
      }
      this.headerBackgroundColor = this.userProfileStyles.headerColor;

      localStorage.setItem('userProfileStyles', JSON.stringify(this.userProfileStyles));
    }
  }

  ngOnInit() {
    this.userProfileStyles = JSON.parse(localStorage.getItem('userProfileStyles'));

    this.headerBackgroundColor = this.userProfileStyles.headerColor;
    localStorage.setItem('userProfileStyles', JSON.stringify(this.userProfileStyles));

    this.getScrollToHeader();
  }

}
