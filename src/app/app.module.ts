import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRouting } from './app.routing';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Neutrino } from '../providers/neutrino';
import { EmojifyModule } from 'angular-emojify';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { TestPageComponent } from './test-page/test-page.component';

@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		SidebarComponent,
		StatusBarComponent,
		SettingsPageComponent,
		MainPageComponent,
		TestPageComponent,
	],
	imports: [
		AppRouting,
		EmojifyModule,
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		EmojifyModule
	],
	providers: [
		Neutrino,
		{
			provide: LocationStrategy,
			useClass: HashLocationStrategy,
			useValue: '#/'
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
