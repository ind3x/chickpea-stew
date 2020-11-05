import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-card-wrapper',
    templateUrl: './card-wrapper.component.html',
    styleUrls: ['./card-wrapper.component.scss']
})
export class CardWrapperComponent implements OnInit {

    @Input() title: string;

    constructor() {
    }

    ngOnInit() {
    }

}
