import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryItemsComponent } from 'src/app/categories/my-category-items/category-items.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropCardListModule } from 'src/app/feature-components/drag-drop-card-list/drag-drop-card-list.module';



@NgModule({
  declarations: [
    CategoryItemsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: 'my-ranking/:id', component: CategoryItemsComponent, canActivate: [AuthGuard]},
    ]),
    DragDropCardListModule
  ]
})
export class CategoryItemsModule { }
