//require('dotenv').config()

import {environment} from "../../../environments/environment";
//'http://127.0.0.1:8000'
//export const URL = (environment.url ? environment.url : 'http://127.0.0.1:8000') ;
//export const URL = 'http://127.0.0.1:8000';
export const URL = 'https://plataforma-api.automaxia.com.br';

export const USER_DATA = '_user_data_botsolve';
export const TOKEN_AUTH = '_tokenAuthorization_botsolve';

export const DateTimeFormat = 'DD/MM/YYYY - HH:mm';
export const DateTimeShortFormat = 'DD/MM/YY HH:mm';
export const DateFormat = 'DD/MM/YYYY';

export const msgSemRegistro: string = 'Não foi encontrado nenhum registro para o(s) filtro(s) informado(s)!';

export const PAGINADOR: any = {
    length:500,
    pageSize: 20,
    pageSizeOptions: [5, 10, 20, 50, 100]
}
