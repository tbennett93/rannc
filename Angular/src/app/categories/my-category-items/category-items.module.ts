import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryItemsComponent } from 'src/app/categories/my-category-items/category-items.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropCardListModule } from 'src/app/feature-components/drag-drop-card-list/drag-drop-card-list.module';
import { PageTitleBarModule } from 'src/app/core/page-title-bar/page-title-bar.module';



@NgModule({
  declarations: [
    CategoryItemsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DragDropCardListModule,
    PageTitleBarModule
  ]
})
export class CategoryItemsModule { }
