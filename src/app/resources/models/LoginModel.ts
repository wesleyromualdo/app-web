export class LoginModel {
    public username: string | any;
    public password: string | any;
}

export class Usuario {
    nu_cpf: any;
    tx_nome: any;
    tx_email: any;
    bo_status: any;
    dt_inclusao: any;

    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.nu_cpf =  data.nu_cpf;
            this.tx_nome = data.tx_nome;
            this.tx_email = data.tx_email;
            this.dt_inclusao = data.dt_inclusao;
            this.bo_status = data.bo_status;
        }
    }
}

export class LoginResponseModel {
    usuario: any = Usuario
    access_token: any;
    token_type: any;
}
