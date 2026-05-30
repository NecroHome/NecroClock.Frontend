import { Routes } from '@angular/router';

import { LoginComponent } from './components/view/login/login.component';
import { AuthGuard } from './components/interceptors/auth.guard';
import { AppMainViewComponent } from './components/view/app.main.view/app.main.view.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', canActivate: [AuthGuard], component: AppMainViewComponent },
    { path: 'login',  component: LoginComponent }
]