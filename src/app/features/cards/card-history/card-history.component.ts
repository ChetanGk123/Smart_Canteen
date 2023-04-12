import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { CardDetailsComponent } from './card-details/card-details.component';

@Component({
    selector: 'app-all-cards',
    templateUrl: './card-history.component.html',
    styleUrls: ['./card-history.component.scss'],
})
export class CardHistoryComponent implements OnInit {
    Data: any[] = [];
    loading: boolean = false;
    selectedProduct: any;
    items: MenuItem[];
    constructor(
        public apiService: ApiService,
        public dialogService: DialogService,
        public messageService: MessageService,
        public member: MemberService,
        public router: Router
    ) {}

    ngOnInit(): void {
        this.loadData();
        this.items = [
            /* {
                label: 'View',
                icon: 'pi pi-fw pi-eye',
                // command: () => this.view(),
            },
            {
                label: 'Invalidate Card',
                icon: 'pi pi-fw pi-credit-card',
                // command: () => this.updateCard(),
            },
            {
                separator: true,
            },
            {
                label: 'Activate Member',
                icon: 'pi pi-fw pi-user-plus',
                // command: () => this.Activate(),
            }, */
        ];
    }

    loadData() {
        this.loading = true;
        this.apiService
            .getTypeRequest(`table_data/CARD_UPDATE_DETAILS`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.Data = result.data;
                }
            });
    }

    getCardDetails() {
        this.dialogService.open(CardDetailsComponent, {
            header: `Card Details`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
    }

    openProfile() {
        this.member.setMemberData(this.selectedProduct);
        this.router.navigate(['mess/memberProfile']);
    }
}
