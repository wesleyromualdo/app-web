import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
// @ts-ignore
import { Camera, CameraDirection, CameraResultType, CameraSource } from "@capacitor/camera";
// @ts-ignore
import { ImageOptions, Photo } from "@capacitor/camera/dist/esm/definitions";
import {base64ToFile, ImageCroppedEvent} from "ngx-image-cropper";

@Component({
    selector: 'app-editar-imagem',
    templateUrl: './editar-imagem.component.html',
    styleUrls: ['./editar-imagem.component.scss']
})
export class EditarImagemComponent implements OnInit {

    croppedImage: any = '';
    showCropper = false;
    selectedPhotoBase64:any;

    constructor(public dialogRef: MatDialogRef<EditarImagemComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(): void {}

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
            source: CameraSource.Photos,
            direction: CameraDirection.Front,
            resultType: CameraResultType.DataUrl,
        };
        //}

        const image: Photo = await Camera.getPhoto(options);
        this.selectedPhotoBase64 = image.dataUrl;
        //console.log(this.selectedPhotoBase64);
    }

    async imageCropped(event: any) {
        //await this.mergePhotos(event.base64);
        this.croppedImage = event.base64;
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
