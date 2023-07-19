import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/core/interfaces/appconfig';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ConfigService } from 'src/app/core/services/app.config.service';
import { EnvService } from 'src/app/env.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
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
    base_logo_url: any;
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
        this.settingsService.settingsDate$.subscribe(() => {
            //this.getUpdatedSettings()
        });
        this.editIndex = -1;
        this.memberData = this.memberService.getUserData();
        this.getUpdatedSettings();
        this.getOldSettings();
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
                    this.editIndex = -1;
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
        this.getUpdatedSettings();
    }

    updateThemeValue() {
        this.editTheme = false;
        this.updateSettings(this.tableData[0]);
    }

    getUpdatedSettings() {
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
                    this.settingsService.updateSettingsDate(result.data);
                    this.tableData = result?.data;
                    this.tableData[1].settings_value = this.getTrueFalse(1)
                    this.tableData[2].settings_value = this.getTrueFalse(2)
                    this.tableData[4].settings_value = this.getTrueFalse(4)
                    this.tableData[6].settings_value = this.getTrueFalse(6)
                    this.tableData[7].settings_value = this.getTrueFalse(7)
                    var data: [
                        {
                            settings_id: '0';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Theme Color';
                            settings_name: 'THEME_COLOR';
                            settings_value: 'light';
                            isDisplay: '1';
                        },
                        {
                            settings_id: '1';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Date display range';
                            settings_name: 'DATE_RANGE';
                            settings_value: '1';
                            isDisplay: '1';
                        },
                        {
                            settings_id: '2';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Send SMS on every card tap';
                            settings_name: 'SMS_ON_EVERY_TAP';
                            settings_value: '1';
                            isDisplay: '1';
                        },
                        {
                            settings_id: '3';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Minimum Card Balance';
                            settings_name: 'MINIMUM_CARD_BALANCE';
                            settings_value: '100';
                            isDisplay: '1';
                        },
                        {
                            settings_id: '4';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Wallet Type- Prepaid/Postpaid';
                            settings_name: 'WALLET_TRANSACTION_TYPE';
                            settings_value: '0';
                            isDisplay: '1';
                        },
                        {
                            settings_id: '5';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Days for Leave Encashment';
                            settings_name: 'LEAVE_ENCASHMENT_DAYS';
                            settings_value: '3';
                            isDisplay: '1';
                        },
                        {
                            settings_id: '6';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Play sound on successful scan';
                            settings_name: 'SCAN_SUCCESS_SOUND';
                            settings_value: '0';
                            isDisplay: '1';
                        },
                        {
                            settings_id: '7';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Play sound on failure scan';
                            settings_name: 'SCAN_FAILURE_SOUND';
                            settings_value: '1';
                            isDisplay: '1';
                        },
                        {
                            settings_id: '8';
                            counter_id: '1';
                            isCounter: '1';
                            display_label: 'Card Number Length';
                            settings_name: 'CARD_NUMBER_LENGTH';
                            settings_value: '14';
                            isDisplay: '1';
                        }
                    ];
                } else {
                    this.tableData = [];
                }
            });
    }

    getTrueFalse(id:any){
        return this.tableData[id].settings_value == 1?true:false
    }

    getOldSettings() {
        // table_data/SPECIFIC_SETTINGS
        this.loading = true;
        this.apiService
            .getTypeRequest(`specific_data/COUNTER/MY_COUNTER`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.base_logo_url = result.data.logo_url;
                    // console.log(this.base_logo_url);
                }
            });
    }

    async updateLogo(event: any, Url: string) {
        // this.logoLoading = true;
        const formData: FormData = new FormData();
        formData.append('file', event.target.files[0]);
        formData.append('token', this.apiService.getTocken());
        formData.append('item_id', this.memberData?.counter_id);

        await this.apiService
            .postFileTypeRequest(`file_upload/${Url}`, formData)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    // this.messageService.add({
                    //     severity: 'success',
                    //     summary: 'Success',
                    //     detail: result.message,
                    // });
                    this.getUpdatedSettings();
                    this.getOldSettings();
                }
            });
    }
}
