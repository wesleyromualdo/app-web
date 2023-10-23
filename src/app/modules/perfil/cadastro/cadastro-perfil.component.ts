import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {Perfil} from "../../../resources/models/PerfilModel";
import {PerfilService} from "../../../resources/services/perfil.service";
import {ModuloService} from "../../../resources/services/modulo.service";
import {Modulo} from "../../../resources/models/ModuloModel";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {SelectionModel} from "@angular/cdk/collections";
import {LoginService} from "../../../resources/services/login.service";

@Component({
    selector: 'app-novo-perfil',
    templateUrl: './cadastro-perfil.component.html',
    styleUrls: ['./cadastro-perfil.component.scss']
})
export class CadastroPerfilComponent implements OnInit {

    isChecked: boolean = true;
    tx_ativo: string = 'Ativo';
    codigo: any = '';
    superuser: boolean = false;
    checked = false;
    indeterminate = false;
    menuTexto = 'Novo Perfil';
    selection = new SelectionModel<any>(true, []);
    usuarioSetorId: any;

    public formulario: any = new FormGroup({
        id: new FormControl('', []),
        tx_finalidade: new FormControl('', [Validators.required]),
        tx_nome: new FormControl('', [Validators.required]),
        bo_superuser: new FormControl('', [Validators.required]),
        bo_delegar: new FormControl('', [Validators.required]),
        constante_virtual: new FormControl('', [Validators.required]),
        bo_status: new FormControl(this.isChecked, []),
        menu: new FormControl('', [])
    });
    modulos: any;

    public model: Perfil = new Perfil();

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private perfilService: PerfilService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private route: ActivatedRoute,
                private moduloService: ModuloService,
                private loginService: LoginService) { }

    async ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.codigo = params['id'];
        });

        const userData = this.loginService.getUserData();
        this.usuarioSetorId = userData.setor_id;

        this.modulos = await this.moduloService.pesquisar();

        if( this.codigo ){
            this.menuTexto = 'Editar Perfil';
            this.getSetorById();
        }
    }

    async getSetorById(){
        let retorno = await this.perfilService.getById(this.codigo);

        if( retorno.menu && retorno.menu.length > 0 ){
            this.modulos.forEach( (item: any) => {
                item.checked = false;

                let menu = retorno.menu.find(function(menu: any) {
                    return menu.id === item.id;
                });

                if( menu ){
                    item.checked = true;
                    this.selection.toggle(item);
                }
            });
        }

        //console.log(retorno);
        this.model = retorno;
        if( !this.model.bo_status ){
            this.isChecked = false;
            this.tx_ativo = 'Inativo';
        }
        this.superuser = retorno.bo_superuser;
        this.formulario.value = this.model;
    }

    get tx_nome(){
        return this.formulario.get('tx_nome')!;
    }
    get tx_finalidade(){
        return this.formulario.get('tx_finalidade')!;
    }
    get bo_superuser(){
        return this.formulario.get('bo_superuser')!;
    }
    get bo_delegar(){
        return this.formulario.get('bo_delegar')!;
    }
    get constante_virtual(){
        return this.formulario.get('constante_virtual')!;
    }
    get menu(){
        return this.formulario.get('menu')!;
    }
    voltar(){
        this.router.navigate(['perfil'])
    }

    async onSubmit(){
        let menu: any = [];
        this.selection.selected.forEach(item => {
            menu.push({id: item.id, setor_id: this.usuarioSetorId})
        });
        this.formulario.value['menu'] = menu;

        //console.log(this.formulario.value);
        this.spinner.show();
        if( this.formulario.status == 'VALID' && this.selection.selected.length > 0 ){
            let retorno = [];
            let msg = 'Perfil cadastrado com sucesso!';
            if( this.codigo ){
                this.formulario.value.id = this.codigo;
                retorno = await this.perfilService.editar(this.formulario.value);
                msg = 'Perfil atualizado com sucesso!';
            } else {
                retorno = await this.perfilService.gravar(this.formulario.value);
            }
            //console.log('retorno ', retorno);
            if( retorno.id ){
                this.snackBar.open(msg, '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
                this.voltar();
            }
        }
        this.spinner.hide();
    }

    onChangeToggle(event: any){
        this.formulario.value.bo_status = event.checked;
    }
}
