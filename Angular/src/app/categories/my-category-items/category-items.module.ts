import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CategoryComponent } from 'src/app/categories/my-categories/category.component';
import { CategoryItemsComponent } from 'src/app/categories/my-category-items/category-items.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';



@NgModule({
  declarations: [
    CategoryComponent,
    CategoryItemsComponent
  ],
  imports: [
    DragDropModule,
    CommonModule,
    RouterModule.forRoot([
      {path: 'my-rankings', component: CategoryComponent, canActivate: [AuthGuard]},
      {path: 'my-ranking/:id', component: CategoryItemsComponent, canActivate: [AuthGuard]},
    ]),
  ]
})
export class CategoryItemsModule { }
