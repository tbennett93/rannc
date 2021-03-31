import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CategoryItemsComponent } from 'src/app/categories/my-category-items/category-items.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';



@NgModule({
  declarations: [
    CategoryItemsComponent
  ],
  imports: [
    DragDropModule,
    CommonModule,
    RouterModule.forChild([
      {path: 'my-ranking/:id', component: CategoryItemsComponent, canActivate: [AuthGuard]},
    ]),
  ]
})
export class CategoryItemsModule { }
