import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { environment } from 'src/environments/environment';

import * as CryptoJS from 'crypto-js';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CounterService {

    counterData: any;
    encPassword = environment.encPassword;
    constructor(public authService: AuthService) {
    }
    private counterDateSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    counterDate$: Observable<any> = this.counterDateSubject.asObservable();


    // Call this method whenever the value of counterDate changes
    updatecounterDate(newValue: any) {
        this.counterDateSubject.next(newValue);
    }

    setCounterData(counterData: any) {
        try {
            this.updatecounterDate(counterData)
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

    deleteCounter() {
        localStorage.removeItem('counterData');
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
