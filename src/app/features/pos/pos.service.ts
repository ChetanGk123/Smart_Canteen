import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { environment } from 'src/environments/environment';

import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class PosService {
    posItemData: any;
    encPassword = environment.encPassword;
    constructor(public authService: AuthService) {}

    setPosItemData(posItemData: any) {
        try {
            this.posItemData = posItemData;
            var enc = CryptoJS.AES.encrypt(
                JSON.stringify(this.posItemData),
                this.encPassword
            ).toString();
            localStorage.setItem('posItemData', enc);
        } catch (error) {
            // //
        }
    }

    deletePosItemData() {
        localStorage.removeItem('posItemData');
    }

    getPosItemData() {
        try {
            var posItemData: any;
            if (this.posItemData) {
                posItemData = this.posItemData;
            } else {
                posItemData = localStorage.getItem('posItemData')
                    ? JSON.parse(
                          CryptoJS.AES.decrypt(
                              localStorage.getItem('posItemData'),
                              this.encPassword.trim()
                          ).toString(CryptoJS.enc.Utf8)
                      )
                    : null;
            }

            if (posItemData) {
                return posItemData;
            } else {
                return null;
            }
        } catch (error) {
            this.authService.logout();
        }
    }

    updatePosItemData(){
        
    }
}
