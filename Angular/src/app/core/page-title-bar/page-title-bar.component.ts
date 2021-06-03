import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-title-bar',
  templateUrl: './page-title-bar.component.html',
  styleUrls: ['./page-title-bar.component.scss']
})
export class PageTitleBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() title: string;

}
