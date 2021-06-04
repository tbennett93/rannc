import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from 'src/app/categories/my-categories/category.component';

import { TopCategoriesComponent } from './top-categories/top-categories.component';
import { SocialComponent } from './social/social.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JwtModule } from '@auth0/angular-jwt';
import { CategoryItemsModule } from 'src/app/categories/my-category-items/category-items.module';
import { SignUpComponent } from './sign-up/sign-up.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { CoreModule } from './core/core.module'
import { CategoryItemsComponent } from './categories/my-category-items/category-items.component';
import { AuthGuard } from 'src/app/auth.guard';



export function tokenGetter() {
  return localStorage.getItem("jwt"); 
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopCategoriesComponent,
    SocialComponent,
    LoginComponent,
    PageNotFoundComponent,
    CategoryComponent,
    SignUpComponent

  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CategoryItemsModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent, data : {title:'Home'}},
      {path: 'my-categories', component: CategoryComponent, canActivate: [AuthGuard], data : {title:'My Categories'}},
      {path: 'my-category/:id', component: CategoryItemsComponent, canActivate: [AuthGuard], data : {title:'My Categories'}},
      {path: 'top-categories', component: TopCategoriesComponent, data : {title:'Top Categories'}},
      {path: 'social', component: SocialComponent, data : {title:'Social'}},
      {path: 'login', component: LoginComponent, data : {title:'Login'}},
      {path: 'sign-up', component: SignUpComponent, data : {title:'Sign Up'}},
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: '**', component: PageNotFoundComponent}
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:44359"],
        blacklistedRoutes: []
      }
    }),
    FormsModule,
    FlexLayoutModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
