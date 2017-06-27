import { Component, OnInit } from '@angular/core';
import { Neutrino } from '../../providers/neutrino';

interface IOutputState {
	text?: string;
	error: boolean;
	errorObject?: any;
}

@Component({
	selector: 'app-settings-page',
	templateUrl: './settings-page.component.html',
	styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
	private installerState: IOutputState;
	private uninstallerState: IOutputState;

	constructor(private neutrino: Neutrino) {
		this.installerState = {
			error: false
		}
		this.uninstallerState = {
			error: false
		}
	}

	ngOnInit() {
	}

	openPluginPage() {
		this.neutrino.remote.openPluginInBrowser();
	}

	installPlugin() {
		this.neutrino.remote.getPluginInstaller().install()
			.then(res => {
				this.installerState.error = false;
				this.installerState.text = "Successfully installed plugin!";
				this.installerState.errorObject = null;
			})
			.catch(err => {
				this.installerState.error = true;
				this.installerState.text = "Something went wrong while installing the plugin";
				this.installerState.errorObject = err;
			});
	}

	removePlugin() {
		this.neutrino.remote.getPluginInstaller().uninstall()
			.then(() => {
				// alert("Removed plugin!");
				this.uninstallerState.error = false;
				this.uninstallerState.text = "Successfully removed plugin!";
				this.uninstallerState.errorObject = null;
			})
			.catch(err => {
				this.uninstallerState.error = true;
				this.uninstallerState.text = "Something went wrong while uninstalling the plugin";
				this.uninstallerState.errorObject = err;
			})
	}
}
