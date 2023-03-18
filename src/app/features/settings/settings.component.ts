import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/core/interfaces/appconfig';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ConfigService } from 'src/app/core/services/app.config.service';
import { EnvService } from 'src/app/env.service';
import { MemberService } from '../members/member.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    card: string = 'Account Activity';
    public coreConfig: CoreConfig;
    loading: boolean = false;
    tableData: any[] = [];
    memberData: any;
    editIndex: any;
    config: AppConfig;
    editTheme: boolean = false;
    editDateRange: boolean = false;
    constructor(
        public apiService: ApiService,
        public configService: ConfigService,
        public memberService: MemberService,
        public _coreEnvService: EnvService
    ) {
        this.coreConfig = _coreEnvService.config;
    }

    ngOnInit(): void {
        this.editIndex = -1
        this.memberData = this.memberService.getUserData();
        var url
        this.config = this.configService.config;
        if(this.memberData.user_role == "OWNER"){
            url = "table_data/CANTEEN_SETTINGS"
        } else {
            url = "table_data/SETTINGS"
        }
        this.apiService
            .getTypeRequest(`${url}`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.tableData = result?.data;
                    console.log(this.tableData);
                } else {
                    this.tableData = [];
                }
            });
    }

    setCard(cardName) {
        this.card = cardName;
    }

    ChangePassword() {}

    updateSettings(data: any) {
        this.apiService
            .postTypeRequest(`settings_ops/update`,data)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.editDateRange = false
                    this.ngOnInit()
                }
            });
    }

    getThemeCheckedValue(data:any){
        if(data == 'dark'){
            return true;
        } else {
            return false;
        }
    }

    updateThemeCheckedValue(data:any){
        let themeElement = document.getElementById('theme-css');
        let dark: boolean;
        let theme: string;
        if(data.checked){
            this.tableData[0].settings_value = 'dark'
            dark = true;
            theme = 'lara-dark-indigo';
        } else {
            this.tableData[0].settings_value = 'light'
            dark = false;
            theme = 'lara-light-indigo';
        }
        themeElement.setAttribute(
            'href',
            'assets/theme/' + theme + '/theme.css'
        );
        this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
    }

    updateThemeValue(){
        this.editTheme = false
        console.log(this.tableData[0]);
        this.updateSettings(this.tableData[0])
    }
}
