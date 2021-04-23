import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

/**
 * @title Basic snack-bar
 */
@Component({
  selector: 'error-popup',
  templateUrl: 'error-popup.component.html',
  styleUrls: ['error-popup.component.css'],
})
export class ErrorPopupComponent {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}