import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CategoryItemsModel } from 'src/app/models/category-items.model';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  templateUrl: './category-items.component.html',
  styleUrls: ['./category-items.component.css']
})
export class CategoryItemsComponent implements OnInit {

  arr = [
    {type:"orange", title:"First"},
    {type:"orange", title:"Second"},
    {type:"banana", title:"Third"},
    {type:"banana", title:"Fourth"}
  ];

  categoryItems: CategoryItemsModel[];
  categoryItemsGroups: any;
  categoryItemsGroupTypes: string[];
  testArray = [
    {type:"test genre 1", values:[{name:"superbad"}, {name:"40YOV"}]},
    {type:"test genre 2", values:[{name:"heredetary"}, {name:"babadook"}]}
    ];


  constructor(private data: DataService, private route: ActivatedRoute, private tokenService: TokenService) { }

  ngOnInit(): void {
    console.log(this.testArray);
    const categoryId = this.route.snapshot.params['id'];
    if (this.tokenService.isAccessTokenValid){
      this.data.getCategoryItems(categoryId).subscribe({
        next: (data: CategoryItemsModel[]) => {
          this.categoryItems = data
          data.sort((a,b) => a.group > b.group ? 1 : a.group < b.group ? -1 : 0 ||  a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
          // this.categoryItemsGroups = this.groupBy(data, 'group'); 
          this.categoryItemsGroups = this.groupByArray(data, 'group'); 
          // console.log(this.groupBy(data, 'group'));
          // console.log(this.categoryItemsGroups);
          // this.categoryItemsGroups.forEach(element => {
          //   this.categoryItemsGroupTypes.push(element.group)
          // });
          console.log(this.categoryItemsGroups);
        },
        error: () => console.log("error fetching category items")
      });
    }


    // o.orange; // => [{"type":"orange","title":"First"},{"type":"orange","title":"Second"}]
    // o.banana; // => [{"type":"banana","title":"Third"},{"type":"banana","title":"Fourth"}]
    // console.log(this.arr)
    // console.log(o)
    // console.log(o.orange)

    // let o = this.groupBy(this.categoryItems, 'group'); // => {orange:[...], banana:[...]}
    // o.orange; // => [{"type":"orange","title":"First"},{"type":"orange","title":"Second"}]
    // o.banana; // => [{"type":"banana","title":"Third"},{"type":"banana","title":"Fourth"}]
    // console.log(this.arr)
    // console.log(o)
    // console.log(o.orange)
    // console.log(o.orange)    
  }

  //groups an array by 'property' and creates a new object for each group
  //reduce takes a callback with two properties
    //memo=accumulator (the accumulates callback return values)
    //x = current value of the array
  //this checks whether an array of type property has been created
    //if not, it creates one
    //if so, it pushes the current value to it

  groupByArray(xs, key) {
    return xs.reduce(function (rv, x) {
      let v = key instanceof Function ? key(x) : x[key];
      let el = rv.find((r) => r && r.key === v);
      if (el) { el.values.push(x); }
      else { rv.push({ key: v, values: [x] }); } return rv;
    }, []);
  }
  groupBy(arr, property) {
    return arr.reduce(function(memo, x) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});
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
