import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Rannc';
  pageTitle: string = 'test';
  
  constructor(private router: Router,  private activatedRoute: ActivatedRoute  ){


  }

  ngOnInit() {
 
    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe(() => {
 
        var rt = this.getChild(this.activatedRoute)
 
        rt.data.subscribe(data => {
          console.log(data);
          this.pageTitle = data.title})
      })
 
  }
  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
 
  }
  
}
