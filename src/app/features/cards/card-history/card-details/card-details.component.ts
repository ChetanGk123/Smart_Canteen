import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { EnvService } from 'src/app/env.service';

@Component({
    selector: 'app-card-details',
    templateUrl: './card-details.component.html',
    styleUrls: ['./card-details.component.scss'],
})
export class CardDetailsComponent implements OnInit {
    loading: boolean = false;
    cardNumber: FormControl = new FormControl('');
    Data: any[];
    public coreConfig: CoreConfig;
    constructor(
        public dialogService: DialogService,
        public apiService: ApiService,
        public _coreEnvService: EnvService,
        public messageService: MessageService
    ) {
        // this.results = this.cardNumber.valueChanges.pipe(
        //     map((search) => search.trim()),
        //     debounceTime(500),
        //     distinctUntilChanged(),
        //     filter((search) => search !== ''),
        //     switchMap((search) =>
        // );
        this.coreConfig = _coreEnvService.config;
    }

    ngOnInit(): void {}

    getCardDetails() {
        /* if (
            this.cardNumber.value.length == this.coreConfig.app.cardNumberLength
        )  */{
            this.loading = true;
            const cardNumber = this.cardNumber.value
            this.cardNumber.reset();
            this.apiService
                .getTypeRequest(
                    `card_update_details/CARD_NUMBER/${cardNumber}`
                )
                .toPromise()
                .then((resopnse: any) => {
                    if (resopnse.result) {
                        this.Data = resopnse.data;

                        this.messageService.add({
                            severity: 'success',
                            summary: resopnse.message,
                            detail: 'Found Card Details.',
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: resopnse.message,
                            detail: 'Card Details Not Found.',
                        });

                    }
                })
                .finally(() => (this.loading = false));
        }
    }
}
