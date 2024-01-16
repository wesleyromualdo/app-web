export class Automacao {
    id: any;
    cliente_id: any;
    tx_nome: any;
    tx_descricao: any;
    tx_json: any;
    dt_inclusao: any;
    bo_status: any;
    nu_qtd_tarefa: any;
    nu_cpf: any;
    nu_qtd_download: any;
    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.id = data.id;
            this.cliente_id = data.cliente_id;
            this.tx_nome = data.tx_nome;
            this.tx_descricao = data.tx_descricao;
            this.tx_json = data.tx_json;
            this.dt_inclusao = data.dt_inclusao;
            this.bo_status = data.bo_status;
            this.nu_qtd_tarefa = data.nu_qtd_tarefa;
            this.nu_cpf = data.nu_cpf;
        }
    }
}
