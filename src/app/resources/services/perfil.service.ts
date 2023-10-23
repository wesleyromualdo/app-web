import { Injectable } from '@angular/core';
import { URL } from 'src/app/resources/util/constants';
import {RequestService} from "./request.service";
import {Perfil} from "../models/PerfilModel";

@Injectable({
    providedIn: 'root'
})
export class PerfilService {

    constructor(private http: RequestService) { }

    async pesquisar(tx_nome:any='', bo_status:any='', pagina: number = 0, tamanho_pagina: number = 0){

        let url = `${URL}/perfil?tx_nome=${tx_nome}&bo_status=${bo_status}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async gravar(model: Perfil){
        let url = `${URL}/perfil/`;

        return this.http.post(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async editar(model: Perfil){
        let url = `${URL}/perfil/`;

        return this.http.put(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getById(id: number){
        let url = `${URL}/perfil/${id}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async excluir(id: number){
        let url = `${URL}/perfil/${id}`;

        return this.http.delete(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

}
