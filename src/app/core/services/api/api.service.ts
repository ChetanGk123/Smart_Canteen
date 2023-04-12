import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { EnvService } from 'src/app/env.service';
@Injectable({
    providedIn: 'root',
})
export class ApiService {
    public token: string = '';
    public baseUrl = '';
    encPassword = environment.encPassword;
    httpLoginOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    constructor(private _http: HttpClient, public _coreEnvService: EnvService) {
        this.baseUrl = _coreEnvService.config.url;
    }

    getTocken() {
        try {
            var user = JSON.parse(
                CryptoJS.AES.decrypt(
                    localStorage.getItem('user'),
                    this.encPassword.trim()
                ).toString(CryptoJS.enc.Utf8)
            );
            return user.token;
        } catch (error) {
            return '';
        }
    }

    postFileTypeRequest(url: any, payload: any) {
        var httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.getTocken()}`,
            }),
        };
        return this._http
            .post(`${this.baseUrl}${url}`, payload, httpOptions)
            .pipe(
                map((res) => {
                    return res;
                })
            );
    }

    postLoginTypeRequest(url: any, payload: any) {
        return this._http
            .post(`${this.baseUrl}${url}`, payload, this.httpLoginOptions)
            .pipe(
                map((res) => {
                    return res;
                })
            );
    }

    getLogo() {
        return this._http.get(`${this.baseUrl}print_logo_base64`).pipe(
            map((res) => {
                return res;
            })
        );
    }

    postTypeRequest(url: any, payload: any) {
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.getTocken()}`,
            }),
        };
        return this._http
            .post(`${this.baseUrl}${url}`, payload, httpOptions)
            .pipe(
                map((res) => {
                    return res;
                })
            );
    }

    getTypeRequest(url: any) {
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.getTocken()}`,
            }),
        };
        return this._http.get(`${this.baseUrl}${url}`, httpOptions).pipe(
            map((res) => {
                return res;
            })
        );
    }

    putTypeRequest(url: any) {
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.getTocken()}`,
            }),
        };
        return this._http.put(`${this.baseUrl}${url}`, httpOptions).pipe(
            map((res) => {
                return res;
            })
        );
    }
}
