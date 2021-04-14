import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CategoryItemsModel } from 'src/app/models/category-items.model';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { CategoryGroups, Item } from 'src/app/models/category-groups';


@Component({
  templateUrl: './category-items.component.html',
  styleUrls: ['./category-items.component.css']
})


export class CategoryItemsComponent implements OnInit {

  categoryGroups: CategoryGroups[];

  todo = [
    [
      'Get up',
      'Brush teeth',
      'Take a shower',
      'Check e-mail',
      'Walk dog'
    ],
    [
      'do a',
      'do b',
      'do c'
    ],
    'Fall asleep'
  ];

  isArray(item:any):boolean{
    return Array.isArray(item);
  }

  constructor(private data: DataService, private route: ActivatedRoute, private tokenService: TokenService) { }

  categoryId;
  ngOnInit(): void {
    // console.log(this.testArray);
    this.categoryId = this.route.snapshot.params['id'];
    if (this.tokenService.isAccessTokenValid) {
      this.data.getCategoryItems(this.categoryId).subscribe({
        next: (data: CategoryGroups[]) => {
          data.sort(((a, b): any => parseInt(a.order) - parseInt(b.order)));
          // console.log(data);
          this.categoryGroups = data;
          console.log('category groups:');
          console.log(this.categoryGroups);

        },
        error: () => console.log("error fetching category items")
      });
    }
  }

  onClick(event, item) {
    // console.log('clicked ' + item);
  }

  deleteItem(groupIndex, itemIndex, itemId) {
    if (this.tokenService.isAccessTokenValid) {
      this.data.deleteCategoryItem(itemId).subscribe({
        next: data => {
          this.categoryGroups[groupIndex]['items'].splice(itemIndex, 1)
        },
        error: err => console.log(err)
      });
    }
  }

  deleteGroup(groupId, groupIndex) {
    let categoryGroup = this.categoryGroups[groupIndex];
    if (this.tokenService.isAccessTokenValid) {

      if (confirm("Are you sure you want to delete this group and all contents?")) {
        this.data.deleteCategoryGroup(categoryGroup).subscribe({
          next: resp => this.categoryGroups.splice(groupIndex, 1),
          error: err => console.log(err)
        })
      }
    }
  }


  addNewGroup(input) {
    if (!input.value) {
      return;
    }

    if (this.tokenService.isAccessTokenValid) {

      let categoryGroup = new CategoryGroups;
      categoryGroup.name = input.value;
      categoryGroup.categoryId = this.route.snapshot.params['id'];
      categoryGroup.order = (this.categoryGroups.length + 1).toString();
      let categoryItemsModel = new Array<Item>();
      categoryGroup.items = categoryItemsModel;

      this.data.postCategoryGroup(categoryGroup).subscribe({
        next: (data: any) => {
          console.log(data);
          categoryGroup.id = data.id;
          this.categoryGroups.push(categoryGroup)
        }
        ,
        error: err => console.log(err)
      });
      input.value = '';
    }
  }

  addNew(inputBox, groupId, categoryIndex) {
    if (!inputBox.value) {
      return null;
    }

    if (this.tokenService.isAccessTokenValid) {
      let categoryItem = new CategoryItemsModel;
      categoryItem.name = inputBox.value;
      categoryItem.groupId = groupId.toString();
      // categoryItem.order = list['values'].length + 1;
      if (!this.categoryGroups[categoryIndex]['items']) {
        categoryItem.order = '1';
      }
      else {
        categoryItem.order = (this.categoryGroups[categoryIndex]['items'].length + 1).toString();
      }
      categoryItem.comment = "comment not implenmented";
      categoryItem.categoryModelId = this.categoryId;
      inputBox.value = '';


      //MAke post request and update UI after successful post
      console.log('categoryItem to post:');
      console.log(categoryItem);
      this.data.postCategoryItems(categoryItem).subscribe(

        (data: any) => {

          this.categoryGroups[categoryIndex]['items'].push(data);

        },
        // (data: any) => console.log(data),
        (error: any) => console.log(error)
      );
      console.log(this.categoryGroups[categoryIndex]['items']);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  dropList(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }


  
  groups = [{
    id: 1,
    title: 'Group 1',
    items: [{
      name: 'Item 1 - Group 1'
    },
    {
      name: 'Item 2 - Group 1'
    },
    {
      name: 'Item 3 - Group 1'
    },
    {
      name: 'Item 4 - Group 1'
    }]
  },
  {
    id: 2,
    title: 'Group 2',
    items: [{
      name: 'Item 1 - Group 2'
    },
    {
      name: 'Item 2 - Group 2'
    },
    {
      name: 'Item 3 - Group 2'
    },
    {
      name: 'Item 4 - Group 2'
    }]
  },
  {
    id: 3,
    title: 'Group 3',
    items: [{
      name: 'Item 1 - Group 3'
    },
    {
      name: 'Item 2 - Group 3'
    },
    {
      name: 'Item 3 - Group 3'
    },
    {
      name: 'Item 4 - Group 3'
    }]
  }];

  // getConnectedList(): any[] {
  //   return this.categoryGroups.map(x => `${x.id}`);
  // }

  // dropGroup(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.groups, event.previousIndex, event.currentIndex);
  // }

  
  dropItem(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  
  //Each array list is assigned an id of that group's id via the HTML
  //[cdkDropListConnectedTo] allows you to specify which other lists belong to the same list group
  //setting that attribute to return the list of IDs in the overall group allows movement of items between groups
  getConnectedList(): any[] {
    let val = this.categoryGroups.map(x => x.id);
    return val;
  }

  //this is taken from the dropItem() function above and allows the movement of groups
  dropGroup(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.categoryGroups, event.previousIndex, event.currentIndex);
  }
}

