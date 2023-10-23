import { Injectable } from '@angular/core';
import { URL } from 'src/app/resources/util/constants';
import {RequestService} from "./request.service";
import {CofreSenha, DadosAcesso, SenhaAcesso, Usuario} from "../models/UsuarioModel";
import {LoginModel} from "../models/LoginModel";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    constructor(private http: RequestService) { }

    async pesquisar(nu_cpf:any='',tx_nome:any='',setor_id:any='', bo_status:any='', pagina: number = 0, tamanho_pagina: number = 0){

        let url = `${URL}/usuario?nu_cpf=${nu_cpf}&tx_nome=${tx_nome}&setor_id=${setor_id}&bo_status=${bo_status}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async gravar(model: Usuario){
        let url = `${URL}/usuario/`;

        return this.http.post(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async editar(model: Usuario){
        let url = `${URL}/usuario/`;

        return this.http.put(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async senhaAcesso(model: SenhaAcesso){
        let url = `${URL}/usuario/senha-acesso/`;

        return this.http.put(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async esqueciSenhaAcesso(model: SenhaAcesso){
        let url = `${URL}/usuario/esqueci-senha/`;

        return this.http.put(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async cadastroDadosAcesso(model: DadosAcesso){
        let url = `${URL}/usuario/dados-acesso/`;

        return this.http.post(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async cofresenha(model: CofreSenha){
        let url = `${URL}/cofresenha/`;

        return this.http.post(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getById(nu_cpf: string){
        let url = `${URL}/usuario/${nu_cpf}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getPerfilByCPF(nu_cpf: string){
        let url = `${URL}/perfil/usuario/${nu_cpf}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getSetorByCPF(nu_cpf: string){
        let url = `${URL}/setor/usuario/${nu_cpf}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getAutomacaoByCPF(nu_cpf: string, setor_id: number){
        let url = `${URL}/automacao/usuario/${nu_cpf}/${setor_id}`;

        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getAutomacaoByCPFDashBoard(nu_cpf: string, setor_id: number, periodo: number){
        let url = `${URL}/automacao/combodashboard/${nu_cpf}/${setor_id}/${periodo}`;

        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async excluir(id: number){
        let url = `${URL}/usuario/${id}`;

        return this.http.delete(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

}
