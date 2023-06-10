import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/core/interfaces/appconfig';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ConfigService } from 'src/app/core/services/app.config.service';
import { EnvService } from 'src/app/env.service';
import { MemberService } from '../members/member.service';
import { SettingsService } from './settings.service';

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
        private settingsService: SettingsService,
        public _coreEnvService: EnvService
    ) {
        this.coreConfig = _coreEnvService.config;
    }

    ngOnInit(): void {


        this.settingsService.settingsDate$.subscribe((newValue) => {
            // Handle updated settingsDate value
            if (newValue == null) {
                newValue = this.settingsService.getSettingsData();
            }
            this.tableData = newValue;
            this.tableData[0].settings_value =
                this.tableData[0].settings_value == 1 ? true : false;
            this.tableData[3].settings_value =
                this.tableData[3].settings_value == 1 ? true : false;
            this.tableData[5].settings_value =
                this.tableData[5].settings_value == 1 ? true : false;
            this.tableData[6].settings_value =
                this.tableData[6].settings_value == 1 ? true : false;
            this.tableData[7].settings_value =
                this.tableData[7].settings_value == 1 ? true : false;
        });
        this.editIndex = -1;
        this.memberData = this.memberService.getUserData();
        console.log(this.memberData);

    }

    setCard(cardName) {
        this.card = cardName;
    }

    ChangePassword() {}

    updateSettings(data: any) {
        if (data.settings_name == 'THEME_COLOR') {
            data.settings_value =
                data.settings_value == 'light' ? 'dark' : 'light';
            this.updateThemeCheckedValue(data);
        } else if (
            data.settings_value == true ||
            data.settings_value == false
        ) {
            data.settings_value = data.settings_value ? 1 : 0;
        }
        this.apiService
            .postTypeRequest(`settings_ops/update`, data)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.editDateRange = false;
                    this.getUpdatedSettings();
                }
            });
    }

    getThemeCheckedValue(data: any) {
        if (data == 'dark') {
            return true;
        } else {
            return false;
        }
    }

    updateThemeCheckedValue(data: any) {
        let themeElement = document.getElementById('theme-css');
        let dark: boolean;
        let theme: string;
        if (data.settings_value == 'dark') {
            dark = true;
            theme = 'lara-dark-indigo';
        } else {
            dark = false;
            theme = 'lara-light-indigo';
        }
        themeElement.setAttribute(
            'href',
            'assets/theme/' + theme + '/theme.css'
        );
        this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
        this.getUpdatedSettings()
    }

    updateThemeValue() {
        this.editTheme = false;
        this.updateSettings(this.tableData[0]);
    }

    getUpdatedSettings(){
        var url;
        this.config = this.configService.config;
        if (this.memberData.user_role == 'OWNER') {
            url = 'table_data/CANTEEN_SETTINGS';
        } else {
            url = 'table_data/SETTINGS';
        }
        this.apiService
            .getTypeRequest(`${url}`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.settingsService.updateSettingsDate(result.data)
                    this.tableData = result?.data;
                    this.tableData[0].settings_value =
                        this.tableData[0].settings_value == 1 ? true : false;
                    this.tableData[3].settings_value =
                        this.tableData[3].settings_value == 1 ? true : false;
                    this.tableData[5].settings_value =
                        this.tableData[5].settings_value == 1 ? true : false;
                    var data: [
                        {
                            settings_id: '1';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Is Send SMS';
                            settings_name: 'IS_SEND_SMS';
                            settings_value: '1';
                        },
                        {
                            settings_id: '2';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Theme Color';
                            settings_name: 'THEME_COLOR';
                            settings_value: 'light';
                        },
                        {
                            settings_id: '8';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Date display range';
                            settings_name: 'DATE_RANGE';
                            settings_value: '10';
                        },
                        {
                            settings_id: '27';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Send SMS on every card tap';
                            settings_name: 'SMS_ON_EVERY_TAP';
                            settings_value: '1';
                        },
                        {
                            settings_id: '28';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Minimum Card Balance';
                            settings_name: 'MINIMUM_CARD_BALANCE';
                            settings_value: '100';
                        },
                        {
                            settings_id: '31';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Wallet Prepaid/Postpaid';
                            settings_name: 'WALLET_TRANSACTION_TYPE';
                            settings_value: '0';
                        }
                    ];
                } else {
                    this.tableData = [];
                }
            });
    }

    getOldSettings(){
        // table_data/SPECIFIC_SETTINGS
        this.apiService
            .getTypeRequest(`table_data/SPECIFIC_SETTINGS`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {}})
    }
}
