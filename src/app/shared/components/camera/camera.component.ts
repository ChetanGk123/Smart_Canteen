import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
    selector: 'app-camera',
    templateUrl: './camera.component.html',
    styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {
    @Output() getPicture = new EventEmitter<File>();
    showWebcam = true;
    isCameraExist = true;

    errors: WebcamInitError[] = [];
    public cropImage: File;
    public imageChangedEvent: any = '';
    public croppedImage: any = '';
    public showCropper = false;
    public canvasRotation = 0;
    public rotation = 0;
    public scale = 1;
    public containWithinAspectRatio = false;
    public transform: ImageTransform = {};

    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    private nextWebcam: Subject<boolean | string> = new Subject<
        boolean | string
    >();

    constructor() {}

    ngOnInit(): void {
        WebcamUtil.getAvailableVideoInputs().then(
            (mediaDevices: MediaDeviceInfo[]) => {
                this.isCameraExist = mediaDevices && mediaDevices.length > 0;
            }
        );
    }

    takeSnapshot(): void {
        this.trigger.next();
    }

    selectFile(event) {
        this.cropImage = event.target.files[0];
        this.showWebcam = false;
    }

    onOffWebCame() {
        this.cropImage = null;
        this.showWebcam = !this.showWebcam;
    }

    handleInitError(error: WebcamInitError) {
        this.errors.push(error);
    }

    changeWebCame(directionOrDeviceId: boolean | string) {
        this.nextWebcam.next(directionOrDeviceId);
    }

    handleImage(webcamImage: WebcamImage) {
        // this.getPicture.emit(webcamImage);
        this.showWebcam = false;
        const arr = webcamImage.imageAsDataUrl.split(',');
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        this.cropImage = new File([u8arr], 'Profile.jpg', {
            type: 'Image/jpeg',
        });
    }

    get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    get nextWebcamObservable(): Observable<boolean | string> {
        return this.nextWebcam.asObservable();
    }

    public imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }

    //Display cropper on selected image
    public imageLoaded() {
        this.showCropper = true;
    }

    public uploadImage() {
        let image: WebcamImage = this.croppedImage;
        const arr = String(image).split(',');
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        let file: File = new File([u8arr], 'Profile.png', {
            type: 'Image/jpeg',
        });
        this.getPicture.emit(file);
    }

    //Select a file
    public fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    cropperReady() {}

    loadImageFailed() {}

    rotateLeft() {
        this.canvasRotation--;
        this.flipAfterRotate();
    }

    rotateRight() {
        this.canvasRotation++;
        this.flipAfterRotate();
    }

    private flipAfterRotate() {
        const flippedH = this.transform.flipH;
        const flippedV = this.transform.flipV;
        this.transform = {
            ...this.transform,
            flipH: flippedV,
            flipV: flippedH,
        };
    }

    flipHorizontal() {
        this.transform = {
            ...this.transform,
            flipH: !this.transform.flipH,
        };
    }

    flipVertical() {
        this.transform = {
            ...this.transform,
            flipV: !this.transform.flipV,
        };
    }

    resetImage() {
        this.scale = 1;
        this.rotation = 0;
        this.canvasRotation = 0;
        this.transform = {};
    }

    zoomOut() {
        this.scale -= 0.1;
        this.transform = {
            ...this.transform,
            scale: this.scale,
        };
    }

    zoomIn() {
        this.scale += 0.1;
        this.transform = {
            ...this.transform,
            scale: this.scale,
        };
    }

    toggleContainWithinAspectRatio() {
        this.containWithinAspectRatio = !this.containWithinAspectRatio;
    }

    updateRotation() {
        this.transform = {
            ...this.transform,
            rotate: this.rotation,
        };
    }
}
