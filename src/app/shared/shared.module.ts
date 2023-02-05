import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebcamModule } from 'ngx-webcam';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CameraComponent } from './components/camera/camera.component';
import { PrimengModule } from './primeng/primeng.module';

@NgModule({
    declarations: [CameraComponent],
    exports: [CameraComponent],
    imports: [CommonModule, WebcamModule, ImageCropperModule, PrimengModule],
})
export class SharedModule {}
