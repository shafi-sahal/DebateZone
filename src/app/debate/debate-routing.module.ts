import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebateCreateComponent } from './debate-create/debate-create.component';
import { DebateListComponent } from './debate-list/debate-list.component';

const routes: Routes = [
  { path: 'create-debate', component: DebateCreateComponent }, { path: '', component: DebateListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebateRoutingModule { }
