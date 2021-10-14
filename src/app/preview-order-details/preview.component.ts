import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {AuthServices} from '../services/auth.services';
import {NotificationService} from '../services/notification.service';

declare let $: any;

@Component({
  selector: 'app-preview-status',
  templateUrl: './preview.component.html',
})
export class PreViewStatusComponent implements OnInit {
  ENV = environment;


  constructor(private router: Router, private http: HttpClient,  private route: ActivatedRoute, protected apiServices: ApiServices, protected authServices: AuthServices, protected notificationServices: NotificationService) {

  }
  ngOnInit(): void {


  }




}
