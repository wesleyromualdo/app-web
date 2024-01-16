export class ClienteUsuarios {
    nu_cpf: any;
    cliente_id: any;
}
export class Cliente {
    tx_sigla: any;
    tx_nome: any;
    bo_status: any;
    nu_worker: any;

    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.tx_sigla =  data.tx_sigla;
            this.tx_nome = data.tx_nome;
            this.bo_status = data.bo_status;
            this.nu_worker = data.nu_worker;
        }
    }
}

