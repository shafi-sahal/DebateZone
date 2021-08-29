import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebateListComponent } from './debate-list/debate-list.component';

const routes: Routes = [ { path: '', component: DebateListComponent } ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebateRoutingModule { }
