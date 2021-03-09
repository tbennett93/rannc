import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRankingsComponent } from './my-rankings.component';

describe('MyRankingsComponent', () => {
  let component: MyRankingsComponent;
  let fixture: ComponentFixture<MyRankingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRankingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
