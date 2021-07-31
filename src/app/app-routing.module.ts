import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { AuthenticationModuleGuard } from './authentication-module-guard';

const routes: Routes = [
  {
    path: 'authentication', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),
    canLoad: [AuthenticationModuleGuard]
  },
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canLoad: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthenticationModuleGuard]
})
export class AppRoutingModule { }
