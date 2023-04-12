import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { environment } from 'src/environments/environment';

import * as CryptoJS from 'crypto-js';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class CounterService {
    counterData: any;
    counterProfileData: any;
    encPassword = environment.encPassword;
    constructor(public authService: AuthService) {}
    private counterDateSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
    );
    counterDate$: Observable<any> = this.counterDateSubject.asObservable();
    private counterProfileDateSubject: BehaviorSubject<any> =
        new BehaviorSubject<any>(null);
    counterProfileDate$: Observable<any> =
        this.counterProfileDateSubject.asObservable();

    // Call this method whenever the value of counterDate changes
    updatecounterDate(newValue: any) {
        this.counterDateSubject.next(newValue);
    }

    updatecounterProfileDate(newValue: any) {
        this.counterProfileDateSubject.next(newValue);
    }

    setCounterData(counterData: any) {
        try {
            this.updatecounterDate(counterData);
            this.counterData = counterData;
            var enc = CryptoJS.AES.encrypt(
                JSON.stringify(this.counterData),
                this.encPassword
            ).toString();
            localStorage.setItem('counterData', enc);
        } catch (error) {
            // //
        }
    }
    setCounterProfileData(counterData: any) {
        try {
            this.updatecounterProfileDate(counterData);
            this.counterProfileData = counterData;
            var enc = CryptoJS.AES.encrypt(
                JSON.stringify(this.counterProfileData),
                this.encPassword
            ).toString();
            localStorage.setItem('counterProfileData', enc);
        } catch (error) {
            // //
        }
    }

    deleteCounter() {
        localStorage.removeItem('counterData');
    }

    deleteCounterProfile() {
        localStorage.removeItem('counterProfileData');
    }

    getCounterData() {
        try {
            var counterData: any;
            if (this.counterData) {
                counterData = this.counterData;
            } else {
                counterData = localStorage.getItem('counterData')
                    ? JSON.parse(
                          CryptoJS.AES.decrypt(
                              localStorage.getItem('counterData'),
                              this.encPassword.trim()
                          ).toString(CryptoJS.enc.Utf8)
                      )
                    : null;
            }

            if (counterData) {
                return counterData;
            } else {
                return null;
            }
        } catch (error) {
            this.authService.logout();
        }
    }

    getCounterProfileData() {
        try {
            var counterProfileData: any;
            if (this.counterProfileData) {
                counterProfileData = this.counterProfileData;
            } else {
                counterProfileData = localStorage.getItem('counterProfileData')
                    ? JSON.parse(
                          CryptoJS.AES.decrypt(
                              localStorage.getItem('counterProfileData'),
                              this.encPassword.trim()
                          ).toString(CryptoJS.enc.Utf8)
                      )
                    : null;
            }

            if (counterProfileData) {
                return counterProfileData;
            } else {
                return null;
            }
        } catch (error) {
            this.authService.logout();
        }
    }

    getUserData() {
        var counterData: any;

        counterData = localStorage.getItem('user')
            ? JSON.parse(
                  CryptoJS.AES.decrypt(
                      localStorage.getItem('user'),
                      this.encPassword.trim()
                  ).toString(CryptoJS.enc.Utf8)
              )
            : null;

        if (counterData) {
            return counterData;
        } else {
            this.authService.logout();
            return null;
        }
    }
}
