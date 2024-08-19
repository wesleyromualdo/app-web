import {Component, Input, OnInit, ViewChild, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort, MatSortable, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from "@angular/cdk/a11y";

import {msgSemRegistro, PAGINADOR} from "../../../resources/util/constants";
import {LoginService} from "../../../resources/services/login.service";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-datatable',
    templateUrl: './datatable.component.html',
    styleUrls: ['./datatable.component.scss'],
    providers: [  
        MatDatepickerModule,
        MatNativeDateModule  
      ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatableComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) matSort: MatSort | undefined;

    @Output() outputDados = new EventEmitter<any>();

    @Input() configTable: any;
    @Input() dados: any;
    @Input() bo_status: boolean = true;

    columns: any = [];
    confColumns: any = [];
    confTable: any = [];
    paginadorTable: any = [];
    msgSemRegistro = msgSemRegistro;
    dataSource: any;
    currentPage: any;
    paginador = PAGINADOR
    userData: any;
    length: any;

    startDate: Date = new Date();
    endDate: Date = new Date();

    constructor(private _liveAnnouncer: LiveAnnouncer,
                private loginService: LoginService) { }

    ngOnInit(): void {
        if( this.configTable.page == undefined){
            this.configTable.page = {
                length: 0,
                pageIndex: 0,
                pageSize: 0,
                previousPageIndex: 0
            }
        }
        this.length = this.configTable.page.length > 0 ? this.configTable.page.length : this.paginador.length;
        
        this.currentPage = this.configTable.page.pageIndex;
        this.confColumns = this.configTable.columns;
        this.confTable = this.configTable.table;
        this.userData = this.loginService.getUserData();

        this.confColumns.forEach((item:any) => {
            if( item.botao ) {
                let jsonBtn:any = [];
                item.botao.forEach((btn: any) => {
                    if( !this.bo_status && (btn.label == 'Excluir' && btn.label || 'Inativar') ){
                        btn.label = 'Ativar';
                        btn.icon = 'check_circle_outline'
                    } else {
                        jsonBtn.push({label: btn.label, icon: btn.icon, callback: btn.callback});
                    }
                });
                item.botao = jsonBtn;
            }
            //console.log(item);
            this.columns.push(item.field);
        });
        this.dataSource = new MatTableDataSource(this.dados);

    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.matSort;
        if( this.configTable.page.length > 0 ){
            this.paginador.length = this.configTable.page.length;
        }

        setTimeout(() => {
            console.log('setTimeout', this.configTable.page);
            this.dataSource.paginator.length = this.length;
            this.dataSource.paginator.pageIndex = this.configTable.page.pageIndex;
            this.dataSource.paginator.pageSize = this.configTable.page.pageSize;
            this.dataSource.paginator.previousPageIndex = this.configTable.page.previousPageIndex;
            console.log('setTimeout', this.dataSource.paginator);
        }, 500);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
        this.addOutput('pesquisa', filterValue);
    }

    //sortData(sortState: Sort) {
    sortData(sortState: any) {
        //this.matSort.sort({ id: 'columnName', start: 'asc', disableClear: false });

        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    addOutput(callback:any, element: any) {
        this.outputDados.emit({callback: callback, element: element});
    }

    onChangeToggle(event: any){
        this.bo_status = event.checked;
        this.addOutput('status', this.bo_status);
    }

    handlePageEvent(e: PageEvent) {
        this.addOutput('paginator', e);
        //this.pageEvent = e;
        this.length = e.length;
        //this.pageSize = e.pageSize;
        //this.pageIndex = e.pageIndex;
    }

    onDateChange(callback:any) {
        const pad = (num:any) => num < 10 ? '0' + num : num;

        const startDateFormatted = this.startDate ? 
            `${this.startDate.getFullYear()}-${pad(this.startDate.getMonth() + 1)}-${pad(this.startDate.getDate())}` 
            : null;

        const endDateFormatted = this.endDate ? 
            `${this.endDate.getFullYear()}-${pad(this.endDate.getMonth() + 1)}-${pad(this.endDate.getDate())}` 
            : null;
        
        if (startDateFormatted && endDateFormatted) {
            this.outputDados.emit({callback: callback, element: '', startDate: startDateFormatted, endDate: endDateFormatted});
        }
    }
}
