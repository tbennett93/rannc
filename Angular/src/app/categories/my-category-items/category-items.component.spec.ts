import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { of } from 'rxjs';

import { CategoryItemsComponent } from './category-items.component';


describe('CategoryItemsComponent', () => {
  let component: CategoryItemsComponent;
  let fixture: ComponentFixture<CategoryItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        JwtModule.forRoot({
          config: {
            tokenGetter: () => {
              return ''}
          }
        })
      ], 
      providers: [ 
        JwtHelperService,
        {
          provide: ActivatedRoute, useValue: {
            params: of({ id: 3 }),
            snapshot: {
                params: {
                  id: 3
                }
        }
      }
    }
      ],
      declarations: [ CategoryItemsComponent ],
      
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

