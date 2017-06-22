import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { TestPageComponent } from './test-page/test-page.component';

export const AppRouting = RouterModule.forRoot([
	{
		path: "app", component: MainComponent, children: [
			{ path: "", pathMatch: "full", redirectTo: "main" },
			{ path: "main", component: MainPageComponent },
			{ path: "settings", component: SettingsPageComponent },
			{ path: "test", component: TestPageComponent },
		]
	},
	{ path: '', pathMatch: "full", redirectTo: 'app' }
]);
