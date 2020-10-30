import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShapeBuilderComponent } from './shape-builder/shape-builder.component';


const routes: Routes = [
  {
    path:'', component: ShapeBuilderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
