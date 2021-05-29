import { BrowserModule } from '@angular/platform-browser';
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
import { SharedModule } from './shared/shared.module';
import { AppNavbarModule } from './core/app-navbar/app-navbar.module';
import { AppNavbarComponent } from './core/app-navbar/app-navbar.component';



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
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CategoryItemsModule,
    AppNavbarModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent},
      //route blocked by AuthGuard which only lets a page be accessible if a token exists and hasnt expired
      {path: 'top-categories', component: TopCategoriesComponent},
      {path: 'social', component: SocialComponent},
      {path: 'login', component: LoginComponent},
      {path: 'sign-up', component: SignUpComponent},
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
