import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CategoryItemsModel } from 'src/app/models/category-items.model';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';



@Component({
  selector: 'category-items',
  templateUrl: './category-items.component.html',
  styleUrls: ['./category-items.component.css']
})
export class CategoryItemsComponent implements OnInit {


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

  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }

}
