import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class EnvService {
    public config = {
        app: {
            appName: 'Smart Canteen',
            appTitle: 'Smart Canteen',
            appLogoImage: 'assets/logo.png',
            cardNumberLength: 14,
        },
        layout: {
            enableLocalStorage: true,
        },
        url: 'https://test.happyplates.cooksbook.in/',
    };

    constructor() {}
}
