import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit  {
    @ViewChild('tabGroup') tabGroup: any;
    abaIndex:any = 1;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(){
        this.route.queryParams.subscribe(params => {
            if( params['aba'] ) {
                this.abaIndex = parseInt(params['aba']);
            }
        });
    }

    ngAfterViewInit() {
        //console.log('After ', this.abaIndex);
    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        this.abaIndex = tabChangeEvent.index;
        //console.log('abaTarefa: ', this.abaIndex);
    }
}
