const xrequire: Function = window["require"];
import { Injectable } from '@angular/core';

const remote = xrequire("electron").remote;

export class ElectronProvider {
	openWindow() { }
	browseFolder(): IBrowseFolderResponse {
		return;
	}
	changeProjectFolder(newLocatioN: string) { }
	getChanges(): IFileChange[] {
		return;
	}
	getProjectFolder(): string {
		return;
	}
	getPollData(): IPollData {
		return;
	}
	refreshProject() { }
	getSyncServer(): SyncServer {
		return;
	}
	getPluginInstaller(): PluginInstaller {
		return;
	}
	getRoot(): string[] {
		return;
	}
	readASAR(): string[] {
		return;
	}
}

export interface IBrowseFolderResponse {
	code: number;
	message: string;
	paths: string[];
}

export interface IFileChange {
	filename: string;
	deleted: boolean;
	relative: string;
	id: string;

	isDirectory?: boolean;
	isFile?: boolean;
}

export interface IMappingItem {
	source: string;
	target: string;
	timestamp: number;
	id: string;
}

export interface IPollData {
	nchanges: number;
	timestamp: number;
	mapping: IMappingItem[];
}

export class FileWatcher {
	getChanges() {

	}

	getDeletions() {

	}

	changeDirectory(dir: string) {

	}

	getSyncDir(): string {
		return;
	}

	countChanges(): number {
		return;
	}

	getStructure(): any {
		return;
	}

	refreshProject() {
		return;
	}
}

export class Mapper {
	add(source: string, target: string): IMappingItem {
		return;
	}

	remove(id: string) {

	}

	getMapping(): IMappingItem[] {
		return [];
	}

	writeMapping() {

	}
}

export class SyncServer {
	changeProjectFolder(newLocation: string) {

	}

	getFileWatcher(): FileWatcher {
		return;
	}

	getMapper(): Mapper {
		return;
	}

	getPollData(): IPollData {
		return;
	}
}
export class PluginInstaller {
	install(from: string) {

	}
}

@Injectable()
export class Neutrino {
	public readonly remote: ElectronProvider = remote.require("./main").provider;
	public syncServer: SyncServer = null;

	constructor() {
		this.syncServer = this.getSyncServer();

		window["getRoot"] = () => {
			return this.getRoot();
		}
	}

	log() {

	}

	openWindow() {
		this.remote.openWindow();
	}

	browseFolder(): IBrowseFolderResponse {
		return this.remote.browseFolder();
	}

	changeProjectFolder(newLocation: string) {
		this.remote.changeProjectFolder(newLocation);
	}

	getChanges(): IFileChange[] {
		return this.remote.getChanges();
	}

	getProjectFolder(): string {
		return this.remote.getProjectFolder();
	}

	getPollData(): IPollData {
		return this.remote.getPollData();
	}

	getSyncServer(): SyncServer {
		return this.remote.getSyncServer();
	}

	refreshProject() {
		this.remote.refreshProject();
	}

	getRoot(): string[] {
		return this.remote.getRoot();
	}
}
