import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
    selector: 'app-lock-screen',
    templateUrl: './lock-screen.component.html',
    styleUrls: ['./lock-screen.component.scss'],
})
export class LockScreenComponent implements OnInit {
    isLoading: boolean;
    constructor(public authService: AuthService) {}

    ngOnInit(): void {}
    async unlockScreen() {
        this.isLoading = true;
        var res = await this.authService.unlockScreen();
        this.isLoading = res;
    }
}
