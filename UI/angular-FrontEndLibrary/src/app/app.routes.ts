import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BuilderPage } from './components/builder-page.component';
import { LibraryComponent } from './components/user-library/library-page/library.page.component';
import { AddBookComponent } from './components/user-library/addBook/addBook.component';
import { LoginComponent } from './components/Users/login-page/login.component';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { UserPageComponent } from './components/Users/user-page/user-page.component';
export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'builder-page', component: BuilderPage },
  { path: 'library', component: LibraryComponent },
  { path: 'add-book', component: AddBookComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user-page', component: UserPageComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/login' } // Wildcard route for a 404 page
];