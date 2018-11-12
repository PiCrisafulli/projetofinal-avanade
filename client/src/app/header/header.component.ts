import { Component, OnInit, HostListener, Input } from '@angular/core';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  userProfileStyles = {} = JSON.parse(localStorage.getItem('userProfileStyles'));
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
      this.headerBackgroundColor = this.userProfileStyles.headerColor;
    }
  }

  ngOnInit() {
    if (!this.userProfileStyles) {
      this.userProfileStyles.headerColor = '#7d8cc4';
      this.headerBackgroundColor = this.userProfileStyles.headerColor;
      localStorage.setItem('userProfileStyles', JSON.stringify(this.userProfileStyles));
    } else {
      this.headerBackgroundColor = this.userProfileStyles.headerColor;
    }

    this.getScrollToHeader();
  }

}
