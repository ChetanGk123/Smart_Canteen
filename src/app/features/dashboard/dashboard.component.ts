import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ConfigService } from '../../core/services/app.config.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    constructor(public configService: ConfigService, public apiService: ApiService,
        public member: MemberService,
        public router: Router,) {}

    ngOnInit() {

    }
}
