import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'explore', loadChildren: () => import('../explore/explore.module').then(m => m.ExploreModule) },
      { path: 'account', loadChildren: () => import('../account/account.module').then(m => m.AccountModule) },
      { path: '', loadChildren: () => import('../debate/debate.module').then(m => m.DebateModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
