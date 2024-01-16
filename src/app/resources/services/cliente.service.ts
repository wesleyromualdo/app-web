import { Injectable } from '@angular/core';
import { URL } from 'src/app/resources/util/constants';
import {RequestService} from "./request.service";
import {Cliente, ClienteUsuarios} from "../models/ClienteModel";

@Injectable({
    providedIn: 'root'
})
export class ClienteService {

    constructor(private http: RequestService) { }

    async pesquisar(tx_sigla:any='', tx_nome:any='', bo_status:any='', pagina: number = 0, tamanho_pagina: number = 0){
        let url = `${URL}/cliente?tx_sigla=${tx_sigla}&tx_nome=${tx_nome}&bo_status=${bo_status}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url, false).then(result => {
            //let ret = [];
            //console.log('result', result);
            /*if (result && result.length > 0) {
                ret = result.map(() => new Cliente(result));
            }*/
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async gravar(cliente: Cliente){
        let url = `${URL}/cliente/`;

        return this.http.post(url, cliente).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async editar(cliente: Cliente){
        let url = `${URL}/cliente/`;

        return this.http.put(url, cliente).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async editarUltimoAcesso(cliente: ClienteUsuarios){
        let url = `${URL}/cliente/ultimo_acesso`;

        return this.http.put(url, cliente).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getById(id: number){
        let url = `${URL}/cliente/${id}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async excluir(id: number){
        let url = `${URL}/cliente/${id}`;

        return this.http.delete(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

}
