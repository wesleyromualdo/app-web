import {URL} from "./constants";
import * as moment from 'moment';

export class Util {

    static validarCPF(strCPF: string) {
        let soma = 0;
        let resto;
        let i;

        if (strCPF == '00000000000') {
            return false;
        }

        for (i = 1; i <= 9; i++) {
            soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;

        if ((resto == 10) || (resto == 11)) {
            resto = 0;
        }
        if (resto != parseInt(strCPF.substring(9, 10))) {
            return false;
        }

        soma = 0;

        for (i = 1; i <= 10; i++) {
            soma = soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;

        if ((resto == 10) || (resto == 11)) {
            resto = 0;
        }
        if (resto != parseInt(strCPF.substring(10, 11))) {
            return false;
        }
        return true;
    }

    static validarSenha(senha: string) {
        return senha.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/g) !== null;
    }

    static formatarCpf(value:any) {

        if (!value) {
            return value;
        }

        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '\$1.\$2.\$3\-\$4');
    }

    static formataTelefone(value:any) {

        if (!value) {
            return value;
        }

        if(value.length == 10) {
            return value.replace(/(\d{2})?(\d{4})?(\d{4})/, function(matchDaRegex: any, grupo1: any, grupo2: any, grupo3: any) {
                return `(${grupo1}) ${grupo2}-${grupo3}`;
            });
        } else if (value.length == 11) {
            return value.replace(/(\d{2})?(\d{5})?(\d{4})/, function(matchDaRegex: any, grupo1: any, grupo2: any, grupo3: any) {
                return `(${grupo1}) ${grupo2}-${grupo3}`;
            });
        }
    }
    public static getMascaraCPF(value: any) {
        value = value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return value;
    }

    static mascararCpf(value:any) {
        return value.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/, function(matchDaRegex: any, grupo1: any, grupo2: any, grupo3: any, grupo4: any) {
            return `${grupo1}.***.***-${grupo4}`;
        });
    }

    static removerAcentos(newStringComAcento: any) {
        let string = (newStringComAcento).toString();
        const mapaAcentosHex = {
            a: /[\xE0-\xE6]/g,
            e: /[\xE8-\xEB]/g,
            i: /[\xEC-\xEF]/g,
            o: /[\xF2-\xF6]/g,
            u: /[\xF9-\xFC]/g,
            c: /\xE7/g,
            n: /\xF1/g
        };

        for (const letra in mapaAcentosHex) {
            // @ts-ignore
            const expressaoRegular = mapaAcentosHex[letra];
            string = string.replace(expressaoRegular, letra);
        }

        return string;
    }

    static diferencaEntreDatas(dt_inicio: any, dt_fim: any){
        dt_fim = moment(dt_fim); // Data de hoje
        dt_inicio = moment(dt_inicio); // Outra data no passado

        const duration = moment.duration(dt_fim.diff(dt_inicio));

        //item.tempo =

        // @ts-ignore
        const horas = duration._data.hours;
        // @ts-ignore
        const minutos = duration._data.minutes;
        // @ts-ignore
        const segundos = duration._data.seconds;
        // @ts-ignore
        const dias = duration._data.days;

        let tempo = '';
        if( dias > 0 ){
            tempo = dias+' dias '+String('00' + horas).slice(-2)+':'+String('00' + minutos).slice(-2)+':'+String('00' + segundos).slice(-2);
        } else {
            if( horas <= 24 ){
                tempo = String('00' + horas).slice(-2)+':'+String('00' + minutos).slice(-2)+':'+String('00' + segundos).slice(-2);
            }
        }
        /*console.log('horas',duration.asHours());
        console.log('minutos',duration.asMinutes());
        // @ts-ignore
        console.log(duration._data.days, duration._data.hours, duration._data.minutes, duration._data.seconds);
        //console.log('historico', item.historico, moment(item.historico.dt_fim), dias, duration);*/

        return tempo;
    }

    static ValidatorJson(json: any){
        try{
            if( json != '' && json != undefined ) {
                return JSON.parse(json);
            } else {
                return {status:0, error:''};
            }
        }catch (e) {
            return {status:0, error:e};
        }
    }
}
