import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BuilderPage } from './components/builder-page.component';
import { LibraryComponent } from './components/library/library.component';
import { AddBookComponent } from './components/library/addBook/addBook.component';
import { LoginComponent } from './components/Users/login-page/login.component';

export const routes: Routes = [
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'builder-page', component: BuilderPage },
  { path: 'library', component: LibraryComponent },
  { path: 'add-book', component: AddBookComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/login' } // Wildcard route for a 404 page
];