import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRankingIdComponent } from './my-ranking-id.component';

describe('MyRankingIdComponent', () => {
  let component: MyRankingIdComponent;
  let fixture: ComponentFixture<MyRankingIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRankingIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRankingIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
