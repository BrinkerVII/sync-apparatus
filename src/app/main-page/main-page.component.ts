import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Neutrino, IBrowseFolderResponse, IFileChange, IMappingItem } from '../../providers/neutrino';

import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-main-page',
	templateUrl: './main-page.component.html',
	styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
	private projectFolder = "//null";
	private changes: IFileChange[] = [];
	private changeTimer: any = null;
	private currentMapping: IMappingItem[] = [];

	private formAdd: FormGroup;

	constructor(
		private neutrino: Neutrino
	) {
		this.formAdd = new FormGroup({
			from: new FormControl('', [Validators.required]),
			to: new FormControl('', [Validators.required]),
		});
	}

	browse() {
		let response: IBrowseFolderResponse = this.neutrino.browseFolder();
		if (response.code === 0) {
			if (response.paths.length >= 0) {
				this.projectFolder = response.paths[0];
				this.neutrino.changeProjectFolder(this.projectFolder);

				setTimeout(() => {
					this.refreshChanges();
				}, 100);
			}
		}
	}

	refreshChanges() {
		this.changes = this.neutrino.getChanges();
		this.currentMapping = this.neutrino.syncServer.getMapper().getMapping();

		console.log(this.currentMapping);
	}

	refreshProject() {
		this.neutrino.syncServer.getFileWatcher().refreshProject();
	}

	ngOnInit() {
		this.projectFolder = this.neutrino.getProjectFolder();
		this.refreshChanges();
	}

	addMapping() {
		this.neutrino.syncServer.getMapper().add(
			this.formAdd.value.from,
			this.formAdd.value.to
		);

		this.formAdd.reset();
		this.refreshChanges();
	}

	deleteMapping(id: string) {
		this.neutrino.syncServer.getMapper().remove(id);
		this.refreshChanges();
	}

	ngOnDestroy() {

	}
}
