import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TopCategoriesComponent } from './top-categories/top-categories.component';
import { SocialComponent } from './social/social.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JwtModule } from '@auth0/angular-jwt';
import { CategoryItemsModule } from 'src/app/categories/my-category-items/category-items.module';
import { SignUpComponent } from './sign-up/sign-up.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { CoreModule } from './core/core.module'
import { CategoryItemsComponent } from './categories/my-category-items/category-items.component';
import { AuthGuard } from 'src/app/auth.guard';
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { CategoryModule } from './categories/my-categories/category.module';



export function tokenGetter() {
  return localStorage.getItem("jwt"); 
};

@NgModule({
  declarations: [
    AppComponent,
    TopCategoriesComponent,
    SocialComponent,
    PageNotFoundComponent,
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
      {path: 'my-category/:id', component: CategoryItemsComponent, canActivate: [AuthGuard], data : {title:'My Categories'}},
      {path: 'top-categories', component: TopCategoriesComponent, data : {title:'Top Categories'}},
      {path: 'social', component: SocialComponent, data : {title:'Social'}},
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
    FlexLayoutModule,
    LoginModule,
    HomeModule,
    CategoryModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
