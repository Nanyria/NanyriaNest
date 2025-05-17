import { Routes } from '@angular/router';
import { BuilderPage } from './components/builder-page.component';
import { LibraryComponent } from './components/user-library/library-page/library.page.component';
import { AddBookComponent } from './components/user-library/addBook/addBook.component';
import { LoginComponent } from './components/Users/login-page/login.component';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { UserPageComponent } from './components/Users/user-page/user-page.component';
import { UserSettingsComponent } from './components/Users/user-settings/user-settings-component';
import { UserReservationsComponent } from './components/Users/user-reservations/user-reservations-component'; 
// import { UserMessagesComponent } from './components/Users/user-messages/user-messages.component';
import { UserReadlistComponent } from './components/Users/user-readlist/user-readlist-component';
import { UserCheckoutsComponent } from './components/Users/user-checkouts/user-checkouts-component';
import { AdminPageComponent } from './components/admin/admin-page/admin-page.component';
import { ManageBooksComponent } from './components/admin/manage-books/manage-books.component';
import { ManageUsersComponent } from './components/admin/manage-users/manage-users.component';
import { AuthGuard } from './Services/auth.guard';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      { path: 'home', component: HomePageComponent },
      { path: 'builder-page', component: BuilderPage },
      { path: 'library', component: LibraryComponent },
      { path: 'add-book', component: AddBookComponent },
      { path: 'user-page', component: UserPageComponent },
      { path: 'user/settings', component: UserSettingsComponent },
      // { path: 'messages', component: UserMessagesComponent },
      { path: 'user/readlist', component: UserReadlistComponent },
      { path: 'user/reservations', component: UserReservationsComponent },
      { path: 'user/checkouts', component: UserCheckoutsComponent },
      { path: 'admin', component: AdminPageComponent },
      { path: 'admin/manage-books', component: ManageBooksComponent },
      { path: 'admin/manage-users', component: ManageUsersComponent },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: '**', redirectTo: '/login' }
    ]
  }
];