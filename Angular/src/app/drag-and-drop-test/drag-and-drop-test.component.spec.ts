import { DragDropModule } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DragAndDropTestComponent } from './drag-and-drop-test.component';

describe('DragAndDropTestComponent', () => {
  let component: DragAndDropTestComponent;
  let fixture: ComponentFixture<DragAndDropTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragAndDropTestComponent ],
      imports: [
        NoopAnimationsModule,
        DragDropModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragAndDropTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
