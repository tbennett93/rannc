import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { CategoryComponent } from './category.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';



@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatGridListModule,
    RouterModule.forRoot([
      {path: 'my-categories', component: CategoryComponent, canActivate: [AuthGuard], data : {title:'My Categories'}}
    ]),
  ],
  exports:[
    CategoryComponent
  ]
})
export class CategoryModule { }
