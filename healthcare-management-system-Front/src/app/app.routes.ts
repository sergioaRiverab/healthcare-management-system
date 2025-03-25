import { Routes } from '@angular/router';
import { HomeComponent } from './features/dashboard/home/home.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { LoginComponent } from './features/auth/login/login.component';	

export const routes: Routes = [
    {path: '',component: HomeComponent},
    {path: 'auth/signup',component: SignupComponent},
    {path: 'auth/login', component: LoginComponent}, 
    { path: '**', redirectTo: '' },
];
