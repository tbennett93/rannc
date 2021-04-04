import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';


describe('TokenService', () => {

  var service;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return ''}
        }
      })
    ], 
    providers: [TokenService, JwtHelperService]
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
