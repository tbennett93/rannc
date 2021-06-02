import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropCardListComponent } from './drag-drop-card-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    DragDropCardListComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    SharedModule
  ],
  exports:[
    DragDropCardListComponent
  ]
})
export class DragDropCardListModule { }
