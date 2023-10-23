export class Modulo {
    nu_codigo: any;
    tx_nome: any;
    tx_link: any;
    tx_icon: any;
    nu_ordem: any;
    bo_status: any;

    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.nu_codigo =  data.nu_codigo;
            this.tx_nome = data.tx_nome;
            this.tx_link = data.tx_link;
            this.tx_icon = data.tx_icon;
            this.nu_ordem = data.nu_ordem;
            this.bo_status = data.bo_status;
        }
    }
}
