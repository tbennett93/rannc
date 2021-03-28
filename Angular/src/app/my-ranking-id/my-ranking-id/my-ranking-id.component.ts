import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CategoryItemsModel } from 'src/app/models/category-items.model';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';



@Component({
  selector: 'app-my-ranking-id',
  templateUrl: './my-ranking-id.component.html',
  styleUrls: ['./my-ranking-id.component.css']
})
export class MyRankingIdComponent implements OnInit {


  categoryItems: CategoryItemsModel[];
  constructor(private data: DataService, private route: ActivatedRoute, private tokenService: TokenService) { }

  ngOnInit(): void {
    const categoryId = this.route.snapshot.params['id'];
    if (this.tokenService.isAccessTokenValid){
      this.data.getCategoryItems(categoryId).subscribe({
        next: (data: CategoryItemsModel[]) => {
          this.categoryItems = data
        },
        error: () => console.log("error fetching category items")
      });
    }
  }

}
