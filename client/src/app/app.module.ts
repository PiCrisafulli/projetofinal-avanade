import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NavComponent } from './nav/nav.component';
import { ProfileComponent } from './profile/profile.component';
import { PostsComponent } from './posts/posts.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';
import { Routes, RouterModule } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { AboutComponent } from './about/about.component';
import { PostComponent } from './posts/post/post.component';
import { CommentComponent } from './comment/comment.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'post', component: PostsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavComponent,
    ProfileComponent,
    PostsComponent,
    HomeComponent,
    FooterComponent,
    SearchComponent,
    ConfigComponent,
    HeaderComponent,
    MapComponent,
    AboutComponent,
    PostComponent,
    CommentComponent
  ],
  imports: [BrowserModule, AppRoutingModule, RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
