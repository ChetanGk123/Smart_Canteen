import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import * as CryptoJS from 'crypto-js';
@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    private settingsData: any;
    private readonly encPassword = environment.encPassword;

    private readonly settingsDateSubject: BehaviorSubject<any> =
        new BehaviorSubject<any>(null);
    settingsDate$: Observable<any> = this.settingsDateSubject.asObservable();

    constructor() {}

    updateSettingsDate(newValue: any) {
        this.settingsDateSubject.next(newValue);
        this.settingsData = newValue;
        this.storeEncryptedData('settingsData', this.settingsData);
    }

    deleteSettings() {
        localStorage.removeItem('settingsData');
        this.settingsData = null;
    }

    getSettingsData() {
        if (this.settingsData) {
            return this.settingsData;
        }

        const storedData = this.getDecryptedData('settingsData');
        if (storedData) {
            this.settingsData = storedData;
            return this.settingsData;
        }

        return null;
    }

    private storeEncryptedData(key: string, data: any) {
        try {
            const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(data),
                this.encPassword
            ).toString();
            localStorage.setItem(key, encryptedData);
        } catch (error) {
            // Handle encryption error
        }
    }

    private getDecryptedData(key: string) {
        try {
            const storedData = localStorage.getItem(key);
            if (storedData) {
                const decryptedData = CryptoJS.AES.decrypt(
                    storedData,
                    this.encPassword.trim()
                ).toString(CryptoJS.enc.Utf8);
                return JSON.parse(decryptedData);
            }
        } catch (error) {
            // Handle decryption error
        }

        return null;
    }
}
