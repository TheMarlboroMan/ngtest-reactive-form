import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import {UserDetailComponent} from './user-detail.component';
import {UserListComponent} from './user-list.component';

import {DataService} from './data.service';

@NgModule({
declarations: [
	AppComponent,
	UserDetailComponent,
	UserListComponent
],
imports: [
	BrowserModule,
	ReactiveFormsModule
],
providers: [DataService],
bootstrap: [AppComponent]
})

export class AppModule { }
