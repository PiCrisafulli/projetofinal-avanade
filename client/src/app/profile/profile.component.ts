import { Component, OnInit, Input } from '@angular/core';
import { HeaderService } from './../header/header.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProfileStyles = {} = JSON.parse(localStorage.getItem('userProfileStyles'));
  profileBackgroundImage: string;
  @Input() loading = true;

  constructor(private headerService: HeaderService) { }

  profileBannerBackground() {

  }

  ngOnInit() {
    if (!this.userProfileStyles) {
      this.userProfileStyles = {
        banner: 1,
        headerColor: '#7d8cc4',
      };

      localStorage.setItem('userProfileStyles', JSON.stringify(this.userProfileStyles));
    }

    this.profileBackgroundImage = './../assets/Images/profile-banners/' + this.userProfileStyles.banner + '.png';

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
