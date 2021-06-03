import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleBarComponent } from './page-title-bar.component';



@NgModule({
  declarations: [
    PageTitleBarComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    PageTitleBarComponent
  ]
})
export class PageTitleBarModule {

  @Input() title: string;

 }
