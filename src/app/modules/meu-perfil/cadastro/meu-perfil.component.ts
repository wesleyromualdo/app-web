import { Component, OnInit } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Usuario} from "../../../resources/models/UsuarioModel";
import {ActivatedRoute, Router} from "@angular/router";
import {UsuarioService} from "../../../resources/services/usuario.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {ClienteService} from "../../../resources/services/cliente.service";
import {LoginService} from "../../../resources/services/login.service";
// @ts-ignore
import { Camera, CameraDirection, CameraResultType, CameraSource } from "@capacitor/camera";
// @ts-ignore
import { ImageOptions, Photo } from "@capacitor/camera/dist/esm/definitions";
import {base64ToFile, ImageCroppedEvent} from "ngx-image-cropper";
import {MatDialog} from "@angular/material/dialog";
import {EditarImagemComponent} from "../editar-imagem/editar-imagem.component";

@Component({
    selector: 'app-meu-perfil',
    templateUrl: './meu-perfil.component.html',
    styleUrls: ['./meu-perfil.component.scss']
})
export class MeuPerfilComponent implements OnInit {

    selectedPhotoBase64:any='';
    isChecked: boolean = true;
    selection = new SelectionModel<any>(true, []);
    userData: any;
    croppedImage: any = '';
    showCropper = false;
    labelButton = 'Editar imagem';

    public formulario: FormGroup = new FormGroup({
        nu_cpf: new FormControl('', [Validators.required]),
        tx_nome: new FormControl('', [Validators.required]),
        tx_foto: new FormControl('', []),
        tx_email: new FormControl('', [Validators.required, Validators.email]),
        bo_status: new FormControl(this.isChecked, [])
    });

    public model: Usuario = new Usuario();

    constructor(private usuarioService: UsuarioService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private clientePerfil: ClienteService,
                private loginService: LoginService,
                private router: Router,
                private dialog: MatDialog) { }

    async ngOnInit() {
        this.userData = this.loginService.getUserData();
        await this.getUsuarioByCpf();
        console.log(this.selectedPhotoBase64)
    }

    async getUsuarioByCpf(){
        let retorno = await this.usuarioService.getById(this.userData.nu_cpf);
        this.croppedImage = retorno.tx_foto;

        if( this.croppedImage == undefined || this.croppedImage == '' ){
            this.labelButton = 'Inserir imagem';
        }
        this.model = retorno;
    }

    get nu_cpf(){
        return this.formulario.get('nu_cpf')!;
    }

    get tx_nome(){
        return this.formulario.get('tx_nome')!;
    }

    get tx_email(){
        return this.formulario.get('tx_email')!;
    }

    async onSubmit(){
        this.spinner.show();
        if( this.formulario.status == 'VALID'){
            let retorno = [];
            let msg = 'Usuário atualizado com sucesso!';
            this.formulario.value.nu_cpf = this.userData.nu_cpf;
            this.formulario.value.tx_foto = this.croppedImage;
            retorno = await this.usuarioService.editar(this.formulario.value);
            if( retorno.nu_cpf ){
                this.snackBar.open(msg, '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
            }
        }
        this.spinner.hide();
    }

    trocarSenha(){
        this.router.navigate(['editar-senha']);
    }

    editarImagem(){
        const dialogRef = this.dialog.open(EditarImagemComponent, {
            width: '500px',
            data: {texto: 'perfil'}
        });

        dialogRef.afterClosed().subscribe(async result => {
            console.log(result);
        });
    }

    async tirarFoto(type:any='camera'){
        let options: ImageOptions;

        /*if (type === 'galeria') {
            options = {
                quality: 60,
                width: 800,
                allowEditing: false,
                correctOrientation: true,
                source: CameraSource.Photos,
                direction: CameraDirection.Front,
                resultType: CameraResultType.DataUrl
            };
        }*/
        //if (type === 'camera') {
            options = {
                quality: 60,
                width: 800,
                allowEditing: false,
                correctOrientation: true,
                source: CameraSource.Camera,
                direction: CameraDirection.Front,
                resultType: CameraResultType.DataUrl,
            };
        //}

        const image: Photo = await Camera.getPhoto(options);
        this.selectedPhotoBase64 = image.dataUrl;
        this.showCropper = true;
        //console.log(this.selectedPhotoBase64);
    }

    async imageCropped(event: ImageCroppedEvent) {
        //await this.mergePhotos(event.base64);
        this.croppedImage = event.base64;
        //console.log(this.croppedImage);
        if (event.base64 != null) {
            console.log(event, base64ToFile(event.base64));
        }
    }

    imageLoaded() {
        this.showCropper = true;
        console.log('Image loaded');
    }

    loadImageFailed() {
        console.log('Load failed');
    }

}
