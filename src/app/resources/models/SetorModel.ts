export class SetorUsuarios {
    nu_cpf: any;
    setor_id: any;
}
export class Setor {
    tx_sigla: any;
    tx_nome: any;
    bo_status: any;
    nu_executor: any;

    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.tx_sigla =  data.tx_sigla;
            this.tx_nome = data.tx_nome;
            this.bo_status = data.bo_status;
            this.nu_executor = data.nu_executor;
        }
    }
}

