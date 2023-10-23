import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatSidenav} from "@angular/material/sidenav";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import { delay, filter } from 'rxjs/operators';

@UntilDestroy()
@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss']
})

export class DefaultComponent implements OnInit {

    sideBarOpen = true;
    @ViewChild(MatSidenav) sidenav!: MatSidenav;

    constructor(private router: Router,
                private observer: BreakpointObserver) { }

    ngOnInit(){
        //this.spinner.show();
    }

    ngAfterViewInit(){
        this.observer.observe(['(max-width: 850px)'])
            .pipe(delay(1), untilDestroyed(this))
            .subscribe((res) => {
                console.log('matches', res.matches);
                if (res.matches) {
                    this.sidenav.mode = 'over';
                    this.sidenav.close();
                } else {
                    this.sidenav.mode = 'side';
                    this.sidenav.open();
                }
            });

        this.router.events
            .pipe(
                untilDestroyed(this),
                filter((e) => e instanceof NavigationEnd)
            )
            .subscribe(() => {
                if (this.sidenav.mode === 'over') {
                    this.sidenav.close();
                }
            });
    }

    sideBarToggler(){
        this.sideBarOpen = !this.sideBarOpen;
    }

}
