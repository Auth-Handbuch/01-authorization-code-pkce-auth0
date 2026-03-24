import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { About } from './about/about';
import { Profile } from './profile/profile';
import { User } from './user/user';
import { CreateUser } from './create-user/create-user';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/about',
    pathMatch: 'full',
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [AuthGuard],
  },
  {
    path: 'user',
    component: User,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-user',
    component: CreateUser,
    canActivate: [AuthGuard],
  },
];
