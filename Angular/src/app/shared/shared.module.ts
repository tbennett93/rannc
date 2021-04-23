import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    ErrorPopupComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  exports:[
    ErrorPopupComponent,
    CommonModule,
    MatButtonModule
  ]
})
export class SharedModule { }
