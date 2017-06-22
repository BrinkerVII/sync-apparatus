import { Component } from '@angular/core';
import { Neutrino } from '../providers/neutrino';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor(private neutrino: Neutrino) {
		this.neutrino.log();
	}
}
