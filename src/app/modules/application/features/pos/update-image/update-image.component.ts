import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
    selector: 'app-update-image',
    templateUrl: './update-image.component.html',
    styleUrls: ['./update-image.component.scss'],
})
export class UpdateImageComponent implements OnInit {
    loading: boolean = false;
    form: FormGroup = new FormGroup({
        file: new FormControl(),
    });
    url;
    constructor(
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        protected _sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {}

    handleImage(event: any) {
        this.form.get('file').setValue(event.target.files[0]);
        var reader = new FileReader();

        reader.onload = (event: any) => {
            this.url = event.target.result;
        };

        reader.onerror = (event: any) => {
            console.log('File could not be read: ' + event.target.error.code);
        };

        reader.readAsDataURL(event.target.files[0]);
    }

    sanitizrFile(filename: any) {
        return this._sanitizer.bypassSecurityTrustUrl(filename);
    }

    async submitClick() {
        this.loading = true;
        const formData: FormData = new FormData();
        formData.append('file', this.form.get('file').value);
        formData.append('token', this.apiService.getTocken());
        formData.append('item_id', this.config.data.id);

        await this.apiService
            .postFileTypeRequest(this.config.data.Url, formData)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.ref.close(true);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error!',
                        detail: result.message,
                    });
                }
            })
            .finally(() => {
                this.loading = false;
            });
    }
}
