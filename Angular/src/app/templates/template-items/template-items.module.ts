import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateItemsComponent } from './template-items.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { PageTitleBarModule } from 'src/app/core/page-title-bar/page-title-bar.module';
import { DragDropCardListModule } from 'src/app/feature-components/drag-drop-card-list/drag-drop-card-list.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [TemplateItemsComponent],
  imports: [
    CommonModule,
    SharedModule,
    DragDropCardListModule,
    PageTitleBarModule,
    RouterModule.forRoot([
      {path: 'template/:id', component: TemplateItemsComponent, canActivate: [AuthGuard], data : {title:'Template'}},
    ], {scrollPositionRestoration: 'enabled'}),
  ]
})
export class TemplateItemsModule { }
