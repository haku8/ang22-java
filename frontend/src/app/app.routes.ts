import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page.component';
import { LoginComponent } from './components/login.component';
import { NotFoundComponent } from './components/not-found.component';
import { UserCreateComponent } from './components/user-create.component';
import { UserDetailComponent } from './components/user-detail.component';
import { UserEditComponent } from './components/user-edit.component';
import { UserListComponent } from './components/user-list.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePageComponent
  },
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'users/create',
    component: UserCreateComponent
  },
  {
    path: 'users/:id',
    component: UserDetailComponent
  },
  {
    path: 'users/:id/edit',
    component: UserEditComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
