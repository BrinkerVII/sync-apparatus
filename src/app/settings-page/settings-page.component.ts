import { Component, OnInit } from '@angular/core';
import { Neutrino } from '../../providers/neutrino';

@Component({
	selector: 'app-settings-page',
	templateUrl: './settings-page.component.html',
	styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {

	constructor(private neutrino: Neutrino) { }

	ngOnInit() {
	}

	installPlugin() {
		this.neutrino.remote.getPluginInstaller().install()
			.then(res => {
				alert("Installed plugin!");
				console.log(res);
			})
			.catch(err => {
				alert("Oh no, something went wrong!\n\n" + err.toString());
			});
	}
}
