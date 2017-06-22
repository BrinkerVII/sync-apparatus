import { Component, OnInit } from '@angular/core';
import { Neutrino } from '../../providers/neutrino';

@Component({
	selector: 'app-test-page',
	templateUrl: './test-page.component.html',
	styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {
	constructor(private neutrino: Neutrino) { }

	ngOnInit() {
	}
}
