import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebateComponent } from './debate.component';

const routes: Routes = [ { path: '', component: DebateComponent } ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebateRoutingModule { }
