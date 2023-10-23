import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";

export interface PeriodicElement {
    check: string;
    id: string;
    botao: string;
    tarefa: string;
    automacao: string;
    inicio: string;
    tempo : string;
    status : string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {check: '1', id: '1245', botao: '', tarefa: 'Tarefa Nº 1', automacao: 'Robo_teste', inicio: 'Hoje às 15:34', tempo: '07:31:59', status: 'executando'},
    {check: '2', id: '1245', botao: '', tarefa: 'Tarefa Nº 1', automacao: 'Robo_teste', inicio: 'Hoje às 15:34', tempo: '07:31:59', status: 'executando'},
    {check: '3', id: '1245', botao: '', tarefa: 'Tarefa Nº 1', automacao: 'Robo_teste', inicio: 'Hoje às 15:34', tempo: '07:31:59', status: 'executando'},
    {check: '4', id: '1245', botao: '', tarefa: 'Tarefa Nº 1', automacao: 'Robo_teste', inicio: 'Hoje às 15:34', tempo: '07:31:59', status: 'executando'},
    {check: '5', id: '1245', botao: '', tarefa: 'Tarefa Nº 1', automacao: 'Robo_teste', inicio: 'Hoje às 15:34', tempo: '07:31:59', status: 'executando'},
    {check: '6', id: '1245', botao: '', tarefa: 'Tarefa Nº 1', automacao: 'Robo_teste', inicio: 'Hoje às 15:34', tempo: '07:31:59', status: 'executando'},
    {check: '7', id: '1245', botao: '', tarefa: 'Tarefa Nº 1', automacao: 'Robo_teste', inicio: 'Hoje às 15:34', tempo: '07:31:59', status: 'executando'},
    {check: '8', id: '1245', botao: '', tarefa: 'Tarefa Nº 1', automacao: 'Robo_teste', inicio: 'Hoje às 15:34', tempo: '07:31:59', status: 'executando'},
    {check: '9', id: '1245', botao: '', tarefa: 'Tarefa Nº 1', automacao: 'Robo_teste', inicio: 'Hoje às 15:34', tempo: '07:31:59', status: 'executando'},
    {check: '10', id: '1245', botao: '', tarefa: 'Tarefa Nº 1', automacao: 'Robo_teste', inicio: 'Hoje às 15:34', tempo: '07:31:59', status: 'executando'},
];

@Component({
    selector: 'app-widget-lista-tarefas',
    templateUrl: './lista-tarefas.component.html',
    styleUrls: ['./lista-tarefas.component.scss']
})
export class ListaTarefasComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    checked = false;

    displayedColumns: string[] = ['check', 'id', 'botao', 'tarefa', 'automacao', 'inicio', 'tempo', 'status'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    constructor(private router: Router) { }

    ngOnInit(): void {

        this.dataSource.paginator = this.paginator;
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    novo(){
        this.router.navigate(['cadastro-automacao']);
    }

}
