import { Component, OnInit } from '@angular/core';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ConfigService } from 'src/app/core/services/app.config.service';
import { EnvService } from 'src/app/env.service';
import { MemberService } from '../members/member.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    card:string = "Account Activity";
    public coreConfig:CoreConfig
    loading: boolean = false;
    tableData: any;
    memberData:any
  constructor(
    public apiService: ApiService,
    public configService: ConfigService,
    public memberService: MemberService,
    public _coreEnvService: EnvService,) {
        this.coreConfig =  _coreEnvService.config}

  ngOnInit(): void {
    this.memberData = this.memberService.getUserData();
    this.apiService
    .getTypeRequest(`table_data/CANTEEN_SETTINGS`)
    .toPromise()
    .then((result: any) => {
        this.loading = false;
        if (result.result) {
        this.tableData = result?.data;
        } else {
            this.tableData = []
        }
    });
  }

  setCard(cardName){
    this.card = cardName
  }

  ChangePassword(){}
}
