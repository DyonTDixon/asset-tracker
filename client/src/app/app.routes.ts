import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AssetsComponent } from './pages/assets/assets';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'assets', component: AssetsComponent }
];
