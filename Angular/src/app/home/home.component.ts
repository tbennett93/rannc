import { Component, OnInit} from '@angular/core';
import { DataService } from '../services/data.service';
import { CategoryModel } from '../models/category.model';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  title = 'Rannc';
  category: CategoryModel[];

  constructor(private data : DataService, private tokenService : TokenService) { };

  ngOnInit(): void {
    if (this.tokenService.isAccessTokenValid()){
      this.data.getCategories().subscribe({
        next: (data: CategoryModel[]) => {
          this.category = data;
        },
        error: () => console.log("error in getCategoriesObserver")
      });
    }
  };

}


