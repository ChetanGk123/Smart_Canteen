import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    ConfirmationService,
    ConfirmEventType,
    Message,
    MessageService,
} from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LockScreenComponent } from 'src/app/pages/lock-screen/lock-screen.component';

@Injectable({
    providedIn: 'root',
})
export class LockScreenService {
    password: string;
    ref: DynamicDialogRef;
    msgs: Message[] = [];

    constructor(
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public router: Router
    ) {}

    confirm1() {
        this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Are you sure you want to perform this action?',
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: 'You have accepted',
                });
            },
            reject: (type) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Rejected',
                            detail: 'You have rejected',
                        });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Cancelled',
                            detail: 'You have cancelled',
                        });
                        break;
                }
            },
        });
    }

    lockScreen() {
        this.ref = this.dialogService.open(LockScreenComponent, {
            header: 'Unlock',
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
            contentStyle: { 'max-height': '500px', overflow: 'auto' },
            baseZIndex: 10000,
            closable: false,
        });

        this.ref.onClose.subscribe(() => {});
    }

    unlock() {
        this.ref.close();
        this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'You have accepted',
        });
    }

    logout() {
        this.ref.close();
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
    }
}
