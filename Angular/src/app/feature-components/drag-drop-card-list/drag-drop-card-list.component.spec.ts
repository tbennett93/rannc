import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropCardListComponent } from './drag-drop-card-list.component';

describe('DragDropCardListComponent', () => {
  let component: DragDropCardListComponent;
  let fixture: ComponentFixture<DragDropCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragDropCardListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragDropCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
