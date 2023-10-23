import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter()
    @Input() menuSelected = 'Dashboard';

    constructor() { }

    ngOnInit(): void {
    }

    toggleSideBar(){
        this.toggleSideBarForMe.emit();
        setTimeout(() => function(){
            window.dispatchEvent( new Event('resize'))
        }, 300);
    }

}
