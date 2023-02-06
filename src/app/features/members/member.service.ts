import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { environment } from 'src/environments/environment';

import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class MemberService {
    memberData: any;
    encPassword = environment.encPassword;
    constructor(public authService: AuthService) {}

    setMemberData(memberData: any) {
        try {
            this.memberData = memberData;
            var enc = CryptoJS.AES.encrypt(
                JSON.stringify(this.memberData),
                this.encPassword
            ).toString();
            localStorage.setItem('memberData', enc);
        } catch (error) {
            // //
        }
    }

    deleteMember() {
        localStorage.removeItem('memberData');
    }

    getMemberData() {
        try {
            var memberData: any;
            if (this.memberData) {
                memberData = this.memberData;
            } else {
                memberData = localStorage.getItem('memberData')
                    ? JSON.parse(
                          CryptoJS.AES.decrypt(
                              localStorage.getItem('memberData'),
                              this.encPassword.trim()
                          ).toString(CryptoJS.enc.Utf8)
                      )
                    : null;
            }

            if (memberData) {
                return memberData;
            } else {
                return null;
            }
        } catch (error) {
            this.authService.logout();
        }
    }

    getUserData() {
        var memberData: any;

        memberData = localStorage.getItem('user')
            ? JSON.parse(
                  CryptoJS.AES.decrypt(
                      localStorage.getItem('user'),
                      this.encPassword.trim()
                  ).toString(CryptoJS.enc.Utf8)
              )
            : null;

        if (memberData) {
            return memberData;
        } else {
            this.authService.logout();
            return null;
        }
    }
}
