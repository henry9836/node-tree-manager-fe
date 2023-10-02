import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbComponent } from './db-component/db-component.component';
import { NodeViewComponent } from './node-view-component/node-view-component.component';

const routes: Routes = [
  { path: 'db-component', component: DbComponent },
  { path: 'node-viewer-component', component: NodeViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
