import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

interface ISidebarItem {
	display: string;
	link: string;
}

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	sidebarItems: ISidebarItem[] = [
		{ display: "Main", link: "/app/main" },
		{ display: "Settings", link: "/app/settings" },
		// { display: "Test", link: "/app/test" },
	];

	constructor(
		private router: Router,
	) {
	}
	ngOnInit() {
	}
}
