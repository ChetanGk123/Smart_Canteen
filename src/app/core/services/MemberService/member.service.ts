import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

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

    setMemberCardData(memberData: any) {
        try {
            var enc = CryptoJS.AES.encrypt(
                JSON.stringify(memberData),
                this.encPassword
            ).toString();
            localStorage.setItem('memberCardData', enc);
        } catch (error) {
            // //
        }
    }

    deleteMemberCardData() {
        localStorage.removeItem('memberCardData');
    }

    getMemberCardData() {
        try {
            var memberData: any;
                memberData = localStorage.getItem('memberCardData')
                    ? JSON.parse(
                          CryptoJS.AES.decrypt(
                              localStorage.getItem('memberCardData'),
                              this.encPassword.trim()
                          ).toString(CryptoJS.enc.Utf8)
                      )
                    : null;


            if (memberData) {
                return memberData;
            } else {
                return null;
            }
        } catch (error) {
            this.authService.logout();
        }
    }

    setMemberTransactionData(memberData: any) {
        try {
            var enc = CryptoJS.AES.encrypt(
                JSON.stringify(memberData),
                this.encPassword
            ).toString();
            localStorage.setItem('memberTransactionData', enc);
        } catch (error) {
            // //
        }
    }

    deleteMemberTransactionData() {
        localStorage.removeItem('memberTransactionData');
    }

    getMemberTransactionData() {
        try {
            var memberData: any;
                memberData = localStorage.getItem('memberTransactionData')
                    ? JSON.parse(
                          CryptoJS.AES.decrypt(
                              localStorage.getItem('memberTransactionData'),
                              this.encPassword.trim()
                          ).toString(CryptoJS.enc.Utf8)
                      )
                    : null;


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

    setSettings(settings: any) {
        var enc = CryptoJS.AES.encrypt(
            JSON.stringify(settings),
            this.encPassword
        ).toString();
        localStorage.setItem('settings', enc);
    }

    getSettings() {
        try {
            var settings = localStorage.getItem('settings')
                ? JSON.parse(
                      CryptoJS.AES.decrypt(
                          localStorage.getItem('settings'),
                          this.encPassword.trim()
                      ).toString(CryptoJS.enc.Utf8)
                  )
                : null;

            if (settings) {
                return settings;
            } else {
                this.authService.logout();
                return null;
            }
        } catch (error) {
            this.authService.logout();
            return null;
        }
    }

    updateSettings() {}
}
